var chai = require('chai');

var expect = chai.expect;
chai.should();

const databaseList = require('../db');
const eventHelpers = require('../helpers/events');

describe('Event Helpers', () => {
  describe('getRandomYear()', function() {
    it('returns a random year as a string', function() {
      const yearKeys = Object.keys(databaseList);
      const year = eventHelpers.getRandomYear(yearKeys);
      expect(year).to.be.a('string');
      expect(yearKeys.indexOf(year)).to.be.above(-1);
    });
  });
  describe('removeNamespaceFromYear()', function() {
    it('returns a random year as a string', function() {
      const string = "dh_2015";
      const year = eventHelpers.removeNamespaceFromYear(string);
      const expectedYear = "2015";

      expect(year).to.equal(expectedYear);
    });
  });
});
