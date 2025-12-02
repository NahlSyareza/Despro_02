require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: 5432,
});

console.log("Connected to DB:", {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  db: process.env.PGDATABASE,
});


module.exports = {
  query: (text, params) => pool.query(text, params),
};
