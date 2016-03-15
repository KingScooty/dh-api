'use strict';
const Promise = require('bluebird');
const co = Promise.coroutine;
// const cluster = require('cluster');
const Morgan = require('koa-morgan');

// middleware

const Koa = require('koa');
const api = module.exports = new Koa();

const logger = Morgan('combined');
const router = require('./routes/index');

api.use(logger);

api
  .use(router.routes())
  .use(router.allowedMethods());
