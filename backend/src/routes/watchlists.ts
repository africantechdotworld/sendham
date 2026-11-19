import { Router } from 'express';
import { openDb } from '../db';

const router = Router();

// GET /api/watchlists — list all watchlists
router.get('/', async (_req, res) => {
  const db = await openDb();
  try {
    const watchlists = await db.all(`
      SELECT w.id, w.name, COUNT(wi.movie_id) AS movie_count
      FROM watchlists w
      LEFT JOIN watchlist_items wi ON wi.watchlist_id = w.id
      GROUP BY w.id, w.name
      ORDER BY w.createdAt DESC
    `);
    res.json(watchlists);
  } finally {
    await db.close();
  }
});

// POST /api/watchlists — create a watchlist
router.post('/', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const db = await openDb();
  try {
    const result = await db.run('INSERT INTO watchlists (name) VALUES (?)', name);
    const watchlist = await db.get('SELECT id, name FROM watchlists WHERE id = ?', result.lastID);
    res.status(201).json(watchlist);
  } finally {
    await db.close();
  }
});

// DELETE /api/watchlists/:id — delete a watchlist
router.delete('/:id', async (req, res) => {
  const watchlistId = Number(req.params.id);
  const db = await openDb();
  try {
    const existing = await db.get('SELECT * FROM watchlists WHERE id = ?', watchlistId);
    if (!existing) {
      return res.status(404).json({ error: 'Watchlist not found' });
    }
    await db.run('DELETE FROM watchlist_items WHERE watchlist_id = ?', watchlistId);
    await db.run('DELETE FROM watchlists WHERE id = ?', watchlistId);
    res.status(204).send();
  } finally {
    await db.close();
  }
});

// GET /api/watchlists/:id/movies — list movies in a watchlist
router.get('/:id/movies', async (req, res) => {
  const watchlistId = Number(req.params.id);
  const db = await openDb();
  try {
    const movies = await db.all(`
      SELECT m.* FROM movies m
      JOIN watchlist_items wi ON wi.movie_id = m.id
      WHERE wi.watchlist_id = ?
      ORDER BY m.createdAt DESC
    `, watchlistId);
    res.json(movies);
  } finally {
    await db.close();
  }
});

// POST /api/watchlists/:id/movies/:movieId — add a movie to a watchlist
router.post('/:id/movies/:movieId', async (req, res) => {
  const watchlistId = Number(req.params.id);
  const movieId = Number(req.params.movieId);
  const db = await openDb();
  try {
    const watchlist = await db.get('SELECT * FROM watchlists WHERE id = ?', watchlistId);
    if (!watchlist) {
      return res.status(404).json({ error: 'Watchlist not found' });
    }
    const movie = await db.get('SELECT * FROM movies WHERE id = ?', movieId);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    await db.run(
      'INSERT OR IGNORE INTO watchlist_items (watchlist_id, movie_id) VALUES (?, ?)',
      watchlistId,
      movieId
    );
    res.status(201).json({ added: true });
  } finally {
    await db.close();
  }
});

// DELETE /api/watchlists/:id/movies/:movieId — remove a movie from a watchlist
router.delete('/:id/movies/:movieId', async (req, res) => {
  const watchlistId = Number(req.params.id);
  const movieId = Number(req.params.movieId);
  const db = await openDb();
  try {
    await db.run(
      'DELETE FROM watchlist_items WHERE watchlist_id = ? AND movie_id = ?',
      watchlistId,
      movieId
    );
    res.status(204).send();
  } finally {
    await db.close();
  }
});

export default router;
