const router = require('koa-router')();

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

router.get('/:year', (ctx, next) => {
  ctx.body = {
    body: `Listing the following year: ${ctx.params.year}`
  };
});


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
