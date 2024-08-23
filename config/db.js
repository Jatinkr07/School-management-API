const mysql = require("mysql2");
require("dotenv").config(); // Load environment variables from .env file

// Check for missing environment variables and throw an error
if (
  !process.env.DB_HOST ||
  !process.env.DB_USER ||
  !process.env.DB_PASSWORD ||
  !process.env.DB_NAME
) {
  throw new Error(
    "Missing one or more required environment variables (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)."
  );
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 20, // Default to 20 if not provided
  queueLimit: 0,
});

module.exports = pool.promise();
