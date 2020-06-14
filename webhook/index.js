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
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

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
        
    var responseText = dialogflowResponse.fulfillmentText; // Gets default fulfillment text

    //Check if phone number is in the database
    function isUser(id, callback) {
        db.userWA.findOne({
            where:{wa_phone_number: id.substring(10)}
        })
        .then(response => {
            return callback(response);
        });
    };

    // INTENTS
    // Default Welcome Intent
    if (dialogflowResponse.intent.displayName === 'Default Welcome Intent') {

        //Redirects to different intents depending on number present in db
        isUser(id,function(result){
            if(result==null){
                responseText=responseText+'\n1. Would you like to register?\n2. More Information';
            }
            else{
                responseText=responseText+'\n3. PATIENT\n4. PATIENT FIRST WORKFLOW\n5. PATIENT NEXT WORKFLOW';
            }
        });
    }


    // List of doctors intent
    if (dialogflowResponse.intent.displayName === 'List of doctors') {
        const doctors = await db.doctors.findAll({}).map(
            el => el.get('first_name') + " " + el.get('last_name')
        );
        responseText = responseText + "\n" + doctors.join("\n");
    }
    
    
    //User details Intent
    if (dialogflowResponse.intent.displayName === 'User Profile') {

        isUser(id,function(result){
            if(result!=null){
                
                responseText = responseText + "\n" + 'Name: '+result.dataValues.first_name+' '+result.dataValues.last_name;
                responseText = responseText + "\n" + 'WhatsApp phone number: '+result.dataValues.wa_phone_number;
                responseText = responseText + "\n" + 'Email: '+result.dataValues.email;
            }else{
                responseText = responseText + "\n" + 'You are not a registered user. Please register to avail our service.\n';
            }
        
        });
        
    }
    
    //More Info Intent
    if (dialogflowResponse.intent.displayName === 'More Info') {
        responseText = responseText + "\n" + 'For anything you like to know about us please refer to the link below:\n https://www.linkedin.com/company/combat-covid-19-iit-kgp-initiative/';
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
