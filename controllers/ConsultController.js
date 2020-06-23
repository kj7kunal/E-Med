const express = require("express"),
    router = express.Router(),
    db = require('../models'),
    isAuthenticated = require("../config/middleware/isAuthenticated"),
    passport = require("../config/passport");

class ConsultController {

  bookConsulation(agent, body){
    let fulfillmentText = "Let’s get you connected to the Hospital soon! ";
    let user = await db.userWA.findOne(where: {phone_number: body.From.toSring()});
    db.patientWA.findAll({where: { user_id : user.id }).then(patients =>
                                  if(patients.length == 0){
                                    fulfillmentText = fulfillmentText + "\nWe don't have any patients registered with us. What would you like to do?\
                                    \n 1. Register a patient?\
                                    \n 2. Connect with the Hospital immediately?\
                                    \n 3. Need help?"
                                  }
                                  else {
                                    patients.forEach((patient, i) => {
                                      fulfillmentText = fulfillmentText + "\nWe have following patient profiles with us: " + i + ": " +
                                        "\nfirst_name: " + patient.first_name +
                                        "\nlast_name: " + patient.last_name +
                                        "Reply back the name of patient you wish to book a consult for.";
                                    });
                                  }
                                  return fulfillmentText;
                                ).catch(err => return err);
  }

  patientInfo(agent, body) {
    let user = await db.userWA.findOne(where: {phone_number: body.From.toSring()});
    let fulfillmentText = "These are the details of your Patient: ";
    db.patientWA.findAll({where: { user_id : user.id,
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
                                                            "\nblood_type: " + patient.blood_type +
                                                            "\nWhat would you like to do further?\
                                                             \n1. Edit the patient details?\
                                                             \n2. Go back and select another patient?\
                                                             \n3. Proceed towards the consultation?";
                                    return fulfillmentText;
                                  } else {
                                    throw "Patient with that name does not exist";
                                  }
                                ).catch(err => return err);
  }
}

module.exports = ConsultController;
