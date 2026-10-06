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

/ Automatic Table Initialization Query
const initDatabaseStructure = async () => {
  const createTablesQuery = `
    CREATE TABLE IF NOT EXISTS students(
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      phone VARCHAR(20) NOT NULL,
      course VARCHAR(100) NOT NULL,
      status VARCHAR(20) DEFAULT 'Pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  try {
    const client = await pool.connect();
    
    console.log("Checking and initializing database tables...");
    await client.query(createTablesQuery);
    console.log("Database tables verified and ready! ");
    client.release();
  } 
  catch (err) {
    console.error("Database structural initialization failed:", err.message);
  }
};

// Run the initialization immediately when this file is required by server.js
initDatabaseStructure();



// Export the query function globally. This allows other files (like server.js) to securely run SQL statements using this connection pool.
module.exports = {
  query: (text, params) => pool.query(text, params),
};
