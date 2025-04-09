const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Init DB
const db = new sqlite3.Database('incidents.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS incidents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT,
    priority TEXT,
    status TEXT DEFAULT 'open',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    closedAt DATETIME
  )`);
});

// Routes
app.get('/status', (req, res) => res.send({ status: 'API is running' }));

app.post('/incidents', (req, res) => {
  const { message, priority } = req.body;
  db.run(
    `INSERT INTO incidents (message, priority) VALUES (?, ?)`,
    [message, priority],
    function (err) {
      if (err) return res.status(500).send(err);
      res.send({ id: this.lastID });
    }
  );
});

app.get('/incidents', (req, res) => {
  db.all(`SELECT * FROM incidents`, [], (err, rows) => {
    if (err) return res.status(500).send(err);
    res.send(rows);
  });
});

app.put('/incidents/:id/close', (req, res) => {
  db.run(
    `UPDATE incidents SET status = 'closed', closedAt = CURRENT_TIMESTAMP WHERE id = ?`,
    [req.params.id],
    function (err) {
      if (err) return res.status(500).send(err);
      res.send({ message: 'Incident closed' });
    }
  );
});

// Écoute sur toutes les interfaces réseau
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ API is running at http://0.0.0.0:${port}`);
});
