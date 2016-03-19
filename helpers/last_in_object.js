module.exports = function lastInObject(object) {
  return object[Object.keys(object)[Object.keys(object).length - 1]];
}
