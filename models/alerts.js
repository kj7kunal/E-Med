module.exports = function(sequelize, DataTypes) {
    var Alert = sequelize.define("alerts", {
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 45]
            }
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 45]
            }
        },
        done: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        is_alert: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        }
    });

    Alert.associate = (models) => {
        Alert.belongsTo(models.doctors, {
            foreignKey: {
                allowNull: false,
            }
        })
    }

    return Alert;
}