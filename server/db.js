// PostgreSQL connection pool.
// All credentials come from environment variables (set locally in .env,
// and in Render's dashboard for production) — never hardcode secrets here.
// Import the Pool class from the 'pg' (node-postgres) library to manage database connections. Using a connection pool is more efficient than opening a new connection for every single query.
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false // This line forces SSL and fixes the connection error
  }
});

// Here we are connecting the database 
pool.connect((err, client, release) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to PostgreSQL database.');
  release();
});

// Export the query function globally. This allows other files (like server.js) to securely run SQL statements using this connection pool.
module.exports = {
  query: (text, params) => pool.query(text, params),
};
