const cradle = require('cradle');
// const nano = require('nano');

var config = require('./config/');
var auth =  config.database.auth;
var host = config.database.host;

// var nano = require('nano')('http://localhost:5984');

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

var databaseList = {
  dh_2012: c.database('digitalheroes-2012'),
  dh_2013: c.database('digitalheroes-2013'),
  dh_2014: c.database('digitalheroes-2014'),
  dh_2015: c.database('digitalheroes-2015'),
  dh_halloween15: c.database('digitalheroes-halloween-2015')
};

module.exports.connection = c;
module.exports.databaseList = databaseList;
