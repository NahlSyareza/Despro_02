require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT || 5432, // Mengambil port dari .env atau default 5432
  
  // Konfigurasi Wajib NeonDB
  ssl: {
    rejectUnauthorized: false,
  },
  
  // Konfigurasi Stabilitas Koneksi
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Error handling agar server tidak crash saat koneksi idle putus
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};