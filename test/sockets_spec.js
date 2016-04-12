/*eslint-disable */
var supertest = require('supertest');
var chai = require('chai');
var sinon = require('sinon');

var expect = chai.expect;

var proxyquire = require('proxyquire');

var nano = require('nano')('http://localhost:5984');
var io = {};
io.on = function() {};

// var apiSockets = require('../sockets')(io);

chai.should();

function emitDBChange() {

}

describe('Sockets', () => {

  var apiSockets;

  before((done) => {
    nano.db.create('dbtest', function(err, response) {
      done();
    });

    var dbMock = {
      connection: nano,
      databaseList: {
        db_test: nano.use('dbtest')
      }
    };

    apiSockets = proxyquire('../sockets', {
      './db': dbMock
    });
  });

  after(() => {
    nano.db.destroy('dbtest');
  });

  it.only('emits the db change over sockets when detected', () => {
    // var stub = sinon.spy(nano, '')
    apiSockets(io);

  });

  // describe('', () => {
  //   it('', () => {});
  // });

});
