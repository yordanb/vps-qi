/*
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_qiagent',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
*/

const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'postgres', // nama service docker
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'secret',
  database: process.env.DB_NAME || 'db_qiagent',
  max: 10,
  idleTimeoutMillis: 30000
});

module.exports = pool;
