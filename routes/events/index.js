const router = require('koa-router')();
const Promise = require('bluebird');
const co = Promise.coroutine;

const databaseList = require('../../db').databaseList;
const eventModel = require('../../models/events');

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



// exports.show = function *() {
//   this.body = years[this.params.year];
// }

module.exports = router;
