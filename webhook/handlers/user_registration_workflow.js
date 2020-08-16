const db = require('../../models');

class UserRegistrationController {
  
    async createNewUser(agent, id) {
        console.log("Storing new User in DB");

        let paramContextName = 'userreg_confirm_new_user';
        let parameters = agent.outputContexts.filter(d =>
            d.name.split("/").slice(-1)[0] === paramContextName)[0].parameters["fields"];

        let name = parameters["name"].stringValue.trim().split(" ");
        if (name.length === 1) name[1] = "";

        let userCheck = await db.userWA.findOne({where: {wa_phone_number: id}});
        if (userCheck!=null) {
            return "You are already registered on our system!\n";
        }

        let fulfillmentText = ('Welcome to E-Medic, ' + name[0] + '.\n'
            + 'We have registered you to our system and you will be receiving a confirmation email shortly.\n');

        return await db.userWA.create({
                "first_name": name.slice(0, -1).join(' '),
                "last_name": name[name.length - 1],
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
        let fName = agent.parameters["patient-given-name"];
        let lName = agent.parameters["patient-last-name"];
        let parentUser = await db.userWA.findOne({where: {wa_phone_number: id}});

        let existingCheck = await db.patientWA.findOne({where: {
                                                    User_id: parentUser.id,
                                                    first_name: fName
                                                  }});
        if (existingCheck!=null) {
            return "You have already registered a patient with this name. Please try again with a different name/alias.\n";
        }

        let fulfillmentText = ('Okay! Thanks for adding ' + fName + '.\n'
            +'You can now proceed to book a consultation for your registered patients!\n'
            +'What else would you like to do today?\n'
            +'(1) Register another patient\n'
            +'(2) List registered patients\n'
            +'(3) Check/Update an existing patient\n'
            +'(4) Book a new consultation\n'
            +'(5) Follow up on existing consultation\n'
            +'(6) More Information about us\n');

        db.patientWA.create({
                "first_name": fName,
                "last_name": lName,
                "User_id": parentUser.id
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
        let fName = agent.parameters["patient-given-name"];
        let pUser = await db.userWA.findOne({where: {wa_phone_number: id}});
        let patient = await db.patientWA.findOne({where: {
                                            User_id: pUser.id,
                                            first_name: fName
                                          }});

        let fulfillmentText = ('Done! Thanks for updating details for ' + fName + '.\n'
            +'What else would you like to do today?\n'
            +'(1) Register a new patient\n'
            +'(2) List registered patients\n'
            +'(3) Check/Update an existing patient\n'
            +'(4) Book a new consultation\n'
            +'(5) Follow up on existing consultation\n'
            +'(6) More Information about us\n');

        db.patientInfoWA.create({
                "dob": agent.parameters["dob"] || '',
                "sex": agent.parameters["sex"] || '',
                "phone_number": agent.parameters["patient-contact"] || '',
                "height_cm": agent.parameters["height"] || '',
                "weight_kg": agent.parameters["weight"] || '',
                "blood_type": agent.parameters["blood-type"] || '',
                "street_address": agent.parameters["address"] || '',
                "city": agent.parameters["city"] || '',
                "state": agent.parameters["state"] || '',
                "pincode": agent.parameters["pincode"] || '',
                "emergency_contact_name": agent.parameters["em_contact"] || '',
                "emergency_contact_number": agent.parameters["em_contact_num"] || '',
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

        console.log(patients.length); //Remove after testing ***********
        console.log(patients); //Remove after testing ***********
        console.log(patients[0]); //Remove after testing ***********

        if (patients.length === 0) return "You have 0 patients registered currently.\n";

        let responseText = "You have " + (patients.length).toString() + " patients registered currently:";
        for(let i=0; i< patients.length; i++) {
            responseText += "\nPatient " + (i+1).toString() + ": " + patients[i].first_name + " " + patients[i].last_name;
            /*let pInfo = await db.patientInfoWA.findOne({where: {patientWAId: patients[i].id}}).catch(err => {return err;});
            responseText += "\ndob: " + pInfo.dob +
            "\ngender: " + pInfo.sex +
            "\Contact: " + pInfo.phone_number +
            "\nheight: " + pInfo.height_cm + " cm" +
            "\nweight: " + pInfo.weight_kg + " kg" +
            "\nblood_type: " + pInfo.blood_type;
            */
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
        let user = await db.userWA.findOne({where: {wa_phone_number: id}});
        let responseText = "Here are the details of your patient: ";
        let patient = await db.patientWA.findOne({where: { user_id : user.id,
                                      first_name: agent.parameters["patient-given-name"]}
                                    }).catch((err) => {return err;});
        if (patient==null){
            return "Patient with that name does not exist.\nPlease try again with correct spelling or register new patient";
        }

        let patient_profile = await db.patientInfoWA.findOne({where: {patientWAId: patient.id}});

        responseText += ("\nFirst Name: " + patient.first_name +
            "\nLast Name: " + patient.last_name +
            "\nDOB: " + patient_profile.dob +
            "\nSex: " + patient_profile.sex +
            "\nContact Phone Number: " + patient_profile.phone_number +
            "\nHeight: " + patient_profile.height_cm + "cm" +
            "\nWeight: " + patient_profile.weight_kg + "kg" +
            "\nBlood_type: " + patient_profile.blood_type +
            "\nAddress: " + patient_profile.street_address +
            "\nCity: " + patient_profile.city +
            ", State: " + patient_profile.state +
            "\nPinCode: " + patient_profile.pincode +
            "\nEmergency Contact Name: " + patient_profile.emergency_contact_name +
            "\nEmergency Contact Number: " + patient_profile.emergency_contact_number);
        // responseText += "\nWould you like to update " + patient.first_name + "'s profile?"
        return responseText;
    }
}

module.exports = UserRegistrationController;
