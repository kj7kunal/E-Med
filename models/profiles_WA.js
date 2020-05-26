// Creating User model for WhatsApp users
module.exports = function(sequelize, DataTypes) {
    const ProfileWA = sequelize.define("profileWA", {
        // The phone number cannot be null
        profile_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, { timestamps: false });

    ProfileWA.associate = models => {
        ProfileWA.belongsToMany(models.userWA, { through: models.userProfileWA  })
    }

    return ProfileWA;
};