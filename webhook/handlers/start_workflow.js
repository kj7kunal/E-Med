const db = require('../../models');

class StartWorkflowController {

    async welcome(agent, id){
        //Redirects to different intents depending on phone number being present in db
        let user = await db.userWA.findOne({where: {wa_phone_number: id}});
        let fulfillmentText = "";
        if(user!=null){
            fulfillmentText = ('Welcome back, ' +user.dataValues.first_name+' '+user.dataValues.last_name + '!\n'
                +'How can we help you today? Please choose from the following options:\n'
                +'(1) Register a new patient\n'
                +'(2) Check/Update existing patient\n'
                +'(3) Book a new consultation\n'
                +'(4) Follow up on existing consultation\n'
                +'(5) More Information about us\n');
        }
        else{
            fulfillmentText = ('Welcome to E-Medic, a non-profit initiative to provide primary healthcare during COVID-19.\n'
                + 'How can we help you today? Please choose from the following options:\n'
                +'(1) Register as a user\n'
                +'(2) More Information about us\n');
        }
        return fulfillmentText;
    }
}

module.exports = StartWorkflowController;
