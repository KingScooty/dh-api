var chai = require('chai');
var expect = chai.expect;
var cradle = require('cradle');
var Promise = require('bluebird');

var db = require('../db');

var config = require('../config/');

var client = new (cradle.Connection)(config.database.host, 5984, {
  cache: true,
  raw: false,
  auth: config.database.auth
});

var cradleDB;
// cradleDB = client.database('db_spec_test');

var createTestDB = function createTestDB() {
  return new Promise(function(resolve) {

    cradleDB = client.database('db_spec_test');
    Promise.promisifyAll(cradleDB.create);
    cradleDB.create(function(err, res) {
      if (err) return resolve(err);
      resolve()
    });

  });
}

var saveData = function saveData() {
  var fixture = require('./mocks/halloween2015.json');
  var tweets = fixture.docs;

  // cradleDB.save(tweets, function(err, res) {
  //   console.log(res);
  // });

  return new Promise(function(resolve) {
    for (var i = 0; i < (tweets.length - 1); i++) {
      cradleDB.save(tweets[i].id_str, tweets[i], function (err, res) {
        if (err) {
          done(err);
          // console.log('error', err);
        } else {
          // console.log('Fixture entry added to database');
          if (i === (tweets.length - 1)) {
            resolve()
          }
        }
      });
    }
  });

}

chai.should();
describe('Database helpers', () => {

  before(function(done) {
    createTestDB()
      .then(saveData)
      .then(done);
  });


  after(function(done) {
    cradleDB.destroy(done);
  })

  describe('createDB()', () => {
    // it('should create a database', (done) => {
      // db.createDB(c.database('SpecTestDatabase'), done);
      // response.ok.should.be.true;
    // });
  });

  describe('saveDoc()', () => {
    it('', () => {});
  });

  describe('allDocs()', () => {
    it('', () => {});
  });

  describe('getView()', () => {

    it('', () => {});
  });

});
