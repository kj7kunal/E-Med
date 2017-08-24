module.exports = function(sequelize, DataTypes) {
    var Doctor = sequelize.define("doctors", {
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
        telephone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        image: DataTypes.TEXT
    });


    // Doctor.associate = models => {
    //     Doctor.hasOne(models.appointment)

    Doctor.associate = (models) => {
        Doctor.hasMany(models.alerts, {
            foreignKey: { allowNull: false, }
        })
    }

    return Doctor;
}