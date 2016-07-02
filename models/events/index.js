var db = require('../../db');

var lastInObject = require('../../helpers/last_in_object');
var updateDoc = require('../../helpers/couchdb/update_doc');
var Model = require('../model');

var eventModel = new Model(db);

/**
 * Saves the latest design document to database
 *
 * @param {String} db - database key
 * @param {Function} callback
 */

eventModel.syncDesignDoc = function syncDesignDoc(dbName, callback) {

  var database;

  if (typeof dbName === "string" || dbName instanceof String) {
    database = this.databaseList[dbName];
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
      },
      "with_photos": {
        map: function(doc) {
          var onlyPhotos = doc.extended_entities.media.every(function(mediaItem) {
              return (mediaItem.type === 'photo' && mediaItem.type !== 'video' && mediaItem.type !== 'animated_gif');
          });

          if (onlyPhotos) emit(doc._id, doc);
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
 * Saves a document (tweet) to the database
 *
 * @param {String} db - database key
 * @param {Object} tweet - tweet doc json object
 * @param {Function} callback
 */

// eventModel.prototype.save =
// function save(db, tweet, callback) {
//
//   var database;
//
//   if (typeof db === "string" || db instanceof String) {
//     database = this.databaseList[db];
//   } else {
//     database = this.defaultDatabase;
//   }
//
//   database.insert(tweet, tweet.id_str, function callback(err, res) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(`Tweet ${tweet.id_str} saved to db`);
//     }
//   });
// }
//

module.exports = eventModel;
