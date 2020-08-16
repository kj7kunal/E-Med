const db = require('../models')

class ConsultController {

  async bookConsulation(agent, id, contextClient, formattedParent){
    let fulfillmentText = "";
    let user = await db.userWA.findOne({where: {wa_phone_number: id}});
    let patients = await db.patientWA.findAll({where: { user_id : user.id }});
        if(patients.length == 0){
            fulfillmentText = fulfillmentText + "We don't have any patients registered with us. What would you like to do?\
            \n 1. Register a patient?\
            \n 2. Connect with the Hospital immediately?\
            \n 3. Need help?";
        }
        else
        {
            let c = await contextClient.deleteAllContexts({parent: formattedParent});
            agent.intent.outputContexts = c;
            let context = "check_patient";
            let request = {
              parent: formattedParent,
              context: context,
            };
            let a = await contextClient.createContext(request);
            agent.intent.outputContexts = a;
            patients.forEach((patient, i) => {
                fulfillmentText = fulfillmentText + "\nWe have following patient profiles with us: \n" + i + 1  + ": " +
                "First name: " + patient.first_name +
                "\nLast name: " + patient.last_name;
            });
            fulfillmentText = fulfillmentText + "\nReply back the name of patient you wish to book a consult for.";
        }
        return fulfillmentText;
  }

  async patientInfo(agent, id){
    let user = await db.userWA.findOne({where: {wa_phone_number: id}});
    let fulfillmentText = "";
    let patient = await db.patientWA.findOne({where: { user_id : user.id,
      first_name: agent.parameters["patient-given-name"]}});
    let patientInfo = await db.patientInfoWA.findOne({where: { patientWAId: patient.id }});
    if(patient)
    {
        fulfillmentText = fulfillmentText + "These are the details of your Patient: " +
        "\nFirst name: " + patient.first_name +
        "\nLast name: " + patient.last_name +
        "\nDate of Birth: " + patientInfo.dob +
        "\nGender: " + patientInfo.sex +
        "\nTelephone: " + patientInfo.phone_number +
        "\nHeight(in cm): " + patientInfo.height_cm +
        "\nweight(in kg): " + patientInfo.weight_kg +
        "\nBlood group: " + patientInfo.blood_type +
        "\nWhat would you like to do further?\
         \n1. Edit the patient details?\
         \n2. Go back and select another patient?\
         \n3. Proceed towards the consultation?";
    }
    else
    {
        fulfillmentText = "patient with the given name does not exist. Press 2 to go back and select another patient.";
    }
    return fulfillmentText;
  }

  async nextConsultation(agent, id){
    let fulfillmentText = "";
    let user = await db.userWA.findOne({where: {wa_phone_number: id}});
    let patients = await db.patientWA.findAll({where: { user_id : user.id }});
        if(patients.length == 0){
            fulfillmentText = fulfillmentText + "We don't have any patients registered with us. What would you like to do?\
            \n 1. Register a patient?\
            \n 2. Connect with the Hospital immediately?\
            \n 3. Need help?";
        }
        else
        {
            let c = await contextClient.deleteAllContexts({parent: formattedParent});
            agent.intent.outputContexts = c;
            let context = "patient";
            let request = {
              parent: formattedParent,
              context: context,
            };
            let a = await contextClient.createContext(request);
            agent.intent.outputContexts = a;
            patients.forEach((patient, i) => {
                fulfillmentText = fulfillmentText + "\nWe have following patient profiles with us: \n" + i + 1  + ": " +
                "First name: " + patient.first_name +
                "\nLast name: " + patient.last_name;
            });
            fulfillmentText = fulfillmentText + "\nReply back the name of patient you wish to book a consult for.";
        }
        return fulfillmentText;
  }

  async pastConsultations(agent, id){
    let user = await db.userWA.findOne({where: {wa_phone_number: id}});
    let fulfillmentText = "These are the names of doctors from your previous consultations: ";
    let appointments = await db.appointment.findAll({where: { patientId : user.id}});
    if(appointments.length != 0){
      appointments.forEach((appointment, i) => {
        db.doctor.findOne({where: { id : appointment.doctorId}}).then(doctor => {
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
  }
}

module.exports = ConsultController;
