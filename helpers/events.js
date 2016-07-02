const databaseList = require('../db').databaseList;
const years = Object.keys(databaseList);

module.exports.getRandomYear = function getRandomYear(array) {
  return array[Math.floor(Math.random()*array.length)];
}

module.exports.removeNamespaceFromYear = function removeNamespaceFromYear(string) {
  return string.split('_').pop();
}
