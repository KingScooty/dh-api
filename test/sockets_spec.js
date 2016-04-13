/*eslint-disable */
var supertest = require('supertest');
var chai = require('chai');
var sinon = require('sinon');

var expect = chai.expect;

var proxyquire = require('proxyquire');

var tweetMock0 = require('./mocks/tweet0.json');

var nano = require('nano')('http://localhost:5984');

var ioClient = require('socket.io-client');
var socketURL = 'http://0.0.0.0:5000';

chai.should();

describe('Sockets', () => {

  var apiSockets, dbMock;
  var ioServer;
  var dbFeed;

  before((done) => {
    nano.db.create('dbtest', function(err, response) {
      done();
    });
  });

  beforeEach(() => {

    ioServer = require('socket.io').listen(5000);

    dbMock = {
      database: {
        latest: function() {
          return nano.use('dbtest');
        }
      }
    };

    dbFeed = proxyquire('../db_feed', {
      './db': dbMock
    });

    apiSockets = require('../sockets');
  });

  afterEach(() => {
    ioServer.close();
    dbFeed.stop();
  });

  it('connects to socket on server', (done) => {
    var client1;

    apiSockets(ioServer, dbFeed);

    client1 = ioClient.connect(socketURL);

    client1.once('greeting', function(response) {
      expect(response).to.be.ok;
      done();
    });
  });

  it('emits the db change over sockets when detected', (done) => {
    var client1;
    var db = nano.use('dbtest');
    var expectedResponse = (JSON.stringify(tweetMock0, null, 2));

    client1 = ioClient.connect(socketURL);

    client1.once('incomingTweet', function(response) {
      var returnedResponse;

      delete response._rev;

      returnedResponse = (JSON.stringify(response, null, 2));
      expect(returnedResponse).to.equal(expectedResponse);
      done();
    });

    apiSockets(ioServer, dbFeed);

    db.insert(tweetMock0, tweetMock0.id_str, function(err, response) {
      if (err) return console.log(err);
        expect(response).to.be.ok;
    });

  });

  after((done) => {
    nano.db.destroy('dbtest', function(err, res) {
      if (err) return console.log(err);
        done();
    });
  });

});
