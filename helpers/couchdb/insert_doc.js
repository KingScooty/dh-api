const config = require('../../config/');
const host =  config.database.host;

var nano = require('nano')(`http://${host}`);

/**
 * Inserts a doc into a database. If the database doesn't exist, create
 * the database, and then save the doc.
 *
 * insert_doc({nano: true}, 'database_name' , 0);
 *
 * @param {Object} doc - document
 * @param {String} db_name - database key
 * @param {Integer} tried
 * @param {Function} callback
 */


function insert_doc(doc, db_name, tried) {
  var db = nano.use(db_name);
  db.insert(doc,
    function (error,http_body,http_headers) {
      if(error) {
        if(error.message === 'no_db_file'  && tried < 1) {
          // create database and retry
          return nano.db.create(db_name, function () {
            insert_doc(doc, tried + 1);
          });
        }
        else { return console.log(error); }
      }
      console.log(http_body);
  });
}

module.exports = insert_doc;
