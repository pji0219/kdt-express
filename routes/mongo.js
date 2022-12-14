// @ts-check

const { MongoClient, ServerApiVersion } = require('mongodb');
// const dotenv = require('dotenv');

// dotenv.config();
require('dotenv').config();

const uri = process.env.DB_LOCAL;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

module.exports = client;
