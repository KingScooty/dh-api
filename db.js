const cradle = require('cradle');

var config = require('./config/');
var auth =  config.database.auth;
var host = config.database.host;

var c = new (cradle.Connection)(host, 5984, {
  cache: true,
  raw: false,
  auth: auth
});

var db = {
  dh_2012: c.database('digitalheroes-2012'),
  dh_2013: c.database('digitalheroes-2013'),
  dh_2014: c.database('digitalheroes-2014'),
  dh_2015: c.database('digitalheroes-2015'),
  dh_halloween15: c.database('digitalheroes-halloween-2015')
};

exports.saveDoc = function() {}
exports.allDocs = function() {}

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
