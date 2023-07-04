const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env')})
// const dotenv = require('dotenv')
const Schema = mongoose.Schema
// dotenv.config();

const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGODB_URL
const db = mongoose.connect(uri)
const connection = mongoose.connection;

connection.once("open", function() {
  console.log("MongoDB database connection established successfully");
});

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: {version: '1'} });


module.exports = client

