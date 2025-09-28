const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || '192.168.100.54', // nama service docker
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'posgres',
  database: process.env.DB_NAME || 'postgres',
  max: 10,
  idleTimeoutMillis: 30000
});

// Tes koneksi saat startup
pool.connect()
  .then(client => {
    console.log(`✅ Connected to PostgreSQL at ${process.env.DB_HOST || '192.168.100.54'}:${process.env.DB_PORT || 5432}`);
    client.release();
  })
  .catch(err => {
    console.error('❌ PostgreSQL connection failed:', err.message);
  });

module.exports = pool;
