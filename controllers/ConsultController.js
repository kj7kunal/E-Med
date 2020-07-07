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


  /*doctorInfo(agent){
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
}*/


  clinicInfo(agent){
    let fulfillmentText = "Here's what we found. Reply the number to choose:";
    db.Clinic.findAll(where: {clinic_name: agent.parameters["clinic-given-name"]
                              }).then(clinics => {
                                if(clinics.length==0)throw "Sorry. Hospital "+ agent.parameters["clinic-given-name"] + 
                                                  " is not present on our platform.\n Please use the invite link to help them join." ;
                                let i=1;
                                clinics.forEach((clinic, i) => {
                                  fulfillmentText += "\n " + i + ". " + clinic.clinic_name +  " Hospital";
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

doctorInfo(agent){
    let fulfillmentText = "Here's what we found. Reply the number to choose:";
    db.userWA.findAll(where : {first_name : agent.parameters["doctors-first-name"]
                                last_name : agent.parameters["doctors-last-name"]})
    .then(users => {
        var flag = 0, count = 0;
        users.forEach((user, i) => {
              db.doctorWA.findOne(where : {doctorWAId : user.id}).then(doctor =>{
                                    if(doctor.length != 0){
                                        fulfillmentText += "\n" + count + ". Dr. " + user.first_name + " " + user.last_name;
                                        flag = 1;
                                        count++;
                                      }
               }).catch(err => return err);
              });

      }).catch(err => return err);

        fulfillmentText+= "\nReply " + (count+1) + " if you can't find the doctor you are looking for.";

        if(flag == 0) throw "Sorry. Dr" + agent.parameters["doctors-first-name"] + " " + 
                                  agent.parameter["doctors-last-name"] + " is not present on our platform.\n" +
                                        "Please use the invite link to help them join." ;
        else
          return fulfillmentText;


    }

initialHospitalDisplay(agent, body){
    let user = await db.userWA.findOne(where: {phone_number: body.From.toSring()});
    let fulfillmentText="Here's what we found for you based on your location:\n" + "Reply the number to choose:\n";
    db.clinicWA.findAll(where: { city : user.city}).then( clinics => {
              var distance = [], name = [], count = 0;
              clinics.forEach((clinic, i) => {
                  distance[count] = getDistance(clinic.loc_lat, clinic.loc_long, user.loc_lat, user.loc_long);
                  name[count] = clinic.clinic_name;
                  count++;
                });

              fulfillmentText += sortHospitals(distance, name);
              fulfillmentText += "If you don't find what you are looking for.\n Please tell us the hospital or doctor you wish to consult" + 
                                  "Reply: 1. Unique ID\n 2. Name of Doctor \n 3. If you wish to browse for more Hospitals near you.";
    }).catch(err => return err);

    return fulfillmentText;
    }


getDistance(clatitude, clongitude, ulatitude, ulongitude){
    var R = 6371; // Radius of the earth in km
    var dLatitude = (clatitude-ulatitude)*(Math.PI/180);
    var dLongitude = (clongitude-ulongitude)*(Math.PI/180); 
    var a = Math.sin(dLatitude/2) * Math.sin(dLatitude/2) + Math.cos(clatitude*(Math.PI/180)) * 
                  Math.cos(ulatitude*(Math.PI/180)) * Math.sin(dLongitude/2) * Math.sin(dLongitude/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var dist = R * c; // Distance in km
    return dist;

  }

  sortHospitals(H_distance, H_name){
    var i=0, j=0, leng = H_distance.length; 
    for(i=0;i<leng-1;i++){
      for(j=i+1; j<leng;j++){

        if(H_distance[i]>H_distance[j]){
          var temp = H_distance[i];
          H_distance[i] = H_distance[j];
          H_distance[j] = temp;

          temp = H_name[i];
          H_name[i] = H_name[j];
          H_name[j] = temp;
        }
      }
    }

    var sortedHospitals;
    for(i=1;i<=leng;i++)
      if(i<=5)
        sortedHospitals += i + ". " + H_name[i-1] + " Hospital\n" ;

    return sortedHospitals;
 }


}


module.exports = ConsultController;
