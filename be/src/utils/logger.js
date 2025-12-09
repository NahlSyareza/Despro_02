const winston = require('winston');
const path = require('path');

// Format log kustom
const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logger = winston.createLogger({
  level: 'info', // Level minimal yang dicatat (info, warn, error)
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    // 1. Simpan Error ke file khusus
    new winston.transports.File({ 
        filename: path.join(__dirname, '../../logs/error.log'), 
        level: 'error' 
    }),
    // 2. Simpan Semua Log (Info & Error) ke file combined
    new winston.transports.File({ 
        filename: path.join(__dirname, '../../logs/combined.log') 
    }),
  ],
});

// Jika tidak dalam mode Production, tampilkan juga di Terminal (berwarna)
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}

// Buat stream untuk Morgan (HTTP Logger) agar menggunakan Winston
logger.stream = {
  write: function(message) {
    logger.info(message.trim());
  },
};

module.exports = logger;