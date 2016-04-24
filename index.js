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
  const dbFeed = require('./db_feed');
  const eventSockets = require('./sockets').socketsInit(io, dbFeed);

  return server;
};

getServer().listen(1337, () => {
  console.log('HTTP server listening on port 1337');
});
