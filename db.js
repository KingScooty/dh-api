const cradle = require('cradle');

var config = require('./config/');
var auth =  config.database.auth;
var host = config.database.host;

var c = new (cradle.Connection)(host, 5984, {
  cache: true,
  raw: false,
  auth: auth
});

/*
  http://couchdb-3c369e79-1.kingscooty.cont.tutum.io:5984/_all_dbs

  ["_replicator","_users","digitalheroes-2012","digitalheroes-2013","digitalheroes-2014","digitalheroes-2015","digitalheroes-halloween-2015"]

  May be worth querying what databases exist, and then mounting them instead of storing the object below??

  This way would allow for creation of new databases programatically when there's a new event. Would the worker create the new entry?

  The API should allow for the creation of databases from an end point, perhaps?

  Would have to be a secure endpoint.
*/

var db = {
  dh_2012: c.database('digitalheroes-2012'),
  dh_2013: c.database('digitalheroes-2013'),
  dh_2014: c.database('digitalheroes-2014'),
  dh_2015: c.database('digitalheroes-2015'),
  dh_halloween15: c.database('digitalheroes-halloween-2015')
};

/**
 * Creates a new database
 *
 * @param {Object} database
 * @returns a promise??????
 */


// exports.createDB = function(database) {
//   // should really return a promise.
//   database.create(function(err, res) {
//     if (err) return err;
//     return res;
//   });
// }

exports.saveDoc = function() {}
exports.allDocs = function() {}

/**
 * Creates a view in the database
 *
 * @param {Object} database
 * @param {Function} callback
 * @returns {Function} callback
 */

exports.createDefaultView = function (database, callback) {

  console.log('Creating database view');

  db.save('_design/tweets', {
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
}

/**
 * Queries database via a view, and returns response.
 *
 * @param {String} view
 * @param {Array} options
 * @returns
 */

exports.getView = function(view, options) {
  db.view(view, options, function callback(err, response) {});
}













// var url = `${username}:${password}@${host}:5984/`
// var db = 'digitalheroes-2012';
//
// // save a document
// exports.save = function(db, doc, done) {
//   request.put({
//     url: `${url}/${db}/${doc._id}`,
//     body: doc,
//     json: true,
//   }, function(err, resp, body) {
//     if (err) return done('Unable to connect to CouchDB');
//     if (body.ok) {
//       doc._rev = body.rev;
//       return done(null doc);
//     }
//
//     done('Unable to save the document');
//   });
// }
