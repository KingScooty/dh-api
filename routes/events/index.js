const router = require('koa-router')();
const Promise = require('bluebird');
const co = Promise.coroutine;

const Event = require('../../models/events');

const eventModel = new Event();

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
  var year = `dh_${ctx.params.year}`;
  ctx.body = yield eventModel.findAll(year);
}));

/**
 * GET event info by :year/info.
 */

router.get('/:year/info', co(function *(ctx, next) {
  var year = `dh_${ctx.params.year}`;
  ctx.body = yield eventModel.findByType(year, 'event_info');
}));

/**
 * GET tweets by :year/tweets.
 */

router.get('/:year/tweets', co(function *(ctx, next) {
  var year = `dh_${ctx.params.year}`;
  ctx.body = yield eventModel.findByType(year, 'all_tweets');
}));



// exports.show = function *() {
//   this.body = years[this.params.year];
// }

module.exports = router;
