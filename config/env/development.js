module.exports = {
  database: {
    host: '127.0.0.1',
    // auth: {
    //   username: '', //admin
    //   password: '' //BCRmhDz4hT7g
    // }
  },
  twitter: {
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
  }
}
