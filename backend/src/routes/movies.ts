import { Router } from 'express';
import { openDb } from '../db';

const router = Router();

// GET /api/movies — list all movies
router.get('/', async (_req, res) => {
  const db = await openDb();
  try {
    const movies = await db.all('SELECT * FROM movies ORDER BY createdAt DESC');
    res.json(movies);
  } finally {
    await db.close();
  }
});

// POST /api/movies — create a movie
router.post('/', async (req, res) => {
  const { title, director, year, rating, watched, notes } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const db = await openDb();
  try {
    const result = await db.run(
      'INSERT INTO movies (title, director, year, rating, watched, notes) VALUES (?, ?, ?, ?, ?, ?)',
      title,
      director || null,
      year || null,
      rating || null,
      watched ? 1 : 0,
      notes || null
    );
    const movie = await db.get('SELECT * FROM movies WHERE id = ?', result.lastID);
    res.status(201).json(movie);
  } finally {
    await db.close();
  }
});

// PUT /api/movies/:id — update a movie
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { title, director, year, rating, watched, notes } = req.body;

  const db = await openDb();
  try {
    const existing = await db.get('SELECT * FROM movies WHERE id = ?', id);
    if (!existing) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    await db.run(
      'UPDATE movies SET title = ?, director = ?, year = ?, rating = ?, watched = ?, notes = ? WHERE id = ?',
      title ?? existing.title,
      director !== undefined ? director : existing.director,
      year !== undefined ? year : existing.year,
      rating !== undefined ? rating : existing.rating,
      watched !== undefined ? (watched ? 1 : 0) : existing.watched,
      notes !== undefined ? notes : existing.notes,
      id
    );

    const movie = await db.get('SELECT * FROM movies WHERE id = ?', id);
    res.json(movie);
  } finally {
    await db.close();
  }
});

// DELETE /api/movies/:id — delete a movie
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);

  const db = await openDb();
  try {
    const existing = await db.get('SELECT * FROM movies WHERE id = ?', id);
    if (!existing) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    await db.run('DELETE FROM movies WHERE id = ?', id);
    res.status(204).send();
  } finally {
    await db.close();
  }
});

export default router;
