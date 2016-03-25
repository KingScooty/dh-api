/*eslint-disable */
var api = require('../api');
var supertest = require('supertest');
var chai = require('chai');

var expect = chai.expect;
chai.should();

const request = supertest.agent(api.listen());
const context = {};

// console.log(request);

describe('API', () => {
  // before((done) => {
  //   done();
  // });

  describe('GET /api/events/:year', () => {

    it('should should fetch year', (done) => {
      request
        .get('/api/events/2015')
        .set('Accept', 'application/json')
        .expect(200, done);
    });

    it('should throw 404 if year doesn\'t exist', (done) => {
      request
        .get('/api/events/1')
        .set('Accept', 'application/json')
        .expect(404, done);
    });
  });

  describe('', () => {
    it('', () => {});
  });

});
