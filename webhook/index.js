const express = require("express"),
    router = express.Router(),
    db = require('../models'),
    utils = require("./handlers/utils.js");

const dialogflow = require('dialogflow');
const dialogflowSessionClient =
    require('./dialogflow_session_client.js');
// const path = require('path')
// const utils = require('./utils')

const projectId = process.env.DIALOGFLOW_PROJECT;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const keyFilename = "./config/credentials.json";
const sessionClient = new dialogflowSessionClient(projectId);
const contextClient = new dialogflow.v2.ContextsClient({projectId, keyFilename: keyFilename});

const userRegistrationController = require('./handlers/UserController.js');
const userController = new userRegistrationController();

router.post('/api/chat/', async function(req, res) {
    const body = req.body;
    const text = body.Body;
    console.log("Message Received: " + text);
    const id = body.From; // User Whatsapp number (for auth stuff)
    console.log("Message from: " + id);
    let responseText = "";

    const formattedParent = contextClient.sessionPath(projectId, id);
    contextClient.listContexts({parent: formattedParent})
        .then(responses => {
          const cNames = responses[0];
            for (cName of cNames){
                let ctxtName = cName.name.split("/").slice(-1).pop();
                console.log(ctxtName);
                if ( ctxtName == "share_loc"){
                    responseText = userController.addLocation(body);
                    contextClient.deleteContext({parent: formattedParent})
                        .catch(err => responseText += ("\n" + err));
                }
            }
        })
        .catch(err => responseText = err);

    const dialogflowResponse = await sessionClient.detectIntent(text, id, body).catch(err => {console.log(err);}); // Gets intent
    console.log(dialogflowResponse);
    responseText += dialogflowResponse.fulfillmentText; // Gets default fulfillment text
    const twiml = new MessagingResponse(); // Comment for twilio

    // Setting the Intent for Testing Purposes:
    if (body.intent)
        dialogflowResponse.intent.displayName = body.intent;

    // INTENTS
    // Directly send response if paramenters not complete.
    if(!dialogflowResponse.allRequiredParamsPresent){
        responseText = dialogflowResponse.fulfillmentText;
    }
    // Default Welcome Intent
    else if (dialogflowResponse.intent.displayName === 'Default Welcome Intent') {

        //Redirects to different intents depending on number present in db
        utils.isUser(id.substring(10),function(result){
            if(result!=null){
                responseText = ('Welcome back, ' +result.dataValues.first_name+' '+result.dataValues.last_name + '!\n'
                                +'How can we help you today? Please choose from the following options:\n'
                                +'(1) Register a new patient\n'
                                +'(2) Check/Update existing patient\n'
                                +'(3) Book a new consultation\n'
                                +'(4) Follow up on existing consultation\n'
                                +'(5) More Information about us\n');
            }
            else{
                responseText = ('Welcome to E-Medic, a non-profit initiative to provide primary healthcare during COVID-19.\n'
                                + 'How can we help you today? Please choose from the following options:\n'
                                +'(1) Register as a user\n'
                                +'(2) More Information about us\n');
            }

            //const message = twiml.message(responseText);
            //res.send(twiml.toString());
            //res.send(message);
        });
    }

    // List of doctors intent
    else if (dialogflowResponse.intent.displayName === 'List of doctors') {
        const doctors = await db.doctors.findAll({}).map(
            el => el.get('first_name') + " " + el.get('last_name')
        );
        responseText = responseText + "\n" + doctors.join("\n");

        //const message = twiml.message(responseText);
        //res.send(twiml.toString());
    }

    //User details Intent
    else if (dialogflowResponse.intent.displayName === 'User Profile') {

        utils.isUser(id.substring(10),function(result){
            if(result!=null){

                responseText = responseText + "\n" + 'Name: '+result.dataValues.first_name+' '+result.dataValues.last_name;
                responseText = responseText + "\n" + 'WhatsApp phone number: '+result.dataValues.wa_phone_number;
                responseText = responseText + "\n" + 'Email: '+result.dataValues.email;
            }
            else {
                responseText = responseText + "\n" + 'You are not a registered user. Please register to avail our service.\n';
            }

            const message = twiml.message(responseText);
            res.send(twiml.toString());
        });
    }
    else if (dialogflowResponse.intent.displayName === 'register_yourself') { // Register Yourself Intent
        responseText = await userController.addPatientInfoIntent(dialogflowResponse, body);
    }
    else if (dialogflowResponse.intent.displayName === 'check_patient_profile') { // Check single patient // Needs more work
        responseText = await userController.show(dialogflowResponse, body);
    }
    else if (dialogflowResponse.intent.displayName === 'list_of_patients') { // Complete list fo all patients
        responseText = await userController.liste(dialogflowResponse, body);
    }
    else if (dialogflowResponse.intent.displayName === 'register_another_patient') { // Register a new Patient
        responseText = await userController.newPatientIntent(dialogflowResponse, body);
    }
    else if (dialogflowResponse.intent.displayName === 'user_details') { // New User Intent
        responseText = await userController.newUserIntent(dialogflowResponse, body);
    }
    // Intents with static response handled from dialogflow console
    else responseText = dialogflowResponse.fulfillmentText;

    const message = twiml.message(responseText);
    res.send(twiml.toString());
    //res.send(responseText);

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
