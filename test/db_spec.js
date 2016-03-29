var chai = require('chai');

var expect = chai.expect;
chai.should();

var db = require('../db').database;
var lastInObject = require('../helpers/last_in_object');

describe('Database', () => {
  describe('latest()', () => {
    it('should return the latest database', () => {
      var dbList = require('../db').databaseList;
      var latest = db.latest();
      var expected = lastInObject(dbList);
      expect(latest.config.db).to.equal(expected.config.db);
    });
  });
  describe('year()', () => {
    it('should return a database requested by year', () => {
      var year = db.year(2012);
      expect(year.config.db).to.equal('digitalheroes-2012');
    });
  });
});
