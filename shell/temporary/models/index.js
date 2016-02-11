/* vim: set ts=2 sw=2 tw=0 expandtab: */

// load required libraries
const fs = require('fs');
const Sequelize = require('sequelize');
// const env = process.env.NODE_ENV || 'development';
const db = {};

// get the database info
const dbModelLocation = require('../config').dbModelLocation;
const dbConnectionConfig = require('../config').dbConnectionConfig;
const dbPass = require('../config-secret.js').dbPass;

// update the dbModelLocation with the root pah
const appRoot = require('app-root-path');
const dbModelLocationRel = appRoot + '/' + dbModelLocation;

const sequelize = new Sequelize(dbConnectionConfig.name,
    dbConnectionConfig.user,
    dbPass,
    dbConnectionConfig.options);

function importModel(modelName) {
  const model = sequelize.import(dbModelLocationRel + '/' + modelName);
  db[model.name] = model;
  return model;
}

fs.readdirSync(dbModelLocationRel).filter(function(file) {
  return (file.indexOf('.') !== 0) && (file !== 'index.js');
}).forEach(function(file) {
  importModel(file, db);
});

Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
