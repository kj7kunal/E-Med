module.exports = function(sequelize, DataTypes) {
    const Appointment = sequelize.define("appointment", {
        type: DataTypes.STRING,
        date: DataTypes.DATE
    })

    Appointment.associate = models => {
        Appointment.belongsTo(models.patient, {
            foreignKey: {
                allowNull: false,
            },
            as: 'patient',
        })
    }

    Appointment.associate = (models) => {
        Appointment.belongsTo(models.doctors, {
            foreignKey: {
                allowNull: false,
            },
            as: 'doctor',
        })
    }

    return Appointment;
}