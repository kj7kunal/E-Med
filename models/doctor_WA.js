module.exports = function(sequelize, DataTypes) {
    var DoctorWA = sequelize.define("doctorWA", {
        office_telephone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // designation: {
        //     type: DataTypes.STRING,
        // }
    });

    DoctorWA.associate = (models) => {
        DoctorWA.belongsTo(models.userWA, {
            foreignKey: {
                allowNull: false,
            }
        })
    }

    DoctorWA.associate = (models) => {
        DoctorWA.belongsTo(models.clinicWA, {
            foreignKey: {
                field: "Clinic_id",
                allowNull: false,
            }
        })
    }

    return DoctorWA;
}