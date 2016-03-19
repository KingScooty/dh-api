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

/*
 * This currently behaves more like an end to end test,
 * by actually saving the data to the database.
 * Once the kinks are sorted, mock Cradle responses to remove the
 * need for an actual couchdb database to run the tests.
 */

var cradleDB;
cradleDB = client.database('db_spec_test');

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

  return new Promise(function(resolve) {
    for (var i = 0; i < (tweets.length - 1); i++) {
      cradleDB.save(tweets[i].id_str, tweets[i], function (err, res) {
        if (err) {
          resolve(err);
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

/*
  before(function(done) {
    createTestDB()
      // .then(saveData)
      .then(done);
  });
*/
  // after(function(done) {
  //   cradleDB.destroy(done);
  // });

  describe('saveView()', () => {

    it('should save a view', () => {
    });

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
