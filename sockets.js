exports = module.exports = function initSockets (io, feed) {

  feed.on('change', function(change) {
    var doc = change.doc;
    console.log(`Emitting change at ${(new Date).toISOString()}`);
    io.sockets.emit('incomingTweet', doc);
  });

  io.on('connection', () => {
    // console.log(`SERVER: New user connected at ${(new Date).toISOString()}`);
    io.sockets.emit('greeting', `CLIENT: Connected at ${(new Date).toISOString()}`);
    /*
     * Handle couchdb changes and report update to user.
     * Use the nano updates method.
     * https://github.com/dscape/nano#nanoupdatesparams-callback
     *
     * Change params.feed to continuous or eventsource.
     * Idea is that couch will report when a new tweet is saved, and push it to
     * to the end user over this socket.
     */
  });

}
