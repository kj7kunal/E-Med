const sequelize_fixtures = require('sequelize-fixtures');

//a map of [model name] : model
//see offical example on how to load models
//https://github.com/sequelize/express-example/blob/master/models/index.js
const models = require('../models');


//from file
module.exports = function() {

    //can use glob syntax to select multiple files 
    // return sequelize_fixtures.loadFile('../fixtures/*.json', models)

    return sequelize_fixtures.loadFile("./fixtures/data.json", models);

    // return sequelize_fixtures.loadFile(patient, models)


}