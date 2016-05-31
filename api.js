'use strict';
// const Promise = require('bluebird');
// const co = Promise.coroutine;
const Compress = require('koa-compress');
const Morgan = require('koa-morgan');
const Promise = require('bluebird');
const co = Promise.coroutine;

// middleware

const Koa = require('koa');
const api = new Koa();

const logger = Morgan('combined');

api.use(co(function *(ctx, next) {
  var allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
  var origin = ctx.headers.origin;

  if(allowedOrigins.indexOf(origin) > -1){
    ctx.set('Access-Control-Allow-Origin', origin);
  }

  // ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  ctx.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  ctx.set('Access-Control-Allow-Credentials', true);
  yield next();
}));

api.use(Compress({
    flush: require('zlib').Z_SYNC_FLUSH
}));

// const config = require('./config/');
const errorMiddleware = require('./middleware/errors');
api.use(errorMiddleware());

const router = require('./routes/')(api);
// router(api);

api.use(logger);


// api
//   .use(router.routes())
//   .use(router.allowedMethods());

module.exports = api;
