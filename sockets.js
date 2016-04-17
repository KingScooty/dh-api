const Promise = require('bluebird');
const co = Promise.coroutine;

const Event = require('./models/events');
const eventModel = new Event();

//sockets needs to:
// greet client on first connect
//emit an db content on first connect
//emit db change when feed follow detects a change

module.exports.newTweets = function newTweets (io, feed) {

  feed.on('change', function(change) {
    var doc = change.doc;
    console.log(`Emitting change at ${(new Date).toISOString()}`);
    io.sockets.emit('incomingTweet', doc);
  });

};

module.exports.greeting = function greeting (io) {
  io.on('connection', () => {
    // console.log(`SERVER: New user connected at ${(new Date).toISOString()}`);
    io.sockets.emit('greeting', `CLIENT: Connected at ${(new Date).toISOString()}`);
  });
};

module.exports.existingTweets = function existingTweets (io) {
  io.on('connection', () => {

    var tweets = co(function* () {
      return yield eventModel.findByType('dh_halloween15', 'all_tweets');
    });

    tweets().then(function(result) {
      console.log('ello?');
      // console.log(result);
      // io.sockets.emit('incomingTweet', result);
    });

  });
};
