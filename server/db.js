const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'db.sqlite');
const db = new sqlite3.Database(dbPath);

function init() {
  const createUsers = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      username TEXT,
      first_name TEXT,
      last_name TEXT,
      role TEXT DEFAULT 'user',
      age INTEGER,
      gender TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.run(createUsers);
}

module.exports = { db, init };
