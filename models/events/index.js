var db = require('../../db');

views = {
  all: 'tweets/all_tweets'
}

//
//
// var db = req.db['dh_' + req.params.year];
//
// try {
//   db.view('tweets/all_tweets', function callback(err, response) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.json(response);
//     }
//   });
// } catch (exeception) {
//   res.send(404);
// }
