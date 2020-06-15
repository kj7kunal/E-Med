const express = require("express"),
    router = express.Router(),
    db = require('../models'),
    utils = require("./handlers/utils.js");

const dialogflow = require('dialogflow');
const dialogflowSessionClient =
    require('./dialogflow_session_client.js');
// const path = require('path')
// const utils = require('./utils')

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
//const keyFilename = "./config/credentials.json";
const sessionClient = new dialogflowSessionClient(projectId);
const contextClient = new dialogflow.v2.ContextsClient(projectId);

const StartWorkflowController = require('./handlers/start_workflow.js'),
    startController = new StartWorkflowController();

const userRegistrationController = require('./handlers/UserController.js');
const userController = new userRegistrationController();

router.post('/api/chat/', async function(req, res) {
    const body = req.body;
    const text = body.Body;
    console.log("Message Received: " + text);
    const id = body.From; // User Whatsapp number (for auth stuff)
    let responseText = "";

    const formattedParent = contextClient.sessionPath(projectId, id)
    contextClient.listContexts({parent: formattedParent})
        .then(responses => {
            const cNames = responses[0];
            for (cName of cNames)
                if (cName == "share_loc")
                    responseText = userController.addLocation(body);
                    const contextName = client.contextPath(projectId, id, cName);
                    contextClient.deleteContext({name: contextName})
                        .catch(err => responseText += ("\n" + err));
                }
            }
        })
        .catch(err => responseText = err);

    const dialogflowResponse = (await sessionClient.detectIntent(
        text, id, body)); // Gets intent
    const twiml = new MessagingResponse();

    /* Setting the Intent for Testing Purposes:
    if (body.intent)
        dialogflowResponse.intent.displayName = body.intent;
    */
    // INTENTS
    // Directly send response if paramenters not complete.
    if(!dialogflowResponse.allRequiredParamsPresent){
        responseText = dialogflowResponse.fulfillmentText;
    }
    // Default Welcome Intent
    else if (dialogflowResponse.intent.displayName === 'Default Welcome Intent')
        responseText = await startController.welcome(dialogflowResponse, id.substring(10));
    // List of doctors intent
    else if (dialogflowResponse.intent.displayName === 'List of doctors') {
        const doctors = await db.doctors.findAll({}).map(
            el => el.get('first_name') + " " + el.get('last_name')
        );
        responseText = responseText + "\n" + doctors.join("\n");
    }

    //User details Intent
    else if (dialogflowResponse.intent.displayName === 'User Profile') {
        responseText = await userController.showUserDetails(dialogflowResponse, id);
        // utils.isUser(id.substring(10),function(result){
        //     if(result!=null){

        //         responseText = responseText + "\n" + 'Name: '+result.dataValues.first_name+' '+result.dataValues.last_name;
        //         responseText = responseText + "\n" + 'WhatsApp phone number: '+result.dataValues.wa_phone_number;
        //         responseText = responseText + "\n" + 'Email: '+result.dataValues.email;
        //     }
        //     else {
        //         responseText = responseText + "\n" + 'You are not a registered user. Please register to avail our service.\n';
        //     }
        // });
    }
    else if (dialogflowResponse.intent.displayName === 'register_yourself') { // Register Yourself Intent
        responseText = await userController.addPatientInfo(dialogflowResponse, body);
    }
    else if (dialogflowResponse.intent.displayName === 'check_patient_profile') { // Check single patient // Needs more work
        responseText = await userController.checkPatientDetails(dialogflowResponse, body);
    }
    else if (dialogflowResponse.intent.displayName === 'list_of_patients') { // Complete list fo all patients
        responseText = await userController.listUserPatients(dialogflowResponse, body);
    }
    else if (dialogflowResponse.intent.displayName === 'register_another_patient') { // Register a new Patient
        responseText = await userController.newPatient(dialogflowResponse, body);
    }
    else if (dialogflowResponse.intent.displayName === 'user_details') { // New User Intent
        responseText = await userController.createNewUser(dialogflowResponse, body);
    }
    // Intents with static response handled from dialogflow console
    else {
        responseText = dialogflowResponse.fulfillmentText;
    }
    const message = twiml.message(responseText);
    res.send(twiml.toString);
});

module.exports = router;
