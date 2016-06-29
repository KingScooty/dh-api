const config = require('./config/');

const host =  config.database.host;
let nano;

if (process.env.NODE_ENV === 'production') {
  const user =  config.database.auth.username;
  const pass =  config.database.auth.password;

  nano = require('nano')(`http://${user}:${pass}@${host}`);
} else {
  nano = require('nano')(`http://${host}`);
}

var lastInObject = require('./helpers/last_in_object');

/*
  http://couchdb-3c369e79-1.kingscooty.cont.tutum.io:5984/_all_dbs

  ["_replicator","_users","digitalheroes-2012","digitalheroes-2013","digitalheroes-2014","digitalheroes-2015","digitalheroes-halloween-2015"]

  May be worth querying what databases exist, and then mounting them instead of storing the object below??

  This way would allow for creation of new databases programatically when there's a new event. Would the worker create the new entry?

  The API should allow for the creation of databases from an end point, perhaps?

  Would have to be a secure endpoint.
*/

var databaseList = {
  dh_2012: nano.use('digitalheroes-2012'),
  dh_2013: nano.use('digitalheroes-2013'),
  dh_2014: nano.use('digitalheroes-2014'),
  dh_2015: nano.use('digitalheroes-2015'),
  dh_halloween15: nano.use('digitalheroes-halloween-2015'),
  dh_2016: nano.use('digitalheroes-2016')
}

var database = {
  list: databaseList,

  /**
   * Returns a database connection based on year
   * @param {Integer} year
   */

  year: function(year) {
    return this.list[`dh_${year}`];
  },

  /**
   * Returns the latest database
   */

  latest: function() {
    return lastInObject(this.list);
  }

};

module.exports.connection = nano;
module.exports.databaseList = databaseList;
module.exports.database = database;
