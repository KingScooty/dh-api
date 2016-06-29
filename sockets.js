const Promise = require('bluebird');
const co = Promise.coroutine;

const eventModel = require('./models/events');

function newTweets (io, feed) {

  feed.on('change', function(change) {
    var doc = change.doc;
    console.log(`Emitting change at ${(new Date).toISOString()}`);
    io.sockets.emit('incomingTweet', doc);
  });

};

function greeting (io) {
  io.on('connection', () => {
    // console.log(`SERVER: New user connected at ${(new Date).toISOString()}`);
    io.sockets.emit('greeting', `CLIENT: Connected at ${(new Date).toISOString()}`);
  });
};

function existingTweets (io) {
  io.on('connection', () => {

    var tweets = co(function* () {
      var tweets = yield eventModel.findByType(null, 'tweets', 'all_tweets');
      return tweets;
    });

    tweets().then(function(result) {
      io.sockets.emit('incomingTweet', result);
    });

  });
};

function socketsInit(io, feed) {
  greeting(io);
  // existingTweets(io);
  newTweets(io, feed);
}

module.exports.greeting = greeting;
module.exports.existingTweets = existingTweets;
module.exports.newTweets = newTweets;

module.exports.socketsInit = socketsInit;
