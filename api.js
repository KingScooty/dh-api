'use strict';
// const Promise = require('bluebird');
// const co = Promise.coroutine;
const Compress = require('koa-compress');
const Morgan = require('koa-morgan');

// middleware

const Koa = require('koa');
const api = new Koa();

const logger = Morgan('combined');

api.use(Compress({
    flush: require('zlib').Z_SYNC_FLUSH
}));

const config = require('./config/');
const errorMiddleware = require('./middleware/errors');
api.use(errorMiddleware());

const router = require('./routes/')(api);
// router(api);

api.use(logger);

// api
//   .use(router.routes())
//   .use(router.allowedMethods());

module.exports = api;
