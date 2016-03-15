const Promise = require('bluebird');
const co = Promise.coroutine;

// app.use(function *(next) {
//   try {
//     yield next;
//   } catch (err) {
//     this.status = err.status || 500;
//     this.body = err.message;
//     this.app.emit('error', err, this);
//   }
// });


module.exports = function errorMiddleware() {
  // app.use( (ctx, next) => {
  return co(function *(ctx, next) {
    try {
      yield next();
    } catch (err) {
      if (err === null) {
        err = new Error('Null or undefined error');
      }
      // some errors will have .status
      // however this is not a guarantee
      this.status = err.status || 500;
      this.type = 'application/json';
      this.body = JSON.stringify({
        success: false,
        message: err.stack,
      });

      // since we handled this manually we'll
      // want to delegate to the regular app
      // level error handling as well so that
      // centralized still functions correctly.
      ctx.app.emit('error', err, ctx);
    }
  }); //();
  // });
};
