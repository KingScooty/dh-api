const router = require('koa-router')();

const api = 'users';
router.prefix(`/${api}`);

/**
 * GET all users.
 */

router.get('/', (ctx, next) => {
  ctx.status = 200;
  ctx.body = 'All the users!';
});


/**
 * GET user by :user.
 */

 router.get('/:user', (ctx, next) => {
   ctx.status = 200;
   ctx.body = `Listing the following user: ${ctx.params.user}`;
 });


// exports.show = function *() {
//   this.body = users[this.params.user];
// }

module.exports = router;
