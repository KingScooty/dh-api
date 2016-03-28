/**
 * Attempts to saves a doc to a database. If the doc exists, update the _rev
 * count and then save to the database.
 *
 * @param {Object} doc - document
 * @param {String} key - existing doc key
 * @param {String} db - database
 * @param {Function} callback
 */

const update_doc = function update_doc (doc, key, db, callback) {
  db.get(key, function (error, existing) {
    if(!error) doc._rev = existing._rev;
    db.insert(doc, key, callback);
  });
}

module.exports = update_doc;
