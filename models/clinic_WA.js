module.exports = function(sequelize, DataTypes) {
    var Clinic = sequelize.define("clinicWA", {
        clinic_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 256]
            }
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: false
        },
        loc_lat: {
            type: DataTypes.STRING,
            allowNull: false
        },
        loc_long: {
            type: DataTypes.STRING,
            allowNull: false
        },
        street_address: {
            type: DataTypes.STRING,
            validate: {
                len: [1, 256]
            }
        },
        city: {
            type: DataTypes.STRING,
            validate: {
                len: [1, 32]
            }
        },
        state: {
            type: DataTypes.STRING,
            validate: {
                len: [1, 32]
            }
        },
        pinCode: {
            type: DataTypes.INTEGER,
            validate: {
                min: 100000,
                max: 999999
            }
        }
    });

    Clinic.associate = models => {
        Clinic.hasMany(models.doctorWA, {
            foreignKey: { allowNull: false },
            as: 'doctors',
        })
    }

    return Clinic;
};
