const db = require('../../models')

class PatientFirstController {

  async bookConsulation(agent, id){
      let fulfillmentText = "";
      let user = await db.userWA.findOne({where: {wa_phone_number: id}});
      let patients = await db.patientWA.findAll({where: { User_id : user.id }});
      if(patients.length == 0){
          fulfillmentText += ("There are no patients registered for you. Please register the patient(s) before booking the consultation.\n"
              + "Would you like to register a patient now?\n")
      }
      else
      {
          fulfillmentText += "You have " + (patients.length).toString() + " patient" +
          ((patients.length === 1) ? 's': '') + " registered currently:";
          for(let i=0; i< patients.length; i++) {
              fulfillmentText += "\nPatient " + (i+1).toString() + ": " + patients[i].first_name + " " + patients[i].last_name;
          }
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
      let patient = await db.patientWA.findOne({where: {
          User_id : user.id,
          first_name: fName,
          last_name: lName
      }});
      let patientInfo = await db.patientInfoWA.findOne({where: { patientWAId: patient.id }});
      if((patient) && (patientInfo))
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
              "How would you like to proceed?" +
              "(1) Edit patient details" +
              "(2) Select another patient" +
              "(3) Proceed with booking the consultation");
      }
      else if(patient)
      {
          fulfillmentText += ("These are the details of your Patient: " + "\nFirst Name: " + fName +
              "\nLast Name: " + lName +
              "\nPatients details have not been added. Please do add later.");
      }
      else
      {
          fulfillmentText = ("We could not find " + fName + " " + lName + " in your patient list.\n"
              + "Please try again with correct spelling or register them as a new patient");
      }
      return fulfillmentText;
  }

}

module.exports = PatientFirstController;
