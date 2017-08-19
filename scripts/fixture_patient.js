const sequelize_fixtures = require('sequelize-fixtures'),
    models = require('../models');

module.exports = () => {

    return sequelize_fixtures.loadFile("./fixtures/data.json", models);

}