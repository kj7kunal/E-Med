const express = require("express"),
    router = express.Router(),
    db = require('../models');

const projectId = process.env.DIALOGFLOW_PROJECT;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const dialogflowSessionClient = require('./dialogflow_session_client.js'),
    sessionClient = new dialogflowSessionClient(projectId),
    client = require('twilio')(accountSid, authToken),
    MessagingResponse = require('twilio').twiml.MessagingResponse;

const StartWorkflowController = require('./handlers/start_workflow.js'),
    startController = new StartWorkflowController();

router.post('/api/chat/', async function(req, res) {
    const body = req.body;
    const text = body.Body;
    const id = body.From; // User Whatsapp number (for auth stuff)

    const dialogflowResponse = (await sessionClient.detectIntent(
        text, id, body)); // Gets intent
    let responseText = dialogflowResponse.fulfillmentText; // Gets default fulfillment text
    const twiml = new MessagingResponse();

    // INTENTS
    // Default Welcome Intent
    if (dialogflowResponse.intent.displayName === 'Default Welcome Intent') {
        responseText = await startController.welcome(dialogflowResponse, id.substring(10));
    }

    // //User details Intent
    // else if (dialogflowResponse.intent.displayName === 'User Profile') {
    //     responseText = await startController.showUserDetails(dialogflowResponse, id.substring(10));
    // }

    // Intents with static response handled from dialogflow console
    else {
        responseText = dialogflowResponse.fulfillmentText;
    }

    const message = twiml.message(responseText);
    res.send(twiml.toString());
});

module.exports = router;
