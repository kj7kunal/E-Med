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


    Doctor.associate = (models) => {
        Doctor.hasMany(models.alerts, {
            foreignKey: { allowNull: false, },
            as: 'alerts'
        })
    }

    Doctor.associate = (models) => {
        Doctor.hasMany(models.appointment, {
            foreignKey: { allowNull: false, },
            as: 'appointments'
        })
    }


    return Doctor;
}