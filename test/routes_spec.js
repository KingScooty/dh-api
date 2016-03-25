/*eslint-disable */
var api = require('../api');
var supertest = require('supertest');
var Promise = require('bluebird');
var sinon = require('sinon');
var chai = require('chai');

var expect = chai.expect;
chai.should();

const request = supertest.agent(api.listen());
const context = {};

const Event = require('../models/events');
// const eventController = require('../routes/events');
// var stub;

describe('API', () => {

  before(() => {

    var docs = new Promise(function(fullfill, reject) {
      fullfill({});
    });

    sinon.stub(Event.prototype, "findAll").returns(docs);
    sinon.stub(Event.prototype, "findByType").returns(docs);
  });

  it('should throw json 404 if route does not exist', (done) => {
    request
      .get('/api/fail/1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });

  describe('GET /api/events', () => {
    describe('/:year', () => {
      it('should fetch year', (done) => {
        request
          .get('/api/events/2015')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200, done);
      });

      it('should throw 404 if year doesn\'t exist', (done) => {
        request
          .get('/api/events/1')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(404, done);
      });
    });
    describe('/:year/info', () => {
      it('should should fetch info', (done) => {
        request
          .get('/api/events/2015/info')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200, done);
      });

      it('should throw 404 if info doesn\'t exist', (done) => {
        request
          .get('/api/events/1/info')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(404, done);
      });
    });
    describe('/:year/tweets', () => {
      it('should should fetch tweets', (done) => {
        request
          .get('/api/events/2015/tweets')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200, done);
      });

      it('should throw 404 if tweets don\'t exist', (done) => {
        request
          .get('/api/events/1/tweets')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(404, done);
      });
    });
  });

});
