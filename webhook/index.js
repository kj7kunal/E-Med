const express = require("express"),
    router = express.Router(),
    db = require('../models');
//const check_num_indb = require('./handlers/test/sayani.js');
const dialogflowSessionClient =
    require('./dialogflow_session_client.js');
 const path = require('path')
 const utils = require('./utils')

const projectId = process.env.DIALOGFLOW_PROJECT;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
const accountSid = process.env.TWILIO_ACCOUNT_SID || 'AC09cbfc8e14f69b85ece64eb5f78db0db';
const authToken = process.env.TWILIO_AUTH_TOKEN || '3ade0e52b95f6a00ce1972daebb07e7a';

const client = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const sessionClient = new dialogflowSessionClient(projectId);

router.post('/api/chat/', async function(req, res) {
    const body = req.body;
    const text = body.Body;
    const id = body.From; // User Whatsapp number (for auth stuff)

    const dialogflowResponse = (await sessionClient.detectIntent(
        text, id, body)); // Gets intent
        //dialogflowResponse=check_num_indb(dialogflowResponse,id);
        
        db.userWAs.findOne({
            where: {
                wa_phone_number: id
            }
        }).then((result) => {
            const hbsObject = {
                    User: result
                }
                if (result==null){
                    dialogflowResponse.outputContext[0].name="projects/e-medicine-iitkgp-mvttlt/agent/sessions/"+id +"/contexts/not_reg";
                    dialogflowResponse.outputContext[0].lifespanCount= 5;
                    //dialogflowResponse.outputContext.parameters=[Object];
                }
                else if(result.dataValues.type =='doctor'){
                    dialogflowResponse.outputContext[0].name="projects/e-medicine-iitkgp-mvttlt/agent/sessions/"+id +"/contexts/doctor";
                    dialogflowResponse.outputContext[0].lifespanCount= 5;
                    //dialogflowResponse.outputContext.parameters=[Object];
                }
                else if(result.dataValues.type =='patient'){
                    dialogflowResponse.outputContext[0].name="projects/e-medicine-iitkgp-mvttlt/agent/sessions/"+id +"/contexts/patient";
                    dialogflowResponse.outputContext[0].lifespanCount= 5;
                    //dialogflowResponse.outputContext.parameters=[Object];
                }
            
        })
        .catch((e)=>{
            console.log('\nERROR OCUURED\n');
            console.log(e);
        })
        
    
    var responseText = dialogflowResponse.fulfillmentText; // Gets default fulfillment text

    // INTENTS
    // List of doctors intent
    if (dialogflowResponse.intent.displayName === 'List of doctors') {
        const doctors = await db.doctors.findAll({}).map(
            el => el.get('first_name') + " " + el.get('last_name')
        );
        responseText = responseText + "\n" + doctors.join("\n");
    }
    const isUser=function(id){
        db.userWA.findOne({where:{wa_phone_number: id}}).then((result)=>{
            if(result!=null){
                return false;
            }
            else{
                return true;
            }
        })
    };
    //user details
    if (dialogflowResponse.intent.displayName === 'User Profile') {
        db.userWA.findOne({where:{wa_phone_number: id}}).then((result)=>{
            if(result!=null){
                //console.log('Name: '+result.dataValues.first_name+' '+result.dataValues.last_name);
                responseText = responseText + "\n" + 'Name: '+result.dataValues.first_name+' '+result.dataValues.last_name;
                //console.log('WhatsApp phone number: '+result.dataValues.wa_phone_number);
                responseText = responseText + "\n" + 'WhatsApp phone number: '+result.dataValues.wa_phone_number;
                //console.log('Email: '+result.dataValues.email);
                responseText = responseText + "\n" + 'Email: '+result.dataValues.email;
            }
            else{
                responseText = responseText + "\n" + 'You are not a registered user. Please register to avail our service.\n';
            }
            
        });
        //responseText = responseText + "\n" + doctors.join("\n");
    }
    //More Info
    if (dialogflowResponse.intent.displayName === 'More Info') {

        
        responseText = responseText + "\n" + 'For anything you like to know about us please refer to the link below:\n https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.linkedin.com%2Fcompany%2Fcombat-covid-19-iit-kgp-initiative%2F%3Ffbclid%3DIwAR10hvzezNNmFFShdzj1PUEsMuzmQBCYcweJlKSQt-ujM7HPm9GjX1FLjew&h=AT3jSDMYRNPAqeNcYX6LQ2qUOUND3WnZbnG9-YyyzhVP1wUKZ7t-5mSUyA6nLmFusKdUiN2kl9lvHTJL_J8b9du7eIIJn3Cv25t3Jafeyw-a8jbv3SBOEqExlkehMCSjOgKtu1w0nr0bF_wu0Qmm2w';
            
        //responseText = responseText + "\n" + doctors.join("\n");
    }

    
    

    const twiml = new  MessagingResponse();
    const message = twiml.message(responseText);
    res.send(twiml.toString());
});

// // Load the handlers from the handler folder
// let handlers = {}
// utils.getFoldersNameInFolder(path.join(__dirname, 'handlers')).forEach(folderName => {
//     let categorizedModules = utils.loadModulesFromFolder(path.join(__dirname, 'handlers', folderName))
//     Object.keys(categorizedModules).forEach(moduleName => {
//         handlers[`${folderName}/${moduleName}`] = categorizedModules[moduleName]
//     })
// })
//
// // Function that selects the appropriate handler based on the action triggered by the agent
// const interactionHandler = interaction => {
//     // Retrieve the handler of the triggered action
//     let handler = handlers[interaction.action]
//
//     // If the action has a handler, the Promise of the handler is returned
//     if (handler) return handler(interaction)
//     // If the action has no handler, a rejected Promise is returned
//     else return Promise.reject(new Error(`unhandled action ${interaction.action}`))
// }
//
// // Function that handles the request of the agent and sends back the response
// const requestHandler = (req, res) => {
//     let body = req.body
//
//     // Build the interaction object
//     let interaction = {
//         action: body.result.action,
//         parameters: body.result.parameters,
//         response: {}
//     }
//
//     // Handle the Promise returned by the action handler
//     interactionHandler(interaction)
//         .then(() => {
//             // If the action handler succeeded, return the response to the agent
//             res.json(interaction.response)
//         })
//         .catch(e => {
//             // If the action handler failed, print the error and return the response to the agent
//             console.log(e)
//             res.json(interaction.response)
//         })
//     // In both cases, whether the Promise resolves or is rejected, the response is sent back
//     // to the agent
// }
//
// module.exports = requestHandler

module.exports = router;