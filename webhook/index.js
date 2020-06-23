const express = require("express"),
    router = express.Router(),
    db = require('../models');

const dialogflow = require('dialogflow');
const dialogflowSessionClient =
    require('./dialogflow_session_client.js');
// const path = require('path')
// const utils = require('./utils')

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
    let responseText = "";

    const formattedParent = contextClient.sessionPath(projectId, id)
    contextClient.listContexts({parent: formattedParent})
        .then(responses => {
            const cNames = responses[0];
            for (cName of cNames){
                if (cName == "share_loc" || "connect_with_hospital"){
                    responseText = userController.addLocation(body);
                    contextClient.deleteContext({parent: formattedParent})
                        .catch(err => responseText += ("\n" + err));
                }
                if(cName == "book_consultation"){
                    let user = await db.userWA.findOne(where: {
                        wa_phone_number: id
                    });
                    db.patientWA.findAll({where: { user_id : user.id}).then(patients =>
                      if(patients.length != 0){
                        contextClient.deleteAllContexts({parent: formattedParent}).catch(err => {
                          console.error(err);
                        });
                        const context = "check_patient";
                        const request = {
                          parent: formattedParent,
                          context: context,
                        };
                        contextClient.createContext(request).catch(err => {
                          console.error(err);
                        });
                      }
                    )
                }
            }
        })
        .catch(err => responseText = err);

    const dialogflowResponse = (await sessionClient.detectIntent(
        text, id, body)); // Gets intent
    responseText += dialogflowResponse.fulfillmentText; // Gets default fulfillment text
    const twiml = new MessagingResponse();

    //Check if incoming phone number is in the database
    function isUser(id, callback) {
        db.userWA.findOne({
            where: {
                wa_phone_number: id
            }
        })
        .then(response => {
            return callback(response);
        })
        .catch(error => {
            console.error(error);
        });
    };

    // INTENTS
    // Directly send response if paramenters not complete.
    if(!dialogflowResponse.queryResult.allRequiredParamsPresent){
        responseText = dialogflowResponse.queryResult.fulfillmentText;
    }
    // Default Welcome Intent
    else if (dialogflowResponse.intent.displayName === 'Default Welcome Intent') {

        //Redirects to different intents depending on number present in db
        isUser(id.substring(10),function(result){
            if(result!=null){
                responseText = responseText +'\n\n(3) PATIENT\n(4) PATIENT FIRST WORKFLOW\n(5) PATIENT NEXT WORKFLOW';
            }
            else{
                responseText = responseText +'\n\n(1) Would you like to register?\n(2) More Information';
            }

            const message = twiml.message(responseText);
            res.send(twiml.toString());
        });
    }

    // List of doctors intent
    else if (dialogflowResponse.intent.displayName === 'List of doctors') {
        const doctors = await db.doctors.findAll({}).map(
            el => el.get('first_name') + " " + el.get('last_name')
        );
        responseText = responseText + "\n" + doctors.join("\n");

        const message = twiml.message(responseText);
        res.send(twiml.toString());
    }

    //User details Intent
    else if (dialogflowResponse.intent.displayName === 'User Profile') {

        isUser(id.substring(10),function(result){
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
        responseText = await userController.addPatientInfoIntent(dialogflowResponse.queryResult, body);
    }
    else if (dialogflowResponse.intent.displayName === 'check_patient_profile') { // Check single patient // Needs more work
        responseText = await userController.show(dialogflowResponse.queryResult, body);
    }
    else if (dialogflowResponse.intent.displayName === 'list_of_patients') { // Complete list fo all patients
        responseText = await userController.liste(dialogflowResponse.queryResult, body);
    }
    else if (dialogflowResponse.intent.displayName === 'register_another_patient') { // Register a new Patient
        responseText = await userController.newPatientIntent(dialogflowResponse.queryResult, body);
    }
    else if (dialogflowResponse.intent.displayName === 'user_details') { // New User Intent
        responseText = await userController.newUserIntent(dialogflowResponse.queryResult, body);
    }
    // Patient First Workflow Intents
    else if (dialogflowResponse.intent.displayName === 'book_consultation') { // Book Consultation
        responseText = await consultController.bookConsulation(dialogflowResponse.queryResult, body);
    }
    else if (dialogflowResponse.intent.displayName === 'patient_info') { // List of patients for consultation
        responseText = await consultController.patientInfo(dialogflowResponse.queryResult, body);
    }
    // Intents with static response handled from dialogflow console
    else responseText = dialogflowResponse.queryResult.fulfillmentText;

    const message = twiml.message(responseText);
    res.send(twiml.toString);

    const message = twiml.message(responseText);
    res.send(twiml.toString);

    const message = twiml.message(responseText);
    res.send(twiml.toString());
});

module.exports = router;
