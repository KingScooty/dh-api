'use strict';
// const Promise = require('bluebird');
// const co = Promise.coroutine;
const Morgan = require('koa-morgan');

// middleware

const Koa = require('koa');
const api = new Koa();

const logger = Morgan('combined');

const errorMiddleware = require('./middleware/errors');
api.use(errorMiddleware());

const router = require('./routes/index');
router(api);

api.use(logger);

// api
//   .use(router.routes())
//   .use(router.allowedMethods());

module.exports = api;
