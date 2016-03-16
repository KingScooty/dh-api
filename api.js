'use strict';
// const Promise = require('bluebird');
// const co = Promise.coroutine;
const Morgan = require('koa-morgan');

// middleware

const Koa = require('koa');
const api = new Koa();

const logger = Morgan('combined');

const config = require('./config/');
const errorMiddleware = require('./middleware/errors');
api.use(errorMiddleware());

const router = require('./routes/');
router(api);

api.use(logger);

// api
//   .use(router.routes())
//   .use(router.allowedMethods());

module.exports = api;
