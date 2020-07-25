const db = require('../../models');

class UserRegistrationController {
  
  async createNewUser(agent, id) {
    console.log("Storing new User in DB");
    let fName = agent.parameters["user-given-name"];

    let usercheck = await db.userWA.findOne({where: {wa_phone_number: id}});
    if(usercheck) return "Phone Number already Exists";
    let responseText = "Hi " + fName + ", welcome to E-Medic. Please check your mail for a confirmation email from us.\
            \nMeanwhile please share your location in the chat. Clip Icon -> Location";
    db.userWA.create({
            "first_name": fName,
            "last_name": agent.parameters["last-name"],
            "email": agent.parameters["email"],
            "wa_phone_number": id
        })
        .then(() => {
            return responseText;
        })
        .catch((err) => {return err;});
  }

  addLocation(body){    
    let responseText = "Updated Location";
    db.userWA.update({
      "loc_long": body.Logitude.toSring(),
      "loc_lat": body.Latitude.toSring()
    }, { where: {"wa_phone_number": body.From}})
    .then(() => {
      return responseText;
    })
    .catch((err) => {return err;});
  }

  async newPatient(agent, id) {
  	console.log("Storing new patient in DB");
    let fName = agent.parameters["patient-given-name"];
    let lName = agent.parameters["patient-last-name"];
    let parentUser = await db.userWA.findOne({where: {wa_phone_number: id}});

    let existingCheck = await db.patientWA.findOne({where: {
                                                User_id: id,
                                                first_name: fName
                                              }});
    if(existingCheck)
      return "You have already Registered a Patient with this name. Please Register with a different name.";
    let responseText = "Thanks for adding " + fName + " " + lName + ".\
        \nYou can now proceed to book a consultation for your registered patients. What would you like to do today?\
        \n(1) Register another patient\
        \n(2) Book New Consultation\
        \n(3) Continue Old Consultation\
        \n(4) List registered patients\
        \n(5) Check patient details\
        \n(6) Update patient details\
        \n(7) More information (Data policies)";

    await db.patientWA.create({
            "first_name": fName,
            "last_name": lName,
            "User_id": parentUser.id
            //"is_user" : (agent.parameters["is_user"].toLowerCase() === "yes")
        }).catch(err => {return err;});
    return responseText;
  }

  async addPatientInfo(agent, id){
    let pUser = await db.userWA.findOne({where: {wa_phone_number: id}});
    let patient = await db.patientWA.findOne({where: {
                                        User_id: pUser.id,
                                        first_name: agent.parameters['patient-given-name']
                                      }});

    let responseText = "Thanks for Updating details for " + patient.first_name + " " + patient.last_name + ".\
        \nYou can now proceed to book a consultation. What would you like to do?\
        \n1. Register another patient?\
        \n2. Book New Consultation?\
        \n3. Continue Old Consultation?\
        \n4. List registered patients?\
        \n5. Check patient details?\
        \n6. Update patient details?\
        \n7. More information (Data policies)?";
    await db.patientInfoWA.create({
            "first_name": fName,
            "last_name": lName,
            "dob": agent.parameters["dob"],
            "sex": agent.parameters["gender"],
            "phone_number": agent.parameters["patient-contact"],
            "height_cm": agent.parameters["height"],
            "weight_kg": agent.parameters["weight"],
            "blood_type": agent.parameters["blood-type"],
            "patientWAId": patient.id,
        }).catch(err => {return err;});
    return responseText;
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
    let responseText = "These are your Patients: ";
    let user = await db.userWA.findOne({where: {wa_phone_number: id}});
    let patients = await db.patientWA.findAll({where: {User_id: user.id}}).catch(err => {return err;});
    
    if (patients.length === 0) return "You need to register a patient first. Would you like to register a new patient?";
    for(let i=0;i< patients.length;i++) {
      let patient = patients[i];
      responseText += "\n\nPatient " + (i+1).toString() + ": " + patient.first_name + " " + patient.last_name;
      /*let pInfo = await db.patientInfoWA.findOne({where: {patientWAId: patient.id}}).catch(err => {return err;});
      responseText += "\ndob: " + pInfo.dob +
        "\ngender: " + pInfo.sex +
        "\Contact: " + pInfo.phone_number +
        "\nheight: " + pInfo.height_cm + " cm" + 
        "\nweight: " + pInfo.weight_kg + " kg" +
        "\nblood_type: " + pInfo.blood_type;
      */
    };
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
    let user = await db.userWA.findOne({where: {wa_phone_number: id}});
    let responseText = "These are the details of your Patient: ";
    let patientwa = await db.patientWA.findOne({where: { user_id : user.id, 
                                  first_name: agent.parameters["patient-given-name"]}
                                }).catch((err) => {return err;});
    if(!patientwa)
      return "Patient with that name does not exist.";
    let patient = await db.patientInfoWA.findOne({
                                      where: {patientWAId: patientwa.id}
                                    });
    responseText += "\nfirst_name: " + patientwa.first_name +
                    "\nlast_name: " + patientwa.last_name +
                    "\ndob: " + patient.dob +
                    "\ngender: " + patient.sex +
                    "\ntelephone: " + patient.phone_number +
                    "\nheight: " + patient.height_cm +
                    "\nweight: " + patient.weight_kg +  
                    "\nblood_type: " + patient.blood_type;
    return responseText;
  }

  async showUserDetails(agent, id) {
    // Shows registered user information
    let user = await db.userWA.findOne({where: {wa_phone_number: id}});
    let fulfillmentText = "";
    if(user!=null){
        fulfillmentText = ('Name: '+result.dataValues.first_name+' '+result.dataValues.last_name +'\n'
            + 'WhatsApp phone number: '+result.dataValues.wa_phone_number +'\n'
            + 'Email: '+result.dataValues.email +'\n'
            + 'Permanent Address: '+result.dataValues.perm_address +'\n');
    }
    else {
        fulfillmentText = 'You are not a registered user. Please register to avail our service.\n';
    }
    return fulfillmentText;
  }
}

module.exports = UserRegistrationController;
