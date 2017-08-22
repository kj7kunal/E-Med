module.exports = function(sequelize, DataTypes) {
    var Prescription = sequelize.define("prescriptions", {
        med_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 45]
            }
        },
        patient_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        dose: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 45]
            }
        },
        amount: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 45]
            }
        },
        prescribed_date: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 45]
            }
        },
        renew_date: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 45]
            }
        }
    });

    Prescription.associate = (models) => {
        Prescription.hasMany(models.patient);
    }
    return Prescription;
};