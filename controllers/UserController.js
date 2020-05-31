const express = require("express"),
    router = express.Router(),
    db = require('../models'),
    isAuthenticated = require("../config/middleware/isAuthenticated"),
    passport = require("../config/passport");

//const { WebhookClient } = require('dialogflow-fulfillment');

class UserRegistrationController {
  
  newUserIntent(agent, body) {
    console.log("Storing new User in DB");
    let fName = agent.parameters["user-given-name"];
    let cNum = body.From.toSring();

    if(db.userWA.findAll({where: {phone_number: cNum}}).length > 0) return "Phone Number already Exists";
    fulfillmentText = "Hi " + fName + ", welcome to E-Medic. Please check your mail for a confirmation email from us.\
            \nMeanwhile please share your location in the chat. Clip Icon -> Location";
    db.userWA.create({
            "first_name": fName,
            "last_name": agent.parameters["last-name"],
            "email": agent.parameters["email"],
            "wa_phone_number": cNum
        })
        .then(() => {
            return fulfillmentText;
        })
        .catch(err => return err);
  }

  addLocation(body){    
    db.userWA.update({
      loc_long: body.Logitude.toSring(),
      loc_lat: body.Latitude.toSring()
    }, { where: {"phone_number": body.From.toSring()}})
    .then({
      return "Updated Location";
    })
    .catch(err => return err);
  }

  newPatientIntent(agent, body) {
  	console.log("Storing new patient in DB");
    let fName = agent.parameters["patient-given-name"];
    let lName = agent.parameters["patient-last-name"];
    let parentUser = await db.userWA.findOne(where: {phone_number: body.From.toSring()});

    fulfillmentText = "Thanks for adding " + fName + " " + lName + ".\
        \nYou can now proceed to book a consultation for your registered patients. What would you like to do today?\
        \n1. Register another patient?\
        \n2. Book New Consultation?\
        \n3. Continue Old Consultation?\
        \n4. List registered patients?\
        \n5. Check patient details?\
        \n6. Update patient details?\
        \n7. More information (Data policies)?";

    db.patientWA.create({
            "first_name": fName,
            "last_name": lName
            "userWAid": parentUser.id,
            "is_user" : (agent.parameters["is_user"].toLowerCase() === "yes")
        })
        .then(() => {
            return fulfillmentText;
        })
        .catch(err => return err);
  }

  addPatientInfoIntent(agent, body){
    let cNum = agent.parameters["patient-contact"];
    let pUser = await db.userWA.findOne(where: {phone_number: body.From.toSring()});
    let patient = await db.patientWA.findOne(where: {User_id: pUser.id});

    fulfillmentText = "Thanks for adding " + fName + " " + lName + ".\
        \nYou can now proceed to book a consultation for your registered patients. What would you like to do today?\
        \n1. Register another patient?\
        \n2. Book New Consultation?\
        \n3. Continue Old Consultation?\
        \n4. List registered patients?\
        \n5. Check patient details?\
        \n6. Update patient details?\
        \n7. More information (Data policies)?";
    db.patientInfoWA.create({
            "first_name": fName,
            "last_name": lName,
            "dob": agent.parameters["dob"],
            "sex": agent.parameters["gender"],
            "telephone": cNum,
            "height_cm": agent.parameters["height"],
            "weight_kg": agent.parameters["weight"],
            "blood_type": agent.parameters["blood-type"],
            "patientWAid": patient.id,
        })
        .then(() => {
            return fulfillmentText;
        })
        .catch(err => return err);
  }

  updateAilAllergies(agent, body){
    let user = await db.userWA.findOne(where: {phone_number: body.From.toSring()});
    let patient = await db.patientWA.findOne(where: {userWAid: user.id});
    
    let fulfillmentText = "We have updated your Allergies and Ailments. Do you want to Consult a doctor? (More Options here)"

    db.patientInfoWA.update({
      Ailments: agent.parameters["Ailments"],
      Allergies: agent.parameters["Allergies"]
    }, { where: {"patientWAid": patient.id}})
    .then({
      return fulfillmentText;
    })
    .catch(err => return err);
  }

  liste(agent, body) {
    let fulfillmentText = "These are your Patients: ";
    let user = await db.userWA.findOne(where: {phone_number: body.From.toSring()});
    db.patientWA.findAll({where: {User_id: user.id}}).then(patients => {
      if (patients.length === 0) throw "You need to register a patient first. Would you like to register a new patient?";
      patients.forEach((patient, i) => {
        fulfillmentText = fulfillmentText + "\n\nPatient " + i + ": " + 
          "\nfirst_name: " + patient.first_name +
          "\nlast_name: " patient.last_name +
          "\ndob: " + patient.dob +
          "\ngender: " + patient.gender +
          "\ntelephone: " + patient.last_name +
          "\nheight: " + patient.height +
          "\nweight: " + patient.weight + 
          "\nallergies: " + patient.allergies + 
          "\nprocedures: " + patient.procedures + 
          "\nblood_type: " + patient.blood_type;
      });
    }).catch(err => return err);
    return fulfillmentText;
  }

  update(agent) {
    let cNum = agent.parameters["telephone"];
    //if(db.userWA.findAll({where: {phone_number: cNum}}).length > 0) return "Phone Number already Exists";
    db.patientWA.update(agent.parameters, where: {telephone: cNum})
      .then(() => return "Patient Updated")
      .catch(err => return err);
  }
  
  remove(agent) {
    let cNum = agent.parameters["telephone"];
    db.patientWA.destroy({
      where: { telephone: cNum }
    }).then(() => return "Patient Deleted")
    .catch(err => return err);
  }

  show(agent) {
    let uid = agent.parameters["user-id"];
    let fulfillmentText = "These are the details of your Patient: ";
    db.patientWA.findAll({where: { user_id : uid, 
                                  first_name: agent.parameters["patient-given-name"]}
                                }).then(patients =>
                                  if(patients.length == 1){
                                  fulfillmentText = fulfillmentText +  
                                                            "\nfirst_name: " + patient.first_name +
                                                            "\nlast_name: " patient.last_name +
                                                            "\ndob: " + patient.dob +
                                                            "\ngender: " + patient.gender +
                                                            "\ntelephone: " + patient.last_name +
                                                            "\nheight: " + patient.height +
                                                            "\nweight: " + patient.weight + 
                                                            "\nallergies: " + patient.allergies + 
                                                            "\nprocedures: " + patient.procedures + 
                                                            "\nblood_type: " + patient.blood_type;
                                  } else {
                                    throw "Patient with that name does not exist";
                                  }
                                ).catch(err => return err);
  }
}

module.exports = UserRegistrationController;


  /*function cardFunc(agent) {
    agent.add(`This message is from Dialogflow's Cloud Functions for Firebase inline editor!`);
    agent.add(new Card({
        title: `Title: this is a card title`,
        imageUrl: 'https://dialogflow.com/images/api_home_laptop.svg',
        text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
        buttonText: 'This is a button',
        buttonUrl: 'https://docs.dialogflow.com/'
      });
    );
    agent.add(new Suggestion(`Quick Reply`));
    agent.add(new Suggestion(`Suggestion`));
    agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  }
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('UserInfo', storeUserInfo);
  intentMap.set('appointmentscheduler', schAppoint)
  agent.handleRequest(intentMap);
  */