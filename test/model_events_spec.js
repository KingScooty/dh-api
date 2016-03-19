var chai = require('chai');
var expect = chai.expect;
var cradle = require('cradle');
// var Promise = require('bluebird');
// var sinon = require('sinon');

var mockCouch = require('mock-couch');

var Event = require('../models/events');
var eventModel = new Event();

var tweetMock = require('./mocks/tweet.json');

chai.should();

var couchdb;

describe('Mock Couch', () => {

  before(function() {
    couchdb = mockCouch.createServer();
    couchdb.listen(5984);
    couchdb.addDB('dh_halloween15', [tweetMock]);

    couchdb.addDoc('dh_halloween15', {
      _id: '_design/tweets',
      views : {
        all: {
          map: function (doc) {
            if (doc._id) emit(doc._id, doc);
          }
        }
      }
    });
  });

  it('should contain documents', (done) => {
    var nano = require('nano')('http://localhost:5984');
    var db = nano.db.use('dh_halloween15');
    db.get('654788497228742656', function(err, body) {
      if (!err)
        done();
    })
  });
});

describe('Event', () => {




  // after(function(done) {
  //   cradleDB.destroy(done);
  // });

  describe('syncDesignDoc()', () => {
    it('should save the latest design doc to database', (done) => {
      // console.log(Event());

      // var database = sinon.mock(database)
      // Need to stub out database = this.databaseList[database]
      // Event.syncDesignDoc('');
    });
  });

  describe('findAll()', () => {
    it('should return all the documents from a database', (done) => {
      // Mock database.view inside eventModel.findAll

      // var database = sinon.mock(Datana);
      // database.expects('view').once().withArgs('tweets/all');

      // couchdb.on('GET', function(data) {
      //   console.log(data);
      // });

      // eventModel.findAll(null, function(err, docs) {
      //   if (err) {
      //     console.log(err);
      //   } else {
      //     console.log(docs);
      //   }
      // });

    });
  });

  describe('findByType()', () => {
    it('should return all documents by type from a database', () => {});
  });

  describe('saveDoc()', () => {
    it('', () => {});
  });

});
