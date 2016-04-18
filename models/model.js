// var db = require('../db');
var lastInObject = require('../helpers/last_in_object');
var updateDoc = require('../helpers/couchdb/update_doc');
var Promise = require('bluebird');

/*
 Abstract a basic 'Model', that handles all generic couchdb communication.
 EventModel = new Model.

 Then prototype or assign specific functions to EventModel????
 */

var Model = function Model(db) {
  this.connection = db.connection; // maybe point to config instead??
  this.databaseList = db.databaseList;
  this.defaultDatabase = lastInObject(db.databaseList);
};

// generic model needs to:
// retrieve all documents from database
// retrieve document by type from database

// specific model needs to:
// sync design document to database


/**
 * Returns all the documents from a database
 *
 * @param {String} db - database key
 */

Model.prototype.listAll =
function listAll(db) {

  var database;

  if (typeof db === "string" || db instanceof String) {
    database = this.databaseList[db];
  } else {
    database = this.defaultDatabase;
  }

  return new Promise(function(fullfill, reject) {
    database.list({
      endkey: '_',
      include_docs: true
    }, function(err, body) {
      var docs = [];
      if (err) return reject(err);

      body.rows.forEach(function (row) {
        docs.push(row);
      });

      fullfill(docs);
    });
  });

};

/**
 * Returns all the documents by type from a database
 *
 * @param {String} db - database key
 * @param {String} docType - 'event_info' / 'all_tweets'
 */

Model.prototype.findByType =
function findByType(db, designDocName, docType) {

  var database;

  if (typeof db === "string" || db instanceof String) {
    database = this.databaseList[db];
  } else {
    database = this.defaultDatabase;
  }

  return new Promise(function(fullfill, reject) {
    database.view(designDocName, docType, function(err, body) {
      var docs = [];
      if (err) return reject(err);

      body.rows.forEach(function (row) {
        docs.push(row);
      });

      fullfill(docs);
    });
  });

};

module.exports = Model;
