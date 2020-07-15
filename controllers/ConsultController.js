const db = require('../models')

class ConsultController {

  bookConsulation(agent, body, contextClient, formattedParent){
    let fulfillmentText = "Let’s get you connected to the Hospital soon! ";
    let user = await db.userWA.findOne(where: {wa_phone_number: body.From.toSring()});
    db.patientWA.findAll({where: { user_id : user.id }}).then(patients => {
                                  if(patients.length == 0){
                                    fulfillmentText = fulfillmentText + "\nWe don't have any patients registered with us. What would you like to do?\
                                    \n 1. Register a patient?\
                                    \n 2. Connect with the Hospital immediately?\
                                    \n 3. Need help?"
                                    return fulfillmentText;
                                  }
                                  else {
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
                                    patients.forEach((patient, i) => {
                                      fulfillmentText = fulfillmentText + "\nWe have following patient profiles with us: " + i + 1  + ": " +
                                        "\nfirst_name: " + patient.first_name +
                                        "\nlast_name: " + patient.last_name;
                                    });
                                    fulfillmentText = fulfillmentText + "Reply back the name of patient you wish to book a consult for.";
                                    return fulfillmentText;
                                  }

                                }).catch(err => return err);
  }

  patientInfo(agent, body){
    let user = await db.userWA.findOne(where: {wa_phone_number: body.From.toSring()});
    let fulfillmentText = "These are the details of your Patient: ";
    db.patientWA.findAll({where: { user_id : user.id,
                                  first_name: agent.parameters["patient-given-name"]}
                                }).then(patients => {
                                  if(patients.length == 1){
                                    patients.forEach((patient, i) => {
                                      fulfillmentText = fulfillmentText + i + 1 +": " +
                                      " first_name: " + patient.first_name +
                                      "\nlast_name: " patient.last_name;
                                      db.patientInfoWA.findOne({where: { patientWAId: patient.id }}).then(info => {
                                        fulfillmentText = fulfillmentText +
                                        "\ndob: " + info.dob +
                                        "\ngender: " + info.sex +
                                        "\ntelephone: " + info.phone_number +
                                        "\nheight: " + info.height_cm +
                                        "\nweight: " + info.weight_kg +
                                        "\nallergies: " + info.allergies + //not added in the database
                                        "\ndiseases: " + info.ailments + // not added in the database
                                        "\nblood_type: " + info.blood_type +
                                        "\nWhat would you like to do further?\
                                         \n1. Edit the patient details?\
                                         \n2. Go back and select another patient?\
                                         \n3. Proceed towards the consultation?";
                                      });
                                    }
                                    return fulfillmentText;
                                  } else {
                                    return "patient with the given name does not exist. Press 2 to go back and select another patient."
                                  }
                                }).catch(err => return err);
  }

  nextConsultation(agent, body){
    let fulfillmentText = "Let’s get you connected to the Hospital soon! ";
    let user = await db.userWA.findOne(where: {wa_phone_number: body.From.toSring()});
    db.patientWA.findAll({where: { user_id : user.id }}).then(patients => {
                                  if(patients.length == 0){
                                    fulfillmentText = fulfillmentText + "\nWe don't have any patients registered with us. What would you like to do?\
                                    \n 1. Register a patient?\
                                    \n 2. Connect with the Hospital/Doctor immediately?\
                                    \n 3. Need help?"
                                  }
                                  else {
                                    contextClient.deleteAllContexts({parent: formattedParent}).catch(err => {
                                      console.error(err);
                                    });
                                    const context = "patient";
                                    const request = {
                                      parent: formattedParent,
                                      context: context,
                                    };
                                    contextClient.createContext(request).catch(err => {
                                      console.error(err);
                                    });
                                    patients.forEach((patient, i) => {
                                      fulfillmentText = fulfillmentText + "\nWe have following patient profiles with us: " + i + 1 + ": " +
                                        " first_name: " + patient.first_name +
                                        "\nlast_name: " + patient.last_name +
                                        "Reply back the name of patient you wish to book a consult for.";
                                    });
                                  }
                                  return fulfillmentText;
                                }).catch(err => return err);
  }

  pastConsultations(agent, body){
    let user = await db.userWA.findOne(where: {phone_number: body.From.toSring()});
    let fulfillmentText = "These are the names of doctors from your previous consultations: ";
    db.appointment.findAll({where: { patientId : user.id}}).then(appointments => {
                                  if(appointments.length != 0){
                                    appointments.forEach((appointment, i) => {
                                      db.doctor.findOne(where: { id : appointment.doctorId}).then(doctor => {
                                        fulfillmentText = fulfillmentText + i + 1 + ":" +
                                        " first_name: " + doctor.first_name +
                                        "\nlast_name: " + doctor.last_name;
                                      });
                                    });
                                    fulfillmentText = fulfillmentText +
                                    "Reply back with the name of the doctor you wish to consult with. To consult a different doctor press n.";
                                    return fulfillmentText;
                                  }
                                  else{
                                    return "There are no previous consultations press n to consult different doctor."
                                  }
                                }).catch(err => return err);
}

module.exports = ConsultController;
