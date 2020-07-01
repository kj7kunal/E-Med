const express = require("express"),
    router = express.Router(),
    db = require('../models'),
    isAuthenticated = require("../config/middleware/isAuthenticated"),
    passport = require("../config/passport");

class ConsultController {

  bookConsulation(agent, body){
    let fulfillmentText = "Let’s get you connected to the Hospital soon! ";
    let user = await db.userWA.findOne(where: {phone_number: body.From.toSring()});
    db.patientWA.findAll({where: { user_id : user.id }}).then(patients => {
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
                                }).catch(err => return err);
  }

  patientInfo(agent, body) {
    let user = await db.userWA.findOne(where: {phone_number: body.From.toSring()});
    let fulfillmentText = "These are the details of your Patient: ";
    db.patientWA.findAll({where: { user_id : user.id,
                                  first_name: agent.parameters["patient-given-name"]}
                                }).then(patients => {
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
                                }).catch(err => return err);
  }


  doctorInfo(agent){
    let fulfillmentText = "Here's what we found. Reply the number to choose:";
    db.DoctorWA.findAll(where: {first_name: agent.parameters["doctors-first-name"] 
                              last_name: agent.parameter["doctors-last-name"]
                              }).then(doctors => {
                                if(doctors.length == 0) throw "Sorry. Dr" + agent.parameters["doctors-first-name"] + " " + 
                                                                agent.parameter["doctors-last-name"] + " is not present on our platform.\n" +
                                                                "Please use the invite link to help them join." ;
                                let i=1;
                                doctors.forEach((doctor, i) => {
                                  fulfillmentText += "\n " + i + ". Dr." + doctor.first_name + " " + doctor.last_name;
                                })
                              }).catch(err => return err);

                          fulfillmentText+= "\nReply " + (i+1) + " if you can't find the doctor you are looking for.";
                          return fulfillmentText;
}


  clinicInfo(agent){
    let fulfillmentText = "Here's what we found. Reply the number to choose:";
    db.Clinic.findAll(where: {clinic_name: agent.parameters["clinic-given-name"]
                              }).then(clinics => {
                                if(clinics.length==0)throw "Sorry. Hospital "+ agent.parameters["clinic-given-name"] + 
                                                  " is not present on our platform.\n Please use the invite link to help them join." ;
                                let i=1;
                                clinics.forEach((clinic, i) => {
                                  fulfillmentText += "\n " + i + ". " + clinic.clinic_name + + " Hospital";
                                })
                              }).catch(err => return err);

                            fulfillmentText+= "\nReply " + (i+1) + " if you can't find the hospital you are looking for.";
                            return fulfillmentText;
    }

  DoctorPostClinicSelection(agent){
    let fulfillmentText = "Hospital " + agent.parameters["clinic-given-name"] + " has the following doctors.\
                            \nReply back the number you wish to choose.";
    let clinic = db.Clinic.findOne(where : {clinic_name : agent.parameters["clinic-given-name"]});

    if(clinic.length == 0) throw "Sorry. Hospital "+ agent.parameters["clinic-given-name"] + 
                                 " is not present on our platform.\n Please use the invite link to help them join." ;

    db.DoctorWA.findAll(where : {Clinic_id : clinic.id}).then(doctors => {
                                 let i=1;
                                 doctors.forEach((doctor, i) => {
                                  fulfillmentText += "\n " + i + ". Dr." + doctor.first_name + " " + doctor.last_name;
                                 })
                                }).catch(err => return err);
                              fulfillmentText = "\nReply " + (i+1) + " if you wish to browse for more doctors.\n" + 
                                                "Reply" + (i+2) + " if you wish to choose a different hospital.";
                            return fulfillmentText;
  }
}


module.exports = ConsultController;
