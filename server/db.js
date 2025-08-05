const { Pool } = require("pg");
const bcrypt = require("bcrypt");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Retry logic until DB is ready
const init = async () => {
  let connected = false;
  let retries = 10;

  while (!connected && retries > 0) {
    try {
      await pool.query("SELECT 1");
      connected = true;
      console.log("✅ Connected to PostgreSQL");
    } catch (err) {
      console.log("⏳ Waiting for DB...", retries);
      retries--;
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  if (!connected) {
    console.error("❌ Could not connect to DB after retries");
    process.exit(1);
  }

  // Create tables
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS profiles (
      id SERIAL PRIMARY KEY,
      url TEXT NOT NULL,
      username TEXT NOT NULL,
      password TEXT NOT NULL
    );
  `);

  // Insert default admin
  const result = await pool.query("SELECT * FROM users WHERE username = $1", ['admin']);
  if (result.rows.length === 0) {
    const hash = await bcrypt.hash("admin", 10);
    await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", ['admin', hash]);
    console.log("✅ Default admin user created: admin / admin");
  } else {
    console.log("ℹ️ Admin user already exists");
  }
};

init();

module.exports = pool;