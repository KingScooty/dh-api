var Promise = require('bluebird');
var nano = require('nano')('http://localhost:5984');

var mocks = {};
mocks.tweetMock0 = require('../mocks/tweet0.json');
mocks.tweetMock1 = require('../mocks/tweet1.json');

mocks.eventMock0 = require('../mocks/event_info0.json');
mocks.eventMock1 = require('../mocks/event_info1.json');

var insertTweet = function insertTweet(db, number) {
  return new Promise((fullfill, reject) => {
    var mock = mocks[`tweetMock${number}`];
    db.insert(mock, mock.id_str, function(err, response) {
      if (err) return reject(err);
      console.log(`TweetMock${number} saved to ${db.config.db}.`)
      return fullfill(response);
    });
  });
}

var insertEvent = function insertEvent(db, number) {
  return new Promise((fullfill, reject) => {
    var mock = mocks[`eventMock${number}`];
    db.insert(mock, function(err, response) {
      if (err) return reject(err);
      console.log(`EventMock${number} saved to ${db.config.db}.`)
      return fullfill(response);
    });
  });
}

var createDB = function createDB (dbName) {
  return new Promise(function(fullfill, reject) {
    nano.db.create(dbName, function(err, response) {
      if (err) return reject(err);
      var db = nano.use(dbName);
      fullfill(db);
    });
  });
}

var updateDesignDoc = function updateDesignDoc(db, designName, designDoc) {
  var design = designDoc ||  {
    "views": {
      "all": {
        map: function(doc) {
          if (doc._id) emit(doc._id, doc);
        }
      }
    }
  };

  db.update = function(obj, key, callback) {
    var db = this;
    db.get(key, function (error, existing) {
      if(!error) obj._rev = existing._rev;
      db.insert(obj, key, callback);
    });
  }

  return new Promise(function(fullfill, reject) {
    db.update(design, `_design/${designName}`, function(err, res) {
      if (err) return reject(err);
      fullfill(res);
    });
  });
}

module.exports = {
  createDB,
  insertTweet,
  insertEvent,
  updateDesignDoc
}
