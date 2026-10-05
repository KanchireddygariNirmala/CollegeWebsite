-- Run this once against your Postgres database (local or Render) to create the table.
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  course VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
