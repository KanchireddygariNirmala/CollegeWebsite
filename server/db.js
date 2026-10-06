// PostgreSQL connection pool.
// All credentials come from environment variables (set locally in .env,
// and in Render's dashboard for production) — never hardcode secrets here.
// Import the Pool class from the 'pg' (node-postgres) library to manage database connections. Using a connection pool is more efficient than opening a new connection for every single query.
const { Pool } = require('pg');
require('dotenv').config();

// Connect to the database using your Render dashboard variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false // Required for safe cloud hosting environments like Render
  }
});

const forceFreshTableSetup = async () => {
  try {
    const client = await pool.connect();
    console.log("🔄 Resetting database table layout...");

    // 1. Wipe out any old, broken student table structure safely
    await client.query(`DROP TABLE IF EXISTS students CASCADE;`);

    // 2. Create the table including all standard client field mapping options
    await client.query(`
      CREATE TABLE students (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        age INTEGER NOT NULL,
        phone VARCHAR(20),
        phone_number VARCHAR(20),
        "phoneNumber" VARCHAR(20),
        course VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    console.log("Fresh 'students' table successfully created with all alternative fields! 🎉");
    client.release();
  } catch (err) {
    console.error(" Database table initialization failed:", err.message);
  }
};

// Run immediately when the server boots up
forceFreshTableSetup();

module.exports = pool;
