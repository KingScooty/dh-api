/*eslint-disable */
var supertest = require('supertest');
var chai = require('chai');
var sinon = require('sinon');

var expect = chai.expect;

var proxyquire = require('proxyquire');

var tweetMock0 = require('./mocks/tweet0.json');
var tweetMock1 = require('./mocks/tweet1.json');

var dbHelpers = require('./helpers/couchdb');

var nano = require('nano')('http://localhost:5984');

var dbName = 'dbtest';

var ioClient = require('socket.io-client');
var socketURL = 'http://0.0.0.0:5000';

chai.should();

describe('Mock data', () => {
  before((done) => {
    var db = nano.use(dbName);

    var designDoc = {
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

    // this.timeout(5000);

    dbHelpers.createDB(dbName)
    .then(function() {
      return dbHelpers.insertTweet(db, 0);
    })
    .then(function() {
      return dbHelpers.insertEvent(db, 1);
    })
    .then(function() {
      return dbHelpers.updateDesignDoc(db, 'tweets', designDoc);
    })

    .then(function() {
      done();
    })
    .catch(function(err) {
      console.log(err);
    });

  });

  it('should contain a design document', (done) => {
    var db = nano.db.use(dbName);

    db.view('tweets', 'all', function(err, body) {
      if (err) return err;

      var docs = [];
      body.rows.forEach(function(doc) {
        docs.push(doc);
      });
      console.log(docs[0].value.id);
      console.log(tweetMock0.id);
      (docs[0].value.id).should.equal(tweetMock0.id);
      done();
    });
  });

});

describe('Sockets', () => {

  var apiSockets ;
  var dbMock;
  var ioServer;

  var dbFeed;
  var eventModel;
  var apiSockets;

  beforeEach(() => {

    ioServer = require('socket.io').listen(5000);

    dbMock = {
      connection: nano,
      databaseList: {
        db1: nano.use('dbtest')
      },
      database: {
        latest: function() {
          return nano.use('dbtest');
        }
      }
    };

    dbFeed = proxyquire('../db_feed', {
      './db': dbMock
    });

    eventModel = proxyquire('../models/events', {
      '../../db': dbMock
    });

    apiSockets = proxyquire('../sockets', {
      './models/events': eventModel
    });


  });

  afterEach(() => {
    ioServer.close();
    dbFeed.stop();
  });

  it('connects to socket on server', (done) => {
    var client1;

    apiSockets.greeting(ioServer);

    client1 = ioClient.connect(socketURL);

    client1.once('greeting', function(response) {
      expect(response).to.be.ok;
      done();
    });
  });

  it('emits dump of db on connection', (done) => {
    var client1;
    var db = nano.use('dbtest');
    var expectedResponse = [tweetMock0];


    client1 = ioClient.connect(socketURL);

    client1.once('incomingTweet', function(response) {
      var returnedResponse;

      // Maybe move this over to the model and filter before returning
      delete response.body[0]._rev;

      expect(response.body).to.deep.equal(expectedResponse);
      done();
    });

    apiSockets.existingTweets(ioServer);
  });

  it('emits the db change over sockets when detected', (done) => {
    var client1;
    var db = nano.use('dbtest');
    var expectedResponse = tweetMock1;

    client1 = ioClient.connect(socketURL);

    client1.once('incomingTweet', function(response) {
      var returnedResponse;

      // Maybe move this over to the model and filter before returning
      delete response._rev;

      expect(response).to.deep.equal(expectedResponse);
      done();
    });

    apiSockets.newTweets(ioServer, dbFeed);

    db.insert(tweetMock1, tweetMock1.id_str, function(err, response) {
      if (err) return console.log(err);
        expect(response).to.be.ok;
    });

  });

  after((done) => {
    nano.db.destroy(dbName, function(err, res) {
      if (err) return console.log(err);
        done();
    });
  });

});
