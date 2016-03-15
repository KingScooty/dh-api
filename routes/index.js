const glob = require('glob');

/*
 * Loop through **\/*.js in routes, require them in,
 * and setup koa routes on them.
 */

exports = module.exports = function Controllers(api) {
  glob(`${__dirname}/**/*.js`, { ignore: `${__dirname}/index.js` }, (err, matches) => {
    if (err) { throw err; }

    matches.forEach((file) => {
      // console.log(file);
      const controller = require(file);
      api
        .use(controller.routes())
        .use(controller.allowedMethods());
    });
  });
};
