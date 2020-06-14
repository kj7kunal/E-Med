'use strict'
const db= require('../../../models');

const check_number_indb = (dialogflowResponse,id) =>{
	//const doctors = await db.users.findAll({})
	const [id, created] = await db.users.findOrCreate({
		where: { ID: id },
		//defaults: {
		//  job: 'Technical Lead JavaScript'
		//}
	  });
		  const doctor = await db.doctor.findOne({ where: { ID: id } });
		  const patient = await db.patient.findOne({ where: { ID: id } });
	 	if (created){
		  dialogflowResponse.outputContext.name="projects/e-medicine-iitkgp-mvttlt/agent/sessions/"+id +"/contexts/new_user_reg";
		  dialogflowResponse.outputContext.lifespanCount= 5;
		  dialogflowResponse.outputContext.parameters=[Object];
	  	}
		else if (doctor != null) {
		  //console.log('Not found!');
		  dialogflowResponse.outputContext.name="projects/e-medicine-iitkgp-mvttlt/agent/sessions/"+id +"/contexts/doctor";
		  dialogflowResponse.outputContext.lifespanCount= 5;
		  dialogflowResponse.outputContext.parameters=[Object];
		} 
		else if(patient !=null) {
		  //console.log(project instanceof Project); // true
		  //console.log(project.title); // 'My Title'
		  dialogflowResponse.outputContext.name="projects/e-medicine-iitkgp-mvttlt/agent/sessions/"+id +"/contexts/patient";
		  dialogflowResponse.outputContext.lifespanCount= 5;
		  dialogflowResponse.outputContext.parameters=[Object];
		}
		return dialogflowResponse;
	  
}

module.exports = check_number_indb;