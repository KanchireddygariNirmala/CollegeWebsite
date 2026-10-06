// PostgreSQL connection pool.
// All credentials come from environment variables (set locally in .env,
// and in Render's dashboard for production) — never hardcode secrets here.
// Import the Pool class from the 'pg' (node-postgres) library to manage database connections. Using a connection pool is more efficient than opening a new connection for every single query.
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// 1. SET UP DATABASE CONNECTION
// This uses your Render Environment tab values to open the connection securely
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false // Required for secure cloud platforms like Render
  }
});

// 2. AUTOMATICALLY RUN SCHEMA.SQL ON STARTUP
const runDatabaseSchema = async () => {
  try {
    // Locate the schema.sql file in your server folder
    const schemaPath = path.resolve(__dirname, 'schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      console.error(` Could not find schema.sql at path: ${schemaPath}`);
      return;
    }

    // Read your CREATE TABLE IF NOT EXISTS students script
    const sqlSchema = fs.readFileSync(schemaPath, 'utf8');

    // Establish the connection channel
    const client = await pool.connect();
    console.log("Step 1: Connected to database successfully! Establishing tables...");
    
    // Execute your table creation query
    await client.query(sqlSchema);
    console.log("Step 2: Database tables verified and ready from schema.sql! 🎉");
    
    // Release the temporary connection channel back to the general pool
    client.release();
  } catch (err) {
    console.error(" Database setup failed at startup:", err.message);
  }
};

// Execute the connection and creation sequence immediately when the backend boots up
runDatabaseSchema();

module.exports = pool;
