var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var mockCouch = require('mock-couch');
var proxyquire = require('proxyquire');

var Event = require('../models/events');
var eventModel = new Event();

var tweetMock0 = require('./mocks/tweet0.json');
var tweetMock1 = require('./mocks/tweet1.json');

var couchdb;
var nano = require('nano')('http://localhost:5984');

chai.should();

describe('Mock Couch', () => {

  before(function(done) {
/*
    couchdb = mockCouch.createServer();
    couchdb.listen(5984);

    // couchdb.addDB('dh_2012', [tweetMock0]);
    // couchdb.addDB('dh_2013', [tweetMock0]);
    // couchdb.addDB('dh_2014', [tweetMock0]);
    // couchdb.addDB('dh_2015', [tweetMock0]);
    // couchdb.addDB('dh_halloween15', [tweetMock0]);

    var dbNames = [
      'dh_2012',
      'dh_2013',
      'dh_2014',
      'dh_2015',
      'dh_halloween15'
    ];

    for (var i = 0; i < dbNames.length; i++) {
      couchdb.addDB(dbNames[i], [tweetMock0]);
      couchdb.addDoc(dbNames[i], {
        _id: '_design/tweets',
        views : {
          all: {
            map: function (doc) {
              if (doc._id) emit(doc._id, doc);
            }
          }
        }
      });
    }
*/

    nano.db.create('dh_halloween15_test', function(err, response) {

      if (err) return console.log(err);
      expect(response).to.be.ok;

      var db = nano.use('dh_halloween15_test');
      db.insert(tweetMock0, tweetMock0.id_str, function(err, response) {
        if (err) return console.log(err);
          expect(response).to.be.ok;
          done();
      });
    });

  });

  it('should be able to save new documents', (done) => {

    var db = nano.db.use('dh_halloween15_test');
    db.insert(tweetMock1, tweetMock1.id_str, function callback(err, res) {
      if (err) {
        console.log(err);
      } else {
        expect(res).to.be.ok;
        (res.id).should.equal(tweetMock1.id_str);
        done()
      }
    });
  });

  it('should contain documents', (done) => {
    var db = nano.db.use('dh_halloween15_test');
    db.get('654788497228742656', function(err, body) {
      if (!err)
        done();
    });
  });

  it('should be able to update the design document', (done) => {
    var db = nano.db.use('dh_halloween15_test');

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

    db.update(design, '_design/tweets', function(err, res) {
      if (err) return console.log(err);
      expect(res).to.be.ok;
      done();
    });

  });

  it('should contain a design document', (done) => {
    var db = nano.db.use('dh_halloween15_test');
    db.view('tweets', 'all', function(err, body) {
      if (!err) {
        var docs = [];
        body.rows.forEach(function(doc) {
          docs.push(doc);
        });
        (docs[0].value.id).should.equal(tweetMock0.id);
        done();
      }
    });
  });


});


describe('Event', () => {

  var Event;

  before(function() {
    var dbMock = {
      connection: nano,
      databaseList: {
        dh_2012: nano.use('digitalheroes-2012'),
        dh_2013: nano.use('digitalheroes-2013'),
        dh_2014: nano.use('digitalheroes-2014'),
        dh_halloween15: nano.use('dh_halloween15_test')
      }
    };

    Event = proxyquire('../models/events', {
      '../../db': dbMock
    });
  });

  it('should set an internal database connection', () => {
    var newEventModel = new Event();

    expect(newEventModel.connection).to.be.an.instanceOf(Object)
      .and.have.any.keys('config', 'db');
  });

  it('should set an internal database list', () => {
    var newEventModel = new Event();

    expect(newEventModel.databaseList).to.be.an.instanceOf(Object)
      .and.have.all.keys('dh_2012', 'dh_2013', 'dh_2014', 'dh_halloween15');
  });

  it('should set an internal default database', () => {
    var newEventModel = new Event();
    expect(newEventModel.defaultDatabase).to.be.an.instanceOf(Object);
  });

  it('should set the default database to the last known event', () => {
    var newEventModel = new Event();

    expect(newEventModel.defaultDatabase.config.db)
      .to.equal('dh_halloween15_test');
  });


  describe('syncDesignDoc()', () => {
    it('should save the latest design doc to database', (done) => {
      var newEventModel = new Event();
      newEventModel.syncDesignDoc(0, function(err, response) {
        if (err) return console.log(err);
        expect(response).to.be.ok;
        done();
      });
    });
  });

  describe('findAll()', () => {
    it('', () => {});
    it('should should not fail if not passed a database param', () => {

    });

    it('should return all the documents from a default database when unspecified', () => {
      // Mock database.view inside eventModel.findAll

      // var database = sinon.mock(Datana);
      // database.expects('view').once().withArgs('tweets/all');

      // couchdb.on('GET', function(data) {
      //   console.log(data);
      //   done();
      // });
      //
      // eventModel.findAll(null, function(err, docs) {
      //   if (err) {
      //     console.log(err);
      //   } else {
      //     console.log(docs);
      //   }
      // });

    });

    it('should return all documents from a specified database', () => {

    });
  });

  describe('findByType()', () => {
    it('should return all documents by type from a database', () => {});
  });

  describe('saveDoc()', () => {
    it('', () => {});
  });

  after(function() {
    nano.db.destroy('dh_halloween15_test');
  });

});
