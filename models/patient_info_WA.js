// const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
    var PatientInfoWA = sequelize.define("patientInfoWA", {
        dob: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        sex: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: false
        },
        height_cm: {
            type: DataTypes.INTEGER
        },
        weight_kg: {
            type: DataTypes.INTEGER
        },
        blood_type: {
            type: DataTypes.STRING,
            validate: {
                is: /^(A|B|AB|O)[+-]$/
            }
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
        pincode: {
            type: DataTypes.INTEGER,
            validate: {
                min: 100000,
                max: 999999
            }
        },
        emergency_contact_name: DataTypes.STRING,
        emergency_contact_number: {
            type: DataTypes.STRING,
        },
        // image: DataTypes.TEXT
    });

    PatientInfoWA.associate = (models) => {
        PatientInfoWA.belongsTo(models.patientWA, {
            foreignKey: {
                allowNull: false,
            }
        })
    }

    return PatientInfoWA;
};