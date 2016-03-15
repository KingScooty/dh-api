// const cluster = require('cluster');
const router = require('koa-router')();

router.get('/', (ctx, next) => {
  ctx.status = 200;
  ctx.body = 'Hello world from worker';
});

module.exports = router;
