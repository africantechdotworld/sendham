import { Movie } from '../types/movie';
import { useState } from 'react';
import {
  updateMovie,
  deleteMovie,
} from '../services/api';

interface MovieItemProps {
  movie: Movie;
  onRefresh: () => void;
}

export function MovieItem({ movie, onRefresh }: MovieItemProps) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: movie.title,
    director: movie.director ?? '',
    year: movie.year ? String(movie.year) : '',
    rating: movie.rating ? String(movie.rating) : '',
    watched: movie.watched,
    notes: movie.notes ?? '',
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateMovie(movie.id, {
      title: form.title,
      director: form.director || undefined,
      year: form.year ? Number(form.year) : undefined,
      rating: form.rating ? Number(form.rating) : undefined,
      watched: form.watched,
      notes: form.notes || undefined,
    });
    setEditing(false);
    onRefresh();
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this movie?')) return;
    await deleteMovie(movie.id);
    onRefresh();
  };

  if (editing) {
    return (
      <div className="movie-card">
        <form onSubmit={handleSave} className="movie-form">
          <div className="form-row">
            <label>Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div className="form-row">
            <label>Director</label>
            <input
              value={form.director}
              onChange={(e) => setForm({ ...form, director: e.target.value })}
            />
          </div>
          <div className="form-row">
            <label>Year</label>
            <input
              type="number"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            />
          </div>
          <div className="form-row">
            <label>Rating (1-10)</label>
            <input
              type="number"
              min="1"
              max="10"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: e.target.value })}
            />
          </div>
          <div className="form-row">
            <label>Watched</label>
            <select
              value={String(form.watched)}
              onChange={(e) =>
                setForm({ ...form, watched: e.target.value === 'true' })
              }
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>
          <div className="form-row">
            <label>Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Save
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-small"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="movie-card">
      <div className="movie-card-header">
        <div>
          <div className="movie-title">{movie.title}</div>
          <div className="movie-meta">
            {movie.director && <span>{movie.director}</span>}
            {movie.year && <span>{movie.year}</span>}
            {movie.rating && <span>⭐ {movie.rating}/10</span>}
          </div>
          {movie.notes && <div className="movie-meta">{movie.notes}</div>}
        </div>
        <span
          className={movie.watched ? 'watched-badge' : 'not-watched-badge'}
        >
          {movie.watched ? 'Watched' : 'Not watched'}
        </span>
      </div>
      <div className="movie-actions">
        <button
          type="button"
          className="btn btn-secondary btn-small"
          onClick={() => setEditing(true)}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn-danger btn-small"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
