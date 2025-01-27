const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Datenpfad
const DATA_PATH = path.join(__dirname, 'data');
const SUBJECTS_FILE = path.join(DATA_PATH, 'subjects.json');
const POSTS_FILE = path.join(DATA_PATH, 'posts.json');

// Stelle sicher, dass der Datenordner existiert
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_PATH, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

// Lade oder erstelle die Datendateien
async function loadData(filePath, defaultData = []) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    await fs.writeFile(filePath, JSON.stringify(defaultData));
    return defaultData;
  }
}

// Speichere Daten
async function saveData(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Initialisiere die Daten
let subjects = [];
let posts = [];

// Endpoints

// GET /subjects - Hole alle Fächer mit ihren Posts
app.get('/subjects', async (req, res) => {
  try {
    const subjects = await loadData(SUBJECTS_FILE, [
      { id: 1, name: 'Anwendungsentwicklung' },
      { id: 2, name: 'Datenbanken' }
    ]);
    const posts = await loadData(POSTS_FILE, []);

    // Füge Posts zu den entsprechenden Fächern hinzu
    const subjectsWithPosts = subjects.map(subject => ({
      ...subject,
      posts: posts.filter(post => post.subjectId === subject.id)
    }));

    res.json(subjectsWithPosts);
  } catch (error) {
    console.error('Error loading subjects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /subjects/:id/posts - Erstelle einen neuen Post
app.post('/subjects/:id/posts', async (req, res) => {
  try {
    const subjectId = parseInt(req.params.id);
    const { title, content, date } = req.body;

    const subjects = await loadData(SUBJECTS_FILE);
    const posts = await loadData(POSTS_FILE);

    // Prüfe, ob das Fach existiert
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    // Erstelle neuen Post
    const newPost = {
      id: Date.now(),
      subjectId,
      title,
      content,
      date,
      createdAt: new Date().toISOString()
    };

    posts.push(newPost);
    await saveData(POSTS_FILE, posts);

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Server starten
async function startServer() {
  await ensureDataDir();
  subjects = await loadData(SUBJECTS_FILE, [
    { id: 1, name: 'Anwendungsentwicklung' },
    { id: 2, name: 'Datenbanken' }
  ]);
  posts = await loadData(POSTS_FILE, []);

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

startServer();
