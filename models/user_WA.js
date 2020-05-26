// Creating User model for WhatsApp users
module.exports = function(sequelize, DataTypes) {
    const UserWA = sequelize.define("userWA", {
        // The phone number cannot be null
        wa_phone_number: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        loc_lat: {
            type: DataTypes.STRING,
            allowNull: false
        },
        loc_long: {
            type: DataTypes.STRING,
            allowNull: false
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 45]
            }
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 45]
            }
        },
    });

    UserWA.associate = models => {
        UserWA.hasMany(models.patientWA, {
            foreignKey: { allowNull: false, },
            as: 'patientWAs',
        })
    }

    UserWA.associate = models => {
        UserWA.belongsToMany(models.profileWA, { through: models.userProfileWA })
    }

    UserWA.associate = models => {
        UserWA.hasOne(models.doctorWA, {
            foreignKey: { allowNull: false, },
            as: 'doctorWAs',
        })
    }


    return UserWA;
};