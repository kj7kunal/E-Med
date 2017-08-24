module.exports = function (sequelize, DataTypes) {
    var Specialist = sequelize.define("specialists", {
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
        practice_type: {
            type: DataTypes.STRING,
            defaultValue: "Patient",
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
        image: DataTypes.TEXT
    });
    return Specialist;
}