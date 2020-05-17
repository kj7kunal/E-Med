const express = require("express"),
    router = express.Router(),
    db = require('../models'),
    isAuthenticated = require("../config/middleware/isAuthenticated"),
    passport = require("../config/passport");

//const { WebhookClient } = require('dialogflow-fulfillment');

class UserRegistrationController {
  
  newUserIntent(agent) {
    console.log("Storing new User in DB");
    let fName = agent.parameters["given-name"];
    let cNum = agent.parameters["user-contact"];

    if(db.user.findAll({where: {phone_number: cNum}}).length > 0) return "Phone Number already Exists";
    fulfillmentText = "Hi " + fName + ", welcome to E-Medic. Please check your mail for a confirmation email from us.\
            \nMeanwhile what would you like to do today?";
    db.user.create({
            "first_name": fName,
            "last_name": agent.parameters["last-name"],
            "email": agent.parameters["email"],
            "phone_number": cNum
        })
        .then(() => {
            return fulfillmentText;
        })
        .catch(err => return err);
  }


  newPatientIntent(agent) {
  	console.log("Storing new patient in DB");
    let fName = agent.parameters["given-name"];
    let lName = agent.parameters["last-name"];
    let cNum = agent.parameters["patient-contact"];

    if(db.user.findAll({where: {phone_number: cNum}}).length > 0) return "Phone Number already Exists";
    fulfillmentText = "Thanks for adding " + fName + " " + lName + ".\
        \nYou can now proceed to book a consultation for your registered patients. What would you like to do today?\
        \n1. Register another patient?\
        \n2. Book New Consultation?\
        \n3. Continue Old Consultation?\
        \n4. List registered patients?\
        \n5. Check patient details?\
        \n6. Update patient details?\
        \n7. More information (Data policies)?";
    db.patient.create({
            "first_name": fName,
            "last_name": lName,
            "dob": agent.parameters["dob"],
            "gender": agent.parameters["gender"],
            "telephone": cNum,
            "height": agent.parameters["height"],
            "weight": agent.parameters["weight"],
            "allergies": agent.parameters["allergies"],
            "procedures": agent.parameters["procedures"],
            "blood_type": agent.parameters["blood-type"]
        })
        .then(() => {
            return fulfillmentText;
        })
        .catch(err => return err);
  }

  liste(agent) {
    db.user.findAll().then(users => {
      fulfillmentText = "These are the users";
      return fulfillmentText;
    });
  }

  update(agent) {
    let cNum = agent.parameters["telephone"];
    //if(db.user.findAll({where: {phone_number: cNum}}).length > 0) return "Phone Number already Exists";
    db.patient.update(agent.parameters, where: {telephone: cNum})
      .then(() => return "Patient Updated")
      .catch(err => return err);
  }
  
  remove(agent) {
    let cNum = agent.parameters["telephone"];
    db.patient.destroy({
      where: { telephone: cNum }
    }).then(() => return "Patient Deleted")
    .catch(err => return err);
  }

  show(agent) {
    const id = req.params.id;
    db.Articles.findById(id).then(article =>
      res.render("articles/show", { article })
    );
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