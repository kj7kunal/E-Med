const db = require('../../models');


class StartWorkflowController {

    async welcome(contextClient, agent, id){
        //Redirects to different intents depending on phone number being present in db
        console.log("Welcome");
        let user = await db.userWA.findOne({where: {wa_phone_number: id.substring(10)}});
        let fulfillmentText = "";
        if (user!=null) {
            fulfillmentText = ('Welcome back, ' +user.first_name+' '+user.last_name + '!\n'
                +'How can we help you today? Please choose from the following options:\n'
                +'(1) Register a new patient\n'
                +'(2) List registered patients\n'
                +'(3) Check/Update an existing patient\n'
                +'(4) Book a new consultation\n'
                +'(5) Follow up on existing consultation\n'
                +'(6) More Information about us\n');
        }
        else{
            await contextClient.deleteAllContexts(id);
            await contextClient.createContext(id, 'userreg_ask_new_user', 5);
            fulfillmentText = ('Welcome to E-Medic, a non-profit initiative to provide primary healthcare during COVID-19.\n'
                + 'How can we help you today? Please choose from the following options:\n'
                +'(1) Register as a user\n'
                +'(2) More Information about us\n');
        }
        return fulfillmentText;
    }
}

module.exports = StartWorkflowController;
