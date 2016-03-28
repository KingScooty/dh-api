'use strict';

console.log(`Starting server at ${(new Date).toISOString()}`);
process.on('exit', () => {
  console.log(`Process exit at ${(new Date).toISOString()}`);
});

const api = require('./api');
const spdy = require('spdy');
const socketIo = require('socket.io');


const getServer = () => {
  const server = spdy.createServer({
    spdy: {
      plain: true,
      ssl: false,
    },
  }, api.callback());

  const io = socketIo.listen(server);

  io.on('connection', () => {
    // do stuff with socket
    /*
     * Handle couchdb changes and report update to user.
     * Use the nano updates method.
     * https://github.com/dscape/nano#nanoupdatesparams-callback
     *
     * Change params.feed to continuous or eventsource.
     * Idea is that couch will report when a new tweet is saved, and push it to
     * to the end user over this socked.
     */
  });

  return server;
};

getServer().listen(1337, () => {
  console.log('HTTP server listening on port 1337');
  const nano = require('nano')('http://127.0.0.1:5984');
  var db = nano.use('digitalheroes-halloween-2015');
  nano.updates({
    feed: "continuous"
  }, function(response) {
    console.log(response);
    console.log('Wha?');
  });
});
