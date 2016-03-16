/*eslint-disable */
var supertest = require('supertest');
var chai = require('chai');

var expect = chai.expect;
chai.should();

// const request = supertest.agent(app.listen());
// const context = {};

describe('Years', () => {
  before((done) => {
    // cleanDb?
    done();
  });

  // describe('POST /years', () => {
  // });

  describe('GET /years', () => {
    it('should fetch all users', () => {});
  });

  describe('GET /years/:year', () => {
    it('should throw 404 if year doesn\'t exist', () => {});
    it('should fetch year', () => {});
  });

});
