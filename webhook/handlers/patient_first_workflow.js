const db = require('../../models')

class PatientFirstController {

  async bookConsulation(agent, id){
    let fulfillmentText = "";
    let user = await db.userWA.findOne({where: {wa_phone_number: id}});
    let patients = await db.patientWA.findAll({where: { user_id : user.id }});
        if(patients.length == 0){
            fulfillmentText += ("We don't have any patients registered with us. What would you like to do?\
            \n 1. Register a patient?\
            \n 2. Connect with the Hospital immediately?\
            \n 3. More info?");
        }
        else
        {
            patients.forEach((patient, i) => {
                fulfillmentText += ("\nWe have following patient profiles with us: \n" + i + 1  + ": " +
                "First name: " + patient.first_name +
                "\nLast name: " + patient.last_name);
            });
            fulfillmentText += ("\nReply back the full name of the patient you wish to book a consult for or add a new patient.");
        }
        return fulfillmentText;
  }

  async patientInfo(agent, id){
    let user = await db.userWA.findOne({where: {wa_phone_number: id}});
    let fulfillmentText = "";
    let paramContextName = 'patfirst_choose_patient';
    let parameters = agent.outputContexts.filter(d =>
        d.name.split("/").slice(-1)[0] === paramContextName)[0].parameters["fields"];

    let name = parameters["name"].stringValue.trim().split(" ");
    if (name.length === 1) name[1] = "";
    let fName = name.slice(0, -1).join(' ');
    let lName = name[name.length - 1];
    let patient = await db.patientWA.findOne({where: { user_id : user.id,
      first_name: fName, last_name: lName}});
    let patientInfo = await db.patientInfoWA.findOne({where: { patientWAId: patient.id }});
    if(patient)
    {
        fulfillmentText += ("These are the details of your Patient: " + "\nFirst Name: " + fName +
          "\nLast Name: " + lName +
          "\nDOB: " + (patientInfo.dob || 'N/A') +
          "\nSex: " + (patientInfo.sex || 'N/A') +
          "\nContact Phone Number: " + (patientInfo.phone_number || 'N/A') +
          "\nHeight: " + (patientInfo.height_cm || '_') + "cm" +
          "\nWeight: " + (patientInfo.weight_kg || '_') + "kg" +
          "\nBlood_type: " + (patientInfo.blood_type || 'N/A') +
          "\nAddress: " + (patientInfo.street_address || 'N/A') +
          "\nCity: " + (patientInfo.city || 'N/A') +
          ", State: " + (patientInfo.state || 'N/A') +
          "\nPinCode: " + (patientInfo.pincode || 'N/A') +
          "\nEmergency Contact Name: " + (patientInfo.emergency_contact_name || 'N/A') +
          "\nEmergency Contact Number: " + (patientInfo.emergency_contact_number || 'N/A') +
          "\nWhat would you like to do further?\
           \n1. Edit the patient details?\
           \n2. Go back and select another patient?\
           \n3. Proceed towards the consultation?");
    }
    else
    {
        fulfillmentText = "patient with the given name does not exist. Go back and select another patient.";
    }
    return fulfillmentText;
  }

}

module.exports = PatientFirstController;
