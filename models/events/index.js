var cradle = require('cradle');
var Promise = require('bluebird');
var db = require('../../db');

var lastInObject = require('../../helpers/last_in_object');

var EventModel = function EventModel() {
  this.connection = db.connection;
  this.databaseList = db.databaseList;
  this.defaultDatabase = lastInObject(db.databaseList);
};

/**
 * Saves the latest design document to database
 *
 * @param {String} db - 'dh2015' / 'dh_halloween15'
 * @param {Function} callback
 */


EventModel.prototype.syncDesignDoc =
function syncDesignDoc(db, callback) {

  var database;

  if (typeof db === "string" || db instanceof String) {
    database = this.databaseList[database]
  } else {
    database = this.defaultDatabase;
  }

  database.save('_design/tweets', {
    all: {
      map: function (doc) {
        if (doc._id) emit(doc._id, doc);
      }
    },
    all_tweets: {
      map: function (doc) {
        if (doc.type === 'tweet') emit(doc._id, doc);
      }
    },
    event_info: {
      map: function (doc) {
        if (doc.type === 'info') emit(doc._id, doc);
      }
    }
  }, function(err, res) {
    if (err) {
      console.log('error', err);
    } else {
      callback();
      //TODO: Swap this for a promise;
    }
  });
};

/**
 * Returns all the documents from a database
 *
 * @param {String} db - 'dh2015' / 'dh_halloween15'
 * @param {Function} callback
 */

EventModel.prototype.findAll =
function findAll(db, callback) {

  if (typeof db === "string" || db instanceof String) {
    database = this.databaseList[database]
  } else {
    database = this.defaultDatabase;
  }

  // return new Promise(function(resolve) {
    database.view('tweets/all', function(err, result) {
      if (err) {
        callback(err)
      } else {
        var docs = [];
        result.forEach(function (row) {
          docs.push(row);
        });
        // resolve(null, docs);
        callback(null, docs);
      }
    });
  // });

};

/**
 * Returns all the documents by type from a database
 *
 * @param {String} docType - 'event_info' / 'all_tweets'
 * @param {Function} callback
 */

EventModel.prototype.findByType =
function findByType(db, docType, callback) {

  if (typeof db === "string" || db instanceof String) {
    database = this.databaseList[database]
  } else {
    database = this.defaultDatabase;
  }

  database.view(`tweets/${docType}`, function(err, result) {
    if (err) {
      callback(error)
    } else {
      var docs = [];
      result.forEach(function (row) {
        docs.push(row);
      });
      callback(null, docs);
    }
  });
};

/**
 * Saves a document (tweet) to the database
 *
 * @param {String} docType - 'event_info' / 'all_tweets'
 * @param {Function} callback
 */

EventModel.prototype.save =
function save(db, tweet) {

  if (typeof db === "string" || db instanceof String) {
    database = this.databaseList[database]
  } else {
    database = this.defaultDatabase;
  }

  database.save(tweet.id_str, tweet, function callback(err, res) {
    if (err) {
      console.log(err);
    } else {
      console.log(`Tweet ${tweet.id_str} saved to db`);
    }
  });
}

/*
EventModel.prototype.findTweets = function(callback) {
  this.defaultDB.view('tweets/all_tweets', function(err, result) {
    if (err) {
      callback(error)
    } else {
      var docs = [];
      result.forEach(function (row) {
        docs.push(row);
      });
      callback(null, docs);
    }
  });
};

EventModel.prototype.findTweets = function(callback) {
  this.defaultDB.view('tweets/event_info', function(err, result) {
    if (err) {
      callback(error)
    } else {
      var docs = [];
      result.forEach(function (row) {
        docs.push(row);
      });
      callback(null, docs);
    }
  });
};
*/


// exports.EventModel = EventModel;
module.exports = EventModel;

//
//
// var db = req.db['dh_' + req.params.year];
//
// try {
//   db.view('tweets/all_tweets', function callback(err, response) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.json(response);
//     }
//   });
// } catch (exeception) {
//   res.send(404);
// }
