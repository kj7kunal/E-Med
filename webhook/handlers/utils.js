const db = require('../models');

module.exports = {
//Check if incoming phone number is in the database
     isUser(id, callback) {
        db.userWA.findOne({
            where: {
                wa_phone_number: id
            }
        })
            .then(response => {
                return callback(response);
            })
            .catch(error => {
                console.error(error);
            });
    }
}


