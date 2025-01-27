import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Multer Konfiguration für Bildupload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Nur Bilder sind erlaubt!'));
  }
});

// Temporäre Subjects-Daten
const subjects = [
  { 
    id: 1, 
    title: 'JavaScript', 
    description: 'Moderne JavaScript-Programmierung',
    slug: 'javascript',
    posts: []
  },
  { 
    id: 2, 
    title: 'React', 
    description: 'Frontend-Entwicklung mit React',
    slug: 'react',
    posts: []
  },
  { 
    id: 3, 
    title: 'Node.js', 
    description: 'Backend-Entwicklung mit Node.js',
    slug: 'nodejs',
    posts: []
  },
];

// GET /subjects - Alle Subjects abrufen
router.get('/', protect, (req, res) => {
  res.json(subjects);
});

// POST /subjects - Neues Subject erstellen
router.post('/', protect, (req, res) => {
  const { title, description } = req.body;
  const slug = title.toLowerCase().replace(/\s+/g, '-');
  const newSubject = {
    id: subjects.length + 1,
    title,
    description,
    slug,
    posts: []
  };
  subjects.push(newSubject);
  res.status(201).json(newSubject);
});

// GET /subjects/:subjectId/posts - Posts eines Subjects abrufen
router.get('/:subjectId/posts', protect, (req, res) => {
  const subject = subjects.find(s => s.id === parseInt(req.params.subjectId));
  if (!subject) {
    return res.status(404).json({ message: 'Subject nicht gefunden' });
  }
  res.json(subject.posts);
});

// POST /subjects/:subjectId/posts - Neuen Post erstellen
router.post('/:subjectId/posts', protect, (req, res) => {
  console.log('Creating post for subject:', req.params.subjectId);
  console.log('Post data:', req.body);

  const subject = subjects.find(s => s.id === parseInt(req.params.subjectId));
  if (!subject) {
    console.log('Subject not found');
    return res.status(404).json({ message: 'Subject nicht gefunden' });
  }

  const { title, content, date } = req.body;
  const newPost = {
    id: Date.now(),
    title,
    content,
    date,
    subjectId: subject.id
  };

  if (!subject.posts) {
    subject.posts = [];
  }
  subject.posts.push(newPost);
  
  console.log('Post created:', newPost);
  res.status(201).json(newPost);
});

// PUT /subjects/:subjectId/posts/:postId - Post bearbeiten
router.put('/:subjectId/posts/:postId', protect, (req, res) => {
  const subject = subjects.find(s => s.id === parseInt(req.params.subjectId));
  if (!subject) {
    return res.status(404).json({ message: 'Subject nicht gefunden' });
  }

  const postIndex = subject.posts.findIndex(p => p.id === parseInt(req.params.postId));
  if (postIndex === -1) {
    return res.status(404).json({ message: 'Post nicht gefunden' });
  }

  const { title, content, date } = req.body;
  const updatedPost = {
    ...subject.posts[postIndex],
    title: title || subject.posts[postIndex].title,
    content: content || subject.posts[postIndex].content,
    date: date || subject.posts[postIndex].date,
  };

  subject.posts[postIndex] = updatedPost;
  res.json(updatedPost);
});

// DELETE /subjects/:subjectId/posts/:postId - Post löschen
router.delete('/:subjectId/posts/:postId', protect, (req, res) => {
  const subject = subjects.find(s => s.id === parseInt(req.params.subjectId));
  if (!subject) {
    return res.status(404).json({ message: 'Subject nicht gefunden' });
  }

  const postIndex = subject.posts.findIndex(p => p.id === parseInt(req.params.postId));
  if (postIndex === -1) {
    return res.status(404).json({ message: 'Post nicht gefunden' });
  }

  subject.posts.splice(postIndex, 1);
  res.json({ message: 'Post erfolgreich gelöscht' });
});

// POST /subjects/:subjectId/posts/:postId/image - Bild zu Post hinzufügen
router.post('/:subjectId/posts/:postId/image', protect, upload.single('image'), (req, res) => {
  const subject = subjects.find(s => s.id === parseInt(req.params.subjectId));
  if (!subject) {
    return res.status(404).json({ message: 'Subject nicht gefunden' });
  }

  const post = subject.posts.find(p => p.id === parseInt(req.params.postId));
  if (!post) {
    return res.status(404).json({ message: 'Post nicht gefunden' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'Kein Bild hochgeladen' });
  }

  post.imageUrl = `/uploads/${req.file.filename}`;
  res.json(post);
});

// PUT /subjects/:subjectId - Subject aktualisieren
router.put('/:subjectId', protect, (req, res) => {
  const subject = subjects.find(s => s.id === parseInt(req.params.subjectId));
  if (!subject) {
    return res.status(404).json({ message: 'Subject nicht gefunden' });
  }

  const { title, description } = req.body;
  const updatedSubject = {
    ...subject,
    title: title || subject.title,
    description: description || subject.description,
    slug: (title || subject.title).toLowerCase().replace(/\s+/g, '-')
  };

  const index = subjects.findIndex(s => s.id === parseInt(req.params.subjectId));
  subjects[index] = updatedSubject;
  res.json(updatedSubject);
});

// DELETE /subjects/:subjectId - Subject löschen
router.delete('/:subjectId', protect, (req, res) => {
  const index = subjects.findIndex(s => s.id === parseInt(req.params.subjectId));
  if (index === -1) {
    return res.status(404).json({ message: 'Subject nicht gefunden' });
  }

  // Lösche das Subject aus dem Array
  subjects.splice(index, 1);
  res.json({ message: 'Subject erfolgreich gelöscht' });
});

export default router; 