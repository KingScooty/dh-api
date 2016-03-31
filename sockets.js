

exports = module.exports = function (io) {

  io.on('connection', () => {
    console.log(`New user connected at ${(new Date).toISOString()}`);

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

}

const lastInObject = require('../../helpers/last_in_object');
var db = require('db').database.latest();

var feed = db.follow({
  since: "now",
  include_docs: true
});

feed.on('change', function(change) {
  var doc = change.doc;
  io.sockets.emit('incomingTweet', {});
});

feed.follow();



function Subscription() {
  this.db = db;
}
