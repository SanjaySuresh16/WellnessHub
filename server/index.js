const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db, init } = require('./db');

const SECRET = 'replace_this_with_a_strong_secret';
const PORT = process.env.PORT || 3000;

init();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.json({ ok: true }));

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, username, first_name, last_name, role, age, gender } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const hashed = await bcrypt.hash(password, 10);

    const stmt = db.prepare(`INSERT INTO users (email, password, username, first_name, last_name, role, age, gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
    stmt.run(email, hashed, username || null, first_name || null, last_name || null, role || 'user', age || null, gender || null, function (err) {
      if (err) {
        if (err.message && err.message.includes('UNIQUE')) {
          return res.status(409).json({ message: 'Email already registered' });
        }
        return res.status(500).json({ message: 'DB error', error: err.message });
      }

      const user = { id: this.lastID, email, username: username || null, role: role || 'user' };
      const token = jwt.sign(user, SECRET, { expiresIn: '7d' });
      res.json({ token, user });
    });
    stmt.finalize();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  db.get('SELECT id, email, password, username, role FROM users WHERE email = ?', [email], async (err, row) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err.message });
    if (!row) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, row.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const user = { id: row.id, email: row.email, username: row.username, role: row.role };
    const token = jwt.sign(user, SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  });
});

app.listen(PORT, () => {
  console.log(`WellnessHub auth server running on http://localhost:${PORT}`);
});
