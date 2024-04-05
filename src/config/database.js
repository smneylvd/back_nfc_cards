const {Client} = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const db = new Client({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: `${process.env.DB_PASSWORD}`,
});

module.exports = db;