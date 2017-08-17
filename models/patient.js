module.exports = function(sequelize, DataTypes) {
    var Patient = sequelize.define("patient", {
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
        dob: {
            type: DataTypes.DATE,
            allowNull: false
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
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        height: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        weight: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        allergies: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        procedures: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        emergency_contact_name: DataTypes.STRING,
        emergency_contact_number: {
            type: DataTypes.INTEGER,
            validate: {
                len: [1, 10]
            }
        },
        provider_name: DataTypes.STRING,
        appointments: DataTypes.STRING,
        image: DataTypes.STRING,

    });
    return Patient;
}