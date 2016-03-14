'use strict';
const Promise = require('bluebird');
const co = Promise.coroutine;
const cluster = require('cluster');

// middleware

const Koa = require('koa');
const app = module.exports = new Koa();

const router = require('./routes/index');

app
  .use(router.routes());
  .use(router.allowedMethods());
