const Promise = require('bluebird');
const co = Promise.coroutine;
const http = require('http');

module.exports = function errorMiddleware() {
  return co(function *(ctx, next) {

    // env
    const env = process.env.NODE_ENV || 'development';

    try {
      yield next();
      if (ctx.response.status /*&& !ctx.response.body*/ === 404) ctx.throw(404);
    } catch (err) {

      // some errors will have .status
      // however this is not a guarantee
      ctx.status = err.status || 500;

      if (err === null) {
        err = new Error('Null or undefined error');
      }

      ctx.type = 'application/json';
      if (env === 'development') ctx.body = { error: err.message }
      else if (err.expose) this.body = { error: err.message }
      else this.body = { error: http.STATUS_CODES[ctx.status]}

      // ctx.body = JSON.stringify({
      //   success: false,
      //   message: err.stack,
      // });

      // since we handled this manually we'll
      // want to delegate to the regular app
      // level error handling as well so that
      // centralized still functions correctly.
      ctx.app.emit('error', err, ctx);
    }
  });
};
