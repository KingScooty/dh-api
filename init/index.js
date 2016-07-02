const databaseList = require('../db').databaseList;
const eventModel = require('../models/events');

module.exports = function init() {
  for (let key in databaseList) {
    eventModel.syncDesignDoc(key, function() {
      console.log(`Database: ${key}'s design doc is now in sync`);
    });
  }
}
