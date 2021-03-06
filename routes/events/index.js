const router = require('koa-router')();
const Promise = require('bluebird');
const co = Promise.coroutine;

const databaseList = require('../../db').databaseList;
const eventModel = require('../../models/events');

const eventHelpers = require('../../helpers/events');

// const eventModel = new Event();

const api = 'api/events';
router.prefix(`/${api}`);

/**
 * GET all years.
 */

router.get('/', (ctx, next) => {
  ctx.body = {
    body: 'All the events!'
  }
});

/**
 * GET latest
 */

const LATEST = 'dh_2016';

router.get('/latest', co(function *(ctx, next) {
  const year_query = LATEST; // change this to dynamically pick latest event
  if (!databaseList.hasOwnProperty(year_query)) return ctx.throw(404);

  ctx.body = yield eventModel.listAll(year_query);
}));

router.get('/latest/info', co(function *(ctx, next) {
  var year_query = LATEST;
  if (!databaseList.hasOwnProperty(year_query)) return ctx.throw(404);

  ctx.body = yield eventModel.findByType(year_query, 'tweets', 'event_info');
}));

router.get('/latest/tweets', co(function *(ctx, next) {
  var year_query = LATEST;
  if (!databaseList.hasOwnProperty(year_query)) return ctx.throw(404);

  ctx.body = yield eventModel.findByType(year_query, 'tweets', 'all_tweets');
}));

router.get('/latest/tweets/photos', co(function *(ctx, next) {
  var year_query = LATEST;
  if (!databaseList.hasOwnProperty(year_query)) return ctx.throw(404);

  ctx.body = yield eventModel.findByType(year_query, 'tweets', 'with_photos');
}));

 /**
  * GET hashtags by latest/hashtags.
  */

router.get('/latest/hashtags', co(function *(ctx, next) {
  ctx.body = {
    success: true,
    body: {
      client: '#digitalheroes2016',
      worker: ['#digitalheroes', '#digital-heroes2016', '#digitalheroes2016']
    }
  }
}));

/**
 * GET random
 */

 router.get('/random/tweet', co(function *(ctx, next) {
   var year_query = eventHelpers.getRandomYear(Object.keys(databaseList));
   if (!databaseList.hasOwnProperty(year_query)) return ctx.throw(404);

  var response = yield eventModel.findByType(year_query, 'tweets', 'all_tweets');
  var length = response.body.length;
  var random = Math.floor(Math.random()*length);

  ctx.body = {
    success: true,
    body: response.body[random] || {}
  }
 }));

 router.get('/random/tweet/photos', co(function *(ctx, next) {
   var year_query = eventHelpers.getRandomYear(Object.keys(databaseList));
   if (!databaseList.hasOwnProperty(year_query)) return ctx.throw(404);

  var response = yield eventModel.findByType(year_query, 'tweets', 'with_photos');
  var length = response.body.length;
  var random = Math.floor(Math.random()*length);

  ctx.body = {
    success: true,
    body: response.body[random] || {}
  }
 }));

/**
 * GET year by :year.
 */

router.get('/:year', co(function *(ctx, next) {
  const year_query = `dh_${ctx.params.year}`;
  if (!databaseList.hasOwnProperty(year_query)) return ctx.throw(404);

  ctx.body = yield eventModel.listAll(year_query)
}));

/**
 * GET event info by :year/info.
 */

router.get('/:year/info', co(function *(ctx, next) {
  var year_query = `dh_${ctx.params.year}`;
  if (!databaseList.hasOwnProperty(year_query)) return ctx.throw(404);

  ctx.body = yield eventModel.findByType(year_query, 'tweets', 'event_info');
}));

/**
 * GET tweets by :year/tweets.
 */

router.get('/:year/tweets', co(function *(ctx, next) {
  var year_query = `dh_${ctx.params.year}`;
  if (!databaseList.hasOwnProperty(year_query)) return ctx.throw(404);

  ctx.body = yield eventModel.findByType(year_query, 'tweets', 'all_tweets');
}));

/**
 * GET tweets by :year/tweets/photos.
 */

router.get('/:year/tweets/photos', co(function *(ctx, next) {
  var year_query = `dh_${ctx.params.year}`;
  if (!databaseList.hasOwnProperty(year_query)) return ctx.throw(404);

  ctx.body = yield eventModel.findByType(year_query, 'tweets', 'with_photos');
}));

router.get('/:year/tweets/photos/random', co(function *(ctx, next) {
  var year_query = `dh_${ctx.params.year}`;
  if (!databaseList.hasOwnProperty(year_query)) return ctx.throw(404);

  var response = yield eventModel.findByType(year_query, 'tweets', 'with_photos');
  var length = response.body.length;
  var random = Math.floor(Math.random()*length);

  ctx.body = {
    success: true,
    body: response.body[random] || {}
  }
}));


/**
 * GET hashtags by :year/hashtags.
 */

router.get('/:year/hashtags', co(function *(ctx, next) {
  ctx.body = {
    success: true,
    body: {
      client: `#digitalheroes${ctx.params.year}`,
      worker: ['#digitalheroes', `#digital-heroes${ctx.params.year}`,  `#digitalheroes${ctx.params.year}`]
    }
  }
}));



// exports.show = function *() {
//   this.body = years[this.params.year];
// }

module.exports = router;
