const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// File paths
const dbFilePath = path.join(__dirname, 'db', 'db.json');
const indexFilePath = path.join(__dirname, 'public', 'index.html');


// Read notes from db.json
const readNotes = async () => {
  try {
    const data = await fs.readFile(dbFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Write notes to db.json
const writeNotes = async (notes) => {
  await fs.writeFile(dbFilePath, JSON.stringify(notes, null, 2));
};

// Routes
app.get('/', (req, res) => {
  res.sendFile(indexFilePath);
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});


app.get('/api/notes', async (req, res) => {
  const notes = await readNotes();
  res.json(notes);
});

app.post('/api/notes', async (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4();

  const notes = await readNotes();
  notes.push(newNote);

  await writeNotes(notes);

  res.json(newNote);
});

app.delete('/api/notes/:id', async (req, res) => {
  const noteId = req.params.id;

  const notes = await readNotes();
  const updatedNotes = notes.filter((note) => note.id !== noteId);

  await writeNotes(updatedNotes);

  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
