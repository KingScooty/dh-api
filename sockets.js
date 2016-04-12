var db = require('./db').database.latest();
console.log(db);

exports = module.exports = function (io) {

  var feed = db.follow({
    since: "now",
    include_docs: true
  });

  feed.follow();

  feed.on('change', function(change) {
    var doc = change.doc;
    console.log(`Emitting change at ${(new Date).toISOString()}`);
    io.sockets.emit('incomingTweet', doc);
  });

  io.on('connection', () => {
    console.log(`New user connected at ${(new Date).toISOString()}`);

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
