const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";
const dbName = "incidentdb";

let db, incidents;

MongoClient.connect(mongoUrl, { useUnifiedTopology: true })
  .then(client => {
    db = client.db(dbName);
    incidents = db.collection('incidents');
    app.listen(port, () => console.log(`API running on port ${port}`));
  })
  .catch(err => console.error(err));

app.get('/status', (req, res) => res.send({ status: 'API is running' }));

app.post('/incidents', async (req, res) => {
  const { message, priority } = req.body;
  const result = await incidents.insertOne({ message, priority, status: 'open', createdAt: new Date() });
  res.send(result);
});

app.get('/incidents', async (req, res) => {
  const result = await incidents.find().toArray();
  res.send(result);
});

app.put('/incidents/:id/close', async (req, res) => {
  const { id } = req.params;
  await incidents.updateOne({ _id: new ObjectId(id) }, { $set: { status: 'closed', closedAt: new Date() } });
  res.send({ message: 'Incident closed' });
});
