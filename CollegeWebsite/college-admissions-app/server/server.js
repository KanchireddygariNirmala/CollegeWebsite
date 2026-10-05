// Express API server for student admissions.
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

// Comma-separated list of allowed frontend origins (set in .env / Render dashboard).
// Example: ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend.onrender.com
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim());

// Enable CORS (Cross-Origin Resource Sharing) to allow your frontend running on port 3000 to securely send requests to this server on port 5000.
app.use(cors({ origin: allowedOrigins }));

// Enable JSON parsing to automatically translate incoming JSON text data from your React application into a standard JavaScript object (req.body).
app.use(express.json());

// Simple health check so Render (and you) can verify the service is up. and  HTTP POST route to receive and process new student registrations
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Create a new student application.
app.post('/api/students', async (req, res) => {
  try {
    const { name, email, age, phone_number, course } = req.body;

    if (!name || !email || !age || !phone_number || !course) {
      return res.status(400).json({ success: false, message: 'All student fields are required.' });
    }

    const insertQuery = `
      INSERT INTO students (name, email, age, phone_number, course)
      VALUES ($1, $2, $3, $4, $5);
    `;
    await db.query(insertQuery, [name, email, age, phone_number, course]);

    res.status(201).json({ success: true, message: 'Student application saved.' });
  } catch (error) {
    console.error('Error saving student:', error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Fetch all student applications, newest first.
app.get('/api/students', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM students ORDER BY id DESC;');
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching students:', error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Render provides PORT at runtime; fall back to 5000 for local development.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
