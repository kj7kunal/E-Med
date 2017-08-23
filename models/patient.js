// const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
    var Patient = sequelize.define("patient", {
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
        gender: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dob: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        street_address: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 45]
            }
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 45]
            }
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        zip: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        telephone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        height: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        weight: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        allergies: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        procedures: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            defaultValue: "Patient",
        },
        emergency_contact_name: DataTypes.STRING,
        emergency_contact_number: {
            type: DataTypes.STRING,
        },
        provider_name: DataTypes.STRING,
        appointments: DataTypes.STRING,
        image: DataTypes.TEXT
    });

    Patient.associate = models => {
        Patient.hasOne(models.User)
    }

    Patient.associate = models => {
        Patient.belongsTo(models.prescriptions, {
            foreignKey: {
                field: "Prescription_id"
            }
        })
    }

    Patient.associate = models => {
        Patient.hasOne(models.appointment)
    }

    return Patient;
};