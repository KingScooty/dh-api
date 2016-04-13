var db = require('./db').database.latest();

var feed = db.follow({
  since: "now",
  include_docs: true
});

feed.on('error', function(er) {
  console.error(er);
});

feed.follow();

exports = module.exports = feed;
