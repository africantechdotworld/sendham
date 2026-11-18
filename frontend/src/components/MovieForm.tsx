import { useState } from 'react';
import { addMovie } from '../services/api';
import { NewMovie } from '../types/movie';

interface MovieFormProps {
  onAdd: () => void;
}

export function MovieForm({ onAdd }: MovieFormProps) {
  const [form, setForm] = useState<NewMovie>({
    title: '',
    director: '',
    year: '',
    rating: '',
    watched: false,
    notes: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload: NewMovie = {
      title: form.title.trim(),
      ...(form.director.trim() && { director: form.director.trim() }),
      ...(form.year && { year: Number(form.year) }),
      ...(form.rating && { rating: Number(form.rating) }),
      watched: form.watched,
      ...(form.notes.trim() && { notes: form.notes.trim() }),
    };

    try {
      await addMovie(payload);
      setForm({ title: '', director: '', year: '', rating: '', watched: false, notes: '' });
      onAdd();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add movie');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="movie-form">
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
      {error && (
        <div style={{ color: '#dc2626', fontSize: '0.875rem', marginBottom: '8px' }}>
          {error}
        </div>
      )}
      <button type="submit" className="btn btn-primary">
        Add Movie
      </button>
    </form>
  );
}
