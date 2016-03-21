var db = require('../../db');

var lastInObject = require('../../helpers/last_in_object');
var updateDoc = require('../../helpers/couchdb/update_doc');

var EventModel = function EventModel() {
  this.connection = db.connection;
  this.databaseList = db.databaseList;
  this.defaultDatabase = lastInObject(db.databaseList);
};

/**
 * Saves the latest design document to database
 *
 * @param {String} db - database key
 * @param {Function} callback
 */


EventModel.prototype.syncDesignDoc =
function syncDesignDoc(db, callback) {

  var database;

  if (typeof db === "string" || db instanceof String) {
    database = this.databaseList[db];
  } else {
    database = this.defaultDatabase;
  }

  var design = {
    "views": {
      "all": {
        map: function(doc) {
          if (doc._id) emit(doc._id, doc);
        }
      },
      "all_tweets": {
        map: function (doc) {
          if (doc.type === 'tweet') emit(doc._id, doc);
        }
      },
      "event_info": {
        map: function (doc) {
          if (doc.type === 'info') emit(doc._id, doc);
        }
      }
    }
  };

  updateDoc(design, '_design/tweets', database, function(err, res) {
    if (err) return callback(err);
    callback(null, res);
  });
};

/**
 * Returns all the documents from a database
 *
 * @param {String} db - database key
 * @param {Function} callback
 */

EventModel.prototype.findAll =
function findAll(db, callback) {

  var database;

  if (typeof db === "string" || db instanceof String) {
    database = this.databaseList[db];
  } else {
    database = this.defaultDatabase;
  }

  database.view('tweets', 'all', function(err, body) {
    if (err) return callback(err);

    var docs = [];
    body.rows.forEach(function (row) {
      docs.push(row);
    });
    callback(null, docs);
  });

};

/**
 * Returns all the documents by type from a database
 *
 * @param {String} db - database key
 * @param {String} docType - 'event_info' / 'all_tweets'
 * @param {Function} callback
 */

EventModel.prototype.findByType =
function findByType(db, docType, callback) {

  var database;

  if (typeof db === "string" || db instanceof String) {
    database = this.databaseList[db];
  } else {
    database = this.defaultDatabase;
  }

  database.view('tweets', docType, function(err, body) {
    if (err) {
      callback(error)
    } else {
      var docs = [];
      body.rows.forEach(function (row) {
        docs.push(row);
      });
      callback(null, docs);
    }
  });
};

/**
 * Saves a document (tweet) to the database
 *
 * @param {String} db - database key
 * @param {Object} tweet - tweet doc json object
 * @param {Function} callback
 */

EventModel.prototype.save =
function save(db, tweet, callback) {

  var database;

  if (typeof db === "string" || db instanceof String) {
    database = this.databaseList[db];
  } else {
    database = this.defaultDatabase;
  }

  database.insert(tweet, tweet.id_str, function callback(err, res) {
    if (err) {
      console.log(err);
    } else {
      console.log(`Tweet ${tweet.id_str} saved to db`);
    }
  });
}

module.exports = EventModel;
