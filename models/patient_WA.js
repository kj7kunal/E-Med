// Patient Table
module.exports = function(sequelize, DataTypes) {
    var PatientWA = sequelize.define("patientWA", {
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
        }
    });

    PatientWA.associate = models => {
        PatientWA.hasOne(models.patientInfoWA, {
            foreignKey: { allowNull: false, }
        })
    }

    PatientWA.associate = (models) => {
        PatientWA.belongsTo(models.userWA, {
            foreignKey: {
                field: "User_id",
                allowNull: false,
            }
        })
    }

    return PatientWA;
};