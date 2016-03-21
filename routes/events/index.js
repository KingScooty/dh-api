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


router.get('/:year/info', (ctx, next) => {
  ctx.body = {
    body: `INFO for the year: ${ctx.params.year}`
  };
});

router.get('/:year/tweets', (ctx, next) => {
  ctx.body = `TWEETS for the year: ${ctx.params.year}`;
});



// exports.show = function *() {
//   this.body = years[this.params.year];
// }

module.exports = router;
