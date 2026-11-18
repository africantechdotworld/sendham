import { Router } from 'express';
import { openDb } from '../db';

const router = Router();

// GET /movies — list all movies
router.get('/', async (req, res) => {
  const db = await openDb();
  const movies = await db.all('SELECT * FROM movies ORDER BY createdAt DESC');
  await db.close();
  res.json(movies);
});

// POST /movies — add a movie
router.post('/', async (req, res) => {
  const { title, director, year, rating, watched, notes } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const db = await openDb();
  const result = await db.run(
    'INSERT INTO movies (title, director, year, rating, watched, notes) VALUES (?, ?, ?, ?, ?, ?)',
    [title, director ?? null, year ?? null, rating ?? null, watched ? 1 : 0, notes ?? null]
  );
  const movie = await db.get('SELECT * FROM movies WHERE id = ?', [result.lastID]);
  await db.close();
  res.status(201).json(movie);
});

// PUT /movies/:id — update a movie
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, director, year, rating, watched, notes } = req.body;
  const db = await openDb();
  const existing = await db.get('SELECT * FROM movies WHERE id = ?', [id]);
  if (!existing) {
    await db.close();
    return res.status(404).json({ error: 'Movie not found' });
  }
  await db.run(
    'UPDATE movies SET title = ?, director = ?, year = ?, rating = ?, watched = ?, notes = ? WHERE id = ?',
    [title ?? existing.title, director ?? existing.director, year ?? existing.year, rating ?? existing.rating, watched ?? existing.watched, notes ?? existing.notes, id]
  );
  const movie = await db.get('SELECT * FROM movies WHERE id = ?', [id]);
  await db.close();
  res.json(movie);
});

// DELETE /movies/:id — remove a movie
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const db = await openDb();
  const existing = await db.get('SELECT * FROM movies WHERE id = ?', [id]);
  if (!existing) {
    await db.close();
    return res.status(404).json({ error: 'Movie not found' });
  }
  await db.run('DELETE FROM movies WHERE id = ?', [id]);
  await db.close();
  res.status(204).send();
});

export default router;
