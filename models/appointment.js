module.exports = function(sequelize, DataTypes) {
    const Appointment = sequelize.define("appointment", {
        type: DataTypes.STRING,
        date: DataTypes.DATE
    })

    Appointment.associate = models => {
        Appointment.belongsTo(models.doctors, {
            foreignKey: {
                field: "doctor_id"
            },
            type: DataTypes.INTEGER
        })
    }

    Appointment.associate = models => {
        Appointment.belongsTo(models.patient, {
            foreignKey: {
                field: "patient_id"
            },
            type: DataTypes.INTEGER
        })
    }
    return Appointment;
}