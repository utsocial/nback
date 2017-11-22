module.exports = {

  logging: process.env.LOGGING || false, // enable in staging app
  seed: process.env.SEED || false, // enable in staging app

  db: {
    url: process.env.MONGODB_URI,
  },
}
