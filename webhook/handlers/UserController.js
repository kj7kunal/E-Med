const db = require('../../models');

class UserRegistrationController {
  
  async newUserIntent(agent, body) {
    console.log("Storing new User in DB");
    let fName = agent.parameters["user-given-name"];
    let cNum = body.From;

    let usercheck = await db.userWA.findAll({where: {wa_phone_number: cNum}});
    if(usercheck.length > 0) return "Phone Number already Exists";
    let fulfillmentText = "Hi " + fName + ", welcome to E-Medic. Please check your mail for a confirmation email from us.\
            \nMeanwhile please share your location in the chat. Clip Icon -> Location";
    db.userWA.create({
            "first_name": fName,
            "last_name": agent.parameters["last-name"],
            "email": agent.parameters["email"],
            "wa_phone_number": cNum
        })
        .then(() => {
            return fulfillmentText;
        })
        .catch((err) => {return err;});
  }

  addLocation(body){    
    let fulfillmentText = "Updated Location";
    db.userWA.update({
      "loc_long": body.Logitude.toSring(),
      "loc_lat": body.Latitude.toSring()
    }, { where: {"wa_phone_number": body.From}})
    .then(() => {
      return fulfillmentText;
    })
    .catch((err) => {return err;});
  }

  async newPatientIntent(agent, body) {
  	console.log("Storing new patient in DB");
    let fName = agent.parameters["patient-given-name"];
    let lName = agent.parameters["patient-last-name"];
    let parentUser = await db.userWA.findOne({where: {wa_phone_number: body.From}});

    let fulfillmentText = "Thanks for adding " + fName + " " + lName + ".\
        \nYou can now proceed to book a consultation for your registered patients. What would you like to do today?\
        \n1. Register another patient?\
        \n2. Book New Consultation?\
        \n3. Continue Old Consultation?\
        \n4. List registered patients?\
        \n5. Check patient details?\
        \n6. Update patient details?\
        \n7. More information (Data policies)?";

    db.patientWA.create({
            "first_name": fName,
            "last_name": lName,
            "userWAid": parentUser.id,
            "is_user" : (agent.parameters["is_user"].toLowerCase() === "yes")
        })
        .then(() => {
            return fulfillmentText;
        })
        .catch(err => {return err;});
  }

  async addPatientInfoIntent(agent, body){
    let cNum = agent.parameters["patient-contact"];
    let pUser = await db.userWA.findOne({where: {wa_phone_number: body.From}});
    let patient = await db.patientWA.findOne({where: {User_id: pUser.id}});

    let fulfillmentText = "Thanks for adding " + fName + " " + lName + ".\
        \nYou can now proceed to book a consultation for your registered patients. What would you like to do today?\
        \n1. Register another patient?\
        \n2. Book New Consultation?\
        \n3. Continue Old Consultation?\
        \n4. List registered patients?\
        \n5. Check patient details?\
        \n6. Update patient details?\
        \n7. More information (Data policies)?";
    db.patientInfoWA.create({
            "first_name": fName,
            "last_name": lName,
            "dob": agent.parameters["dob"],
            "sex": agent.parameters["gender"],
            "phone_number": cNum,
            "height_cm": agent.parameters["height"],
            "weight_kg": agent.parameters["weight"],
            "blood_type": agent.parameters["blood-type"],
            "patientWAid": patient.id,
        })
        .then(() => {
            return fulfillmentText;
        })
        .catch(err => {return err;});
  }

  async updateAilAllergies(agent, body){
    let user = await db.userWA.findOne({where: {wa_phone_number: body.From.toSring()}});
    let patient = await db.patientWA.findOne({where: {userWAid: user.id}});
    
    let fulfillmentText = "We have updated your Allergies and Ailments. Do you want to Consult a doctor? (More Options here)";

    db.patientInfoWA.update({
      Ailments: agent.parameters["Ailments"],
      Allergies: agent.parameters["Allergies"]
    }, { where: {"patientWAid": patient.id}})
    .then(() => {
      return fulfillmentText;
    })
    .catch(err => {return err;});
  }

  async liste(agent, body) {
    let fulfillmentText = "These are your Patients: ";
    let user = await db.userWA.findOne({where: {wa_phone_number: body.From.toString()}});
    let patients = await db.patientWA.findAll({where: {User_id: user.id}}).catch(err => {return err;});
    
    if (patients.length === 0) return "You need to register a patient first. Would you like to register a new patient?";
    for(let i=0;i< patients.length;i++) {
      let patient = patients[i];
      fulfillmentText = fulfillmentText + "\n\nPatient " + (i+1).toString() + ": " + 
        "\nfirst_name: " + patient.first_name +
        "\nlast_name: " + patient.last_name;
      let pInfo = await db.patientInfoWA.findOne({where: {patientWAid: patient.id}}).catch(err => {return err;});
      fulfillmentText += "\ndob: " + pInfo.dob +
        "\ngender: " + pInfo.sex +
        "\Contact: " + pInfo.phone_number +
        "\nheight: " + pInfo.height_cm + " cm" + 
        "\nweight: " + pInfo.weight_kg + " kg" +
        "\nblood_type: " + pInfo.blood_type;
    };
    return fulfillmentText;
  }

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

  async show(agent, body) {
    let user = await db.userWA.findOne({where: {wa_phone_number: body.From}});
    let fulfillmentText = "These are the details of your Patient: ";
    db.patientWA.findAll({where: { user_id : user.id, 
                                  first_name: agent.parameters["patient-given-name"]}
                                }).then(patients => {
                                  if(patients.length == 1){
                                    let patwa = patients[0];
                                    let patient = await db.patientInfoWA.findOne({where: {patientWAid: patwa.id}});
                                    fulfillmentText = fulfillmentText +  
                                                            "\nfirst_name: " + patwa.first_name +
                                                            "\nlast_name: " + patwa.last_name +
                                                            "\ndob: " + patient.dob +
                                                            "\ngender: " + patient.sex +
                                                            "\ntelephone: " + patient.phone_number +
                                                            "\nheight: " + patient.height_cm +
                                                            "\nweight: " + patient.weight_kg +  
                                                            "\nblood_type: " + patient.blood_type;
                                    return fulfillmentText;
                                  } else {
                                    throw "Unique Patient with that name does not exist.";
                                  }
                                }).catch((err) => {return err;});
  }
}

module.exports = UserRegistrationController;
