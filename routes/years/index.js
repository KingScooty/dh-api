const router = require('koa-router')();

const api = 'years';
router.prefix(`/${api}`);

/**
 * GET all years.
 */

router.get('/', (ctx, next) => {
  ctx.status = 200;
  ctx.body = 'All the years!';
});


/**
 * GET year by :year.
 */

 router.get('/:year', (ctx, next) => {
   ctx.status = 200;
   ctx.body = `Listing the following year: ${ctx.params.year}`;
 });


// exports.show = function *() {
//   this.body = years[this.params.year];
// }

module.exports = router;
