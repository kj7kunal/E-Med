const express = require("express"),
    router = express.Router(),
    db = require('../models'),
    dialogflow = require('dialogflow');

const projectId = process.env.DIALOGFLOW_PROJECT;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const dialogflowSessionClient = require('./dialogflow_session_client.js'),
    sessionClient = new dialogflowSessionClient(projectId),
    dialogflowContextClient = require('./dialogflow_context_client.js'),
    contextClient = new dialogflowContextClient(projectId),
    client = require('twilio')(accountSid, authToken),
    MessagingResponse = require('twilio').twiml.MessagingResponse;

// const contextClient = new dialogflow.v2.ContextsClient(projectId);

const StartWorkflowController = require('./handlers/start_workflow.js'),
    startController = new StartWorkflowController();

const UserRegistrationController = require('./handlers/user_registration_workflow.js'),
    userRegController = new UserRegistrationController();

router.post('/api/chat/', async function(req, res) {
    const body = req.body;
    const text = body.Body;
    console.log("Message Received: " + text); //remove before deploying
    const id = body.From; // User Whatsapp number (for auth stuff)
    let responseText = "";

    // const formattedParent = contextClient.sessionPath(projectId, id)
    // contextClient.listContexts({parent: formattedParent})
    //     .then(responses => {
    //         const cNames = responses[0];
    //         for (cName of cNames){
    //             if (cName == "share_loc"){
    //                 responseText = userRegController.addLocation(body);
    //                 const contextName = client.contextPath(projectId, id, cName);
    //                 contextClient.deleteContext({name: contextName})
    //                     .catch(err => responseText += ("\n" + err));
    //             }
    //         }
    //     })
    //     .catch(err => responseText = err);

    const dialogflowResponse = (await sessionClient.detectIntent(
        text, id, body)); // Gets intent
    const twiml = new MessagingResponse();

    console.log("DF Response: ");
    console.log(dialogflowResponse); //remove before deploying
    console.log("Agent parameters: ");
    console.log(dialogflowResponse.parameters); //remove before deploying


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
    else if (dialogflowResponse.intent.displayName === 'Default Welcome Intent') {
        responseText = await startController.welcome(contextClient, dialogflowResponse, id);
    }
    // Confirm and Create New User Intent
    else if (dialogflowResponse.intent.displayName === 'userReg.confirm_new_user') {
        responseText = await userRegController.createNewUser(dialogflowResponse, id.substring(10));
    }
    // Show User details Intent
    else if (dialogflowResponse.intent.displayName === 'userReg.show_user_profile') {
        responseText = await userRegController.showUserDetails(dialogflowResponse, id.substring(10));
    }
    // Confirm and Create New Patient Intent
    else if (dialogflowResponse.intent.displayName === 'userReg.confirm_new_patient') {
        responseText = await userRegController.createNewPatient(dialogflowResponse, id.substring(10));
    }
    // Confirm and Add Patient Detailed Information Intent
    else if (dialogflowResponse.intent.displayName === 'userReg.confirm_patient_details') {
        responseText = await userRegController.addPatientInfo(dialogflowResponse, id.substring(10));
    }
    // List User Patients
    else if (dialogflowResponse.intent.displayName === 'userReg.list_of_patients') {
        responseText = await userRegController.listUserPatients(dialogflowResponse, id.substring(10));
    }
    // Check Single Patient Profile (need to add update patient prompt later)
    else if (dialogflowResponse.intent.displayName === 'userReg.check_patient_profile') {
        responseText = await userRegController.checkPatientDetails(dialogflowResponse, id.substring(10));
    }
    // Intents with static response handled from dialogflow console
    else {
        responseText = dialogflowResponse.fulfillmentText;
    }

    const message = twiml.message(responseText);
    res.send(twiml.toString());
});

module.exports = router;
