const db = require('../../models');

class UserRegistrationController {
  
    async createNewUser(agent, id) {
        console.log("Storing new User in DB");

        let paramContextName = 'userreg_confirm_new_user';
        let parameters = agent.outputContexts.filter(d =>
            d.name.split("/").slice(-1)[0] === paramContextName)[0].parameters["fields"];

        let name = parameters["name"].stringValue.trim().split(" ");
        if (name.length === 1) name[1] = "";
        let fName = name.slice(0, -1).join(' ');
        let lName = name[name.length - 1];

        let userCheck = await db.userWA.findOne({where: {wa_phone_number: id}});
        if (userCheck!=null) {
            return "You are already registered on our system!\n";
        }

        let fulfillmentText = ('Welcome to E-Medic, ' + fName + '.\n'
            + 'We have registered you to our system and you will be receiving a confirmation email shortly.\n');

        return await db.userWA.create({
                "first_name": fName,
                "last_name": lName,
                "email": parameters["email"].stringValue,
                "wa_phone_number": id,
                "perm_address": parameters["perm-address"].stringValue
            })
            .then(() => {
                return fulfillmentText;
            })
            .catch((err) => {
                return err;
            })
        }

    // addLocation(body){
    //     let responseText = "Updated Location";
    //     db.userWA.update({
    //       "loc_long": body.Logitude.toSring(),
    //       "loc_lat": body.Latitude.toSring()
    //     }, { where: {"wa_phone_number": body.From}})
    //     .then(() => {
    //       return responseText;
    //     })
    //     .catch((err) => {return err;});
    // }

    async showUserDetails(agent, id) {
        // Shows registered user information
        let user = await db.userWA.findOne({where: {wa_phone_number: id}});
        let fulfillmentText = "";
        if (user!=null) {
            fulfillmentText = ('Name: '+user.dataValues.first_name+' '+user.dataValues.last_name +'\n'
                + 'WhatsApp phone number: '+user.dataValues.wa_phone_number +'\n'
                + 'Email: '+user.dataValues.email +'\n'
                + 'Permanent Address: '+user.dataValues.perm_address +'\n');
        }
        else {
            fulfillmentText = 'You are not a registered user. Please register to avail our service.\n';
        }
        return fulfillmentText;
    }

    async createNewPatient(agent, id) {
        console.log("Storing new patient in DB");

        let paramContextName = 'userreg_confirm_new_patient';
        let parameters = agent.outputContexts.filter(d =>
            d.name.split("/").slice(-1)[0] === paramContextName)[0].parameters["fields"];

        let name = parameters["name"].stringValue.trim().split(" ");
        if (name.length === 1) name[1] = "";
        let fName = name.slice(0, -1).join(' ');
        let lName = name[name.length - 1];

        let parentUser = await db.userWA.findOne({where: {wa_phone_number: id}});

        let existingCheck = await db.patientWA.findOne({where: {
                                                    userWAId: parentUser.id,
                                                    first_name: fName,
                                                    last_name: lName
                                                  }});
        if (existingCheck!=null) {
            return ("You have already registered " + fName + " " + lName +
                ". If you need to register someone else, please try again with a different name/alias.\n");
        }

        let fulfillmentText = ('Okay! Thanks for adding ' + fName + '.\n'
            +'You can update details about the patient by choosing option (3) \n'
            +'or directly proceed to book a consultation for them by choosing option (4)!\n'
            +'What else would you like to do today?\n'
            +'(1) Register another patient\n'
            +'(2) List registered patients\n'
            +'(3) Check/Update an existing patient\n'
            +'(4) Book a new consultation\n'
            +'(5) Follow up on existing consultation\n'
            +'(6) More Information about us\n');

        return await db.patientWA.create({
                "first_name": fName,
                "last_name": lName,
                "userWAId": parentUser.id
            })
            .then(() => {
                return fulfillmentText;
            })
            .catch((err) => {
                return err;
            })
    }

    async addPatientInfo(agent, id){
        console.log("Storing patient detailed info in DB");

        let paramContextName = 'userreg_confirm_pdetails';
        let parameters = agent.outputContexts.filter(d =>
            d.name.split("/").slice(-1)[0] === paramContextName)[0].parameters["fields"];

        let name = parameters["name"].stringValue.trim().split(" ");
        if (name.length === 1) name[1] = "";
        let fName = name.slice(0, -1).join(' ');
        let lName = name[name.length - 1];

        let pUser = await db.userWA.findOne({where: {wa_phone_number: id}});
        let patient = await db.patientWA.findOne({where: {
                                            User_id: pUser.id,
                                            first_name: fName,
                                            last_name: lName
                                          }});

        let fulfillmentText = ('Done! Thanks for updating details for ' + fName + '.\n'
            +'What else would you like to do today?\n'
            +'(1) Register a new patient\n'
            +'(2) List registered patients\n'
            +'(3) Check/Update an existing patient\n'
            +'(4) Book a new consultation\n'
            +'(5) Follow up on existing consultation\n'
            +'(6) More Information about us\n');

        // TODO: Update parameter types and processing as per dialogflow object
        // TODO: Add date processing usin moment.js
        return await db.patientInfoWA.create({
                "dob": parameters["dob"].stringValue || '',
                "sex": parameters["sex"].stringValue || '',
                "phone_number": parameters["patient-contact"].stringValue || '',
                "height_cm": parameters["height"].stringValue || '',
                "weight_kg": parameters["weight"].stringValue || '',
                "blood_type": parameters["blood-type"].stringValue || '',
                "street_address": parameters["address"].stringValue || '',
                "city": parameters["city"].stringValue || '',
                "state": parameters["state"].stringValue || '',
                "pincode": parameters["pincode"].stringValue || '',
                "emergency_contact_name": parameters["em_contact"].stringValue || '',
                "emergency_contact_number": parameters["em_contact_num"].stringValue || '',
                "patientWAId": patient.id,
            })
            .then(() => {
                return fulfillmentText;
            })
            .catch((err) => {
                return err;
            })
    }

    /*  async updateAilAllergies(agent, id){
    let user = await db.userWA.findOne({where: {wa_phone_number: id}});
    let patient = await db.patientWA.findOne({where: {user_id: user.id}});

    let responseText = "We have updated your Allergies and Ailments. Do you want to Consult a doctor? (More Options here)";

    db.patientInfoWA.update({
      Ailments: agent.parameters["Ailments"],
      Allergies: agent.parameters["Allergies"]
    }, { where: {"patientWAId": patient.id}})
    .then(() => {
      return responseText;
    })
    .catch(err => {return err;});
    }
    */

    async listUserPatients(agent, id) {
        console.log("List of patients for user in DB");
        let user = await db.userWA.findOne({where: {wa_phone_number: id}});
        let patients = await db.patientWA.findAll({where: {User_id: user.id}});

        if (patients.length === 0) return "You have 0 patients registered currently.\n";

        let responseText = "You have " + (patients.length).toString() + " patient" +
            ((patients.length === 1) ? 's': '') + " registered currently:";
        for(let i=0; i< patients.length; i++) {
            responseText += "\nPatient " + (i+1).toString() + ": " + patients[i].first_name + " " + patients[i].last_name;
        }
        return responseText;
    }

    /*
    update(agent) {
    let cNum = agent.parameters["telephone"];
    //if(db.userWA.findAll({where: {phone_number: cNum}}).length > 0) return "Phone Number already Exists";
    db.patientWA.update(agent.parameters, {where: {phone_number: cNum}})
      .then(() => {return "Patient Updated";})
      .catch(err => {return err;});
    }

    remove(agent) {
    let cNum = agent.parameters["telephone"];
    db.patientWA.destroy({
      where: { telephone: cNum }
    }).then(() => {return "Patient Deleted";})
    .catch(err => {return err;});
    }
    */

    async checkPatientDetails(agent, id) {
        console.log("Single patient details");

        let parameters = agent.parameters.fields;
        let name = parameters["name"].stringValue.trim().split(" ");
        if (name.length === 1) name[1] = "";
        let fName = name.slice(0, -1).join(' ');
        let lName = name[name.length - 1];

        let pUser = await db.userWA.findOne({where: {wa_phone_number: id}});
        let patient = await db.patientWA.findOne({where: {
                User_id: pUser.id,
                first_name: fName,
                last_name: lName
            }});

        let responseText = "Here are " + fName + "'s registered details: ";
        if (patient==null){
            return ("We could not find " + fName + " " + lName + " in your patient list.\n"
                + "Please try again with correct spelling or register them as a new patient");
        }

        let patient_profile = await db.patientInfoWA.findOne({where: {patientWAId: patient.id}});
        // if (patient_profile==null){
        //     return ("We could not find " + fName + " " + lName + "'s details.\n"
        //         + "Please add details");
        // }g

        // TODO: Add date processing using moment.js
        responseText += ("\nFirst Name: " + fName +
            "\nLast Name: " + lName +
            "\nDOB: " + patient_profile.dob || 'N/A' +
            "\nSex: " + patient_profile.sex || 'N/A' +
            "\nContact Phone Number: " + patient_profile.phone_number || 'N/A' +
            "\nHeight: " + patient_profile.height_cm || '_' + "cm" +
            "\nWeight: " + patient_profile.weight_kg || '_' + "kg" +
            "\nBlood_type: " + patient_profile.blood_type || 'N/A' +
            "\nAddress: " + patient_profile.street_address || 'N/A' +
            "\nCity: " + patient_profile.city || 'N/A' +
            ", State: " + patient_profile.state || 'N/A' +
            "\nPinCode: " + patient_profile.pincode || 'N/A' +
            "\nEmergency Contact Name: " + patient_profile.emergency_contact_name || 'N/A' +
            "\nEmergency Contact Number: " + patient_profile.emergency_contact_number || 'N/A');

        // // TODO: Setup intents and function for updating profile
        // responseText += "\nWould you like to update " + patient.first_name + "'s profile?"

        return responseText;
    }
}

module.exports = UserRegistrationController;
