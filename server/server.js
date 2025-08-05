const express = require('express');
const path = require('path');
const pool = require('./db');
const bcrypt = require('bcrypt');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// Login API
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (result.rows.length === 0) {
      return res.status(401).send("Invalid username");
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).send("Invalid password");
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error");
  }
});

// Save password profile
app.post('/api/save', async (req, res) => {
  const { url, username, password } = req.body;
  try {
    await pool.query('INSERT INTO profiles (url, username, password) VALUES ($1, $2, $3)', [url, username, password]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

// Get profiles
app.get('/api/profiles', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM profiles ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Error loading profiles");
  }
});

// Delete profile
app.delete('/api/delete/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM profiles WHERE id = $1', [req.params.id]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send("Error deleting profile");
  }
});

// Edit profile
app.put('/api/edit/:id', async (req, res) => {
  const { url, username, password } = req.body;
  try {
    await pool.query(
      'UPDATE profiles SET url = $1, username = $2, password = $3 WHERE id = $4',
      [url, username, password, req.params.id]
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send("Error editing profile");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));