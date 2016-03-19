var chai = require('chai');
var expect = chai.expect;

var config = require('../config/');

describe('Helpers', () => {
  describe('lastInObject()', () => {
    var lastInObject = require('../helpers/last_in_object');
    it('should return the last item in an object', () => {
      var object = {
        item1: 'Bacon',
        item2: 'I like cake',
        list: [10,9,8,7,6],
        list2: [1,2,3,4,5],
        alpha: 'Last item!',
      };

      var object1 = {
        item2: 'I like cake',
        list2: [1,2,3,4,5],
        list: [10,9,8,7,6],
        item1: 'Bacon',
      };

      lastInObject(object).should.equal('Last item!');
      lastInObject(object1).should.equal('Bacon');
    });
  });
});
