import { Router } from 'express';
import { openDb } from '../db';

const router = Router();

// GET /api/movies/:id/rating — get a movie's rating
router.get('/:id/rating', async (req, res) => {
  const movieId = Number(req.params.id);
  const db = await openDb();
  try {
    const rating = await db.get('SELECT movie_id, rating FROM ratings WHERE movie_id = ?', movieId);
    if (!rating) {
      return res.json(null);
    }
    res.json(rating);
  } finally {
    await db.close();
  }
});

// POST /api/movies/:id/rating — set or update a movie's rating
router.post('/:id/rating', async (req, res) => {
  const movieId = Number(req.params.id);
  const { rating } = req.body;

  if (rating === undefined || rating === null || rating < 1 || rating > 10) {
    return res.status(400).json({ error: 'Rating must be between 1 and 10' });
  }

  const db = await openDb();
  try {
    const existing = await db.get('SELECT * FROM ratings WHERE movie_id = ?', movieId);
    if (existing) {
      await db.run('UPDATE ratings SET rating = ? WHERE movie_id = ?', rating, movieId);
    } else {
      await db.run('INSERT INTO ratings (movie_id, rating) VALUES (?, ?)', movieId, rating);
    }
    const result = await db.get('SELECT movie_id, rating FROM ratings WHERE movie_id = ?', movieId);
    res.status(201).json(result);
  } finally {
    await db.close();
  }
});

// DELETE /api/movies/:id/rating — remove a movie's rating
router.delete('/:id/rating', async (req, res) => {
  const movieId = Number(req.params.id);
  const db = await openDb();
  try {
    await db.run('DELETE FROM ratings WHERE movie_id = ?', movieId);
    res.status(204).send();
  } finally {
    await db.close();
  }
});

export default router;
