var chai = require('chai');

var expect = chai.expect;
chai.should();

var db = require('../db').database;

describe('Database', () => {
  describe('latest()', () => {
    it('should return the latest database', () => {
      var latest = db.latest();
      expect(latest.config.db).to.equal('digitalheroes-halloween-2015');
    });
  });
  describe('year()', () => {
    it('should return a database requested by year', () => {
      var year = db.year(2012);
      expect(year.config.db).to.equal('digitalheroes-2012');
    });
  });
});
