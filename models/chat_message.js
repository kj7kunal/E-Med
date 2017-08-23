module.exports = function(sequelize, DataTypes) {
    const Message = sequelize.define('message', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT
        },
        avatar: {
            type: DataTypes.TEXT
        }

    })
    return Message
}