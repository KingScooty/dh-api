'use strict';

var lastInObject = require('../helpers/last_in_object');
var updateDoc = require('../helpers/couchdb/update_doc');
var _ = require('lodash');
var Promise = require('bluebird');

var Model = function Model(dbName) {
  this.connection = dbName.connection; // maybe point to config instead??
  this.databaseList = dbName.databaseList;
  this.defaultDatabase = lastInObject(dbName.databaseList);
};

/**
 * Returns all the documents from a database
 *
 * @param {String} db - database key
 */

Model.prototype.listAll =
function listAll(dbName) {

  var database;

  if (typeof dbName === "string" || dbName instanceof String) {
    database = this.databaseList[dbName];
  } else {
    database = this.defaultDatabase;
  }

  return new Promise(function(fullfill, reject) {
    database.list({
      startkey: '_',
      include_docs: true,
      descending: true
    }, function(err, body) {
      var response = {};
      if (err) return reject(err);

      response.success = true;
      response.body = _.chain(body.rows)
        .map(function(row) {
          return row.doc;
        })
        .sortBy('type')
        .groupBy('type')
        .value();

      fullfill(response);
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
function findByType(dbName, designDocName, docType) {

  var database;

  if (typeof dbName === "string" || dbName instanceof String) {
    database = this.databaseList[dbName];
  } else {
    database = this.defaultDatabase;
  }

  return new Promise(function(fullfill, reject) {
    database.view(designDocName, docType, {descending: true}, function(err, body) {
      var response = {};
      if (err) return reject(err);

      response.success = true;
      response.body = body.rows.map(function(row) {
        return row.value;
      });

      fullfill(response);
    });
  });

};

module.exports = Model;
