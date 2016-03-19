var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var mockCouch = require('mock-couch');
var proxyquire = require('proxyquire');

var Event = require('../models/events');
var eventModel = new Event();

var tweetMock = require('./mocks/tweet.json');

var couchdb;
var nano = require('nano')('http://localhost:5984');

chai.should();

describe('Mock Couch', () => {

  before(function() {
    couchdb = mockCouch.createServer();
    couchdb.listen(5984);

    // couchdb.addDB('dh_2012', [tweetMock]);
    // couchdb.addDB('dh_2013', [tweetMock]);
    // couchdb.addDB('dh_2014', [tweetMock]);
    // couchdb.addDB('dh_2015', [tweetMock]);
    // couchdb.addDB('dh_halloween15', [tweetMock]);

    var dbNames = [
      'dh_2012',
      'dh_2013',
      'dh_2014',
      'dh_2015',
      'dh_halloween15'
    ];

    for (var i = 0; i < dbNames.length; i++) {
      couchdb.addDB(dbNames[i], [tweetMock]);
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
  });

  it('should contain documents', (done) => {
    var db = nano.db.use('dh_halloween15');
    db.get('654788497228742656', function(err, body) {
      if (!err)
        done();
    });
  });

  it('should contain a design document', (done) => {
    var db = nano.db.use('dh_halloween15');
    db.view('tweets', 'all', function(err, body) {
      if (!err) {
        var docs = [];
        body.rows.forEach(function(doc) {
          docs.push(doc);
        });
        (docs[0].value.id).should.equal(tweetMock.id);
        done();
      }
    });
  });

/*
  it('should be able to update the design document', (done) => {
    var db = nano.db.use('dh_halloween15');

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
      console.log('Updated!');
    });
    // db.insert(design, '_design/tweets', function(err, res) {
    //   if (err) return console.log(err);
    //   console.log('Inserted!');
    // });

  });
*/

  it('should be able to save new documents', (done) => {
    var db = nano.db.use('dh_halloween15');
    db.insert(tweetMock, tweetMock.id_str, function callback(err, res) {
      if (err) {
        console.log(err);
      } else {
        expect(res).to.be.ok;
        (res.id).should.equal(tweetMock.id_str);
        done()
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
        dh_2014: nano.use('digitalheroes-2014')
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
      .and.have.all.keys('dh_2012', 'dh_2013', 'dh_2014');
  });

  it('should set an internal default database', () => {
    var newEventModel = new Event();
    expect(newEventModel.defaultDatabase).to.be.an.instanceOf(Object);
  });

  it('should set the default database to the last known event', () => {
    var newEventModel = new Event();

    expect(newEventModel.defaultDatabase.config.db)
      .to.equal('digitalheroes-2014');
  });

  // after(function(done) {
  //   cradleDB.destroy(done);
  // });

  describe('syncDesignDoc()', () => {
    it('should save the latest design doc to database', (done) => {
      // console.log(Event());

      var newEventModel = new Event();
      newEventModel.syncDesignDoc(null, function(err, response) {
        if (err) return console.log(err);
        console.log(response);
      });
    });
  });

  describe('findAll()', () => {
    it('', () => {});
    it('should should not fail if not passed a database param', () => {

    });

    it('should return all the documents from a default database when unspecified', (done) => {
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

});
