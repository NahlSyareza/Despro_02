require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT || 5432,
  
  // Konfigurasi NeonDB
  ssl: {
    rejectUnauthorized: false,
  },
  
  // Stabilitas Koneksi
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Pastikan timeout cukup panjang (10s)
});

// Log error jika koneksi idle putus
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
});

/**
 * Fungsi Query dengan Retry Mechanism
 * @param {string} text - SQL Query
 * @param {Array} params - Parameter Query
 * @param {number} retries - Jumlah maksimal percobaan (default: 3)
 * @param {number} delay - Waktu tunggu awal dalam ms (default: 1000ms)
 */
const queryWithRetry = async (text, params, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      // Coba jalankan query
      return await pool.query(text, params);
    } catch (err) {
      // Jika ini adalah percobaan terakhir, lempar error ke controller
      if (i === retries - 1) throw err;

      // Log peringatan bahwa query gagal dan akan dicoba lagi
      console.warn(`[Database] Query failed (Attempt ${i + 1}/${retries}). Retrying in ${delay}ms... Error: ${err.message}`);
      
      // Tunggu sejenak sebelum mencoba lagi (Backoff)
      await new Promise(res => setTimeout(res, delay));
      
      // Perpanjang waktu tunggu untuk percobaan berikutnya (Exponential Backoff)
      // Contoh: 1s -> 2s -> 4s
      delay = delay * 2; 
    }
  }
};

module.exports = {
  query: queryWithRetry,
};