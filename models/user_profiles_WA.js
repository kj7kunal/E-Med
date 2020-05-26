// Creating User model for WhatsApp users
module.exports = function(sequelize, DataTypes) {
    const UserProfileWA = sequelize.define("userProfileWA");

    return UserProfileWA;
};