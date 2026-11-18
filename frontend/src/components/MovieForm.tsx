import { useState } from 'react';
import { CreateMovieInput } from '../types/movie';
import { createMovie } from '../services/api';

interface MovieFormProps {
  onRefresh: () => void;
}

export function MovieForm({ onRefresh }: MovieFormProps) {
  const [form, setForm] = useState<CreateMovieInput>({
    title: '',
    director: '',
    year: undefined,
    rating: undefined,
    watched: false,
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMovie({
      title: form.title,
      director: form.director || undefined,
      year: form.year,
      rating: form.rating,
      watched: form.watched,
      notes: form.notes || undefined,
    });
    setForm({
      title: '',
      director: '',
      year: undefined,
      rating: undefined,
      watched: false,
      notes: '',
    });
    onRefresh();
  };

  return (
    <form onSubmit={handleSubmit} className="movie-form">
      <h2>Add a Movie</h2>
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
          value={form.year ?? ''}
          onChange={(e) =>
            setForm({ ...form, year: e.target.value ? Number(e.target.value) : undefined })
          }
        />
      </div>
      <div className="form-row">
        <label>Rating (1-10)</label>
        <input
          type="number"
          min="1"
          max="10"
          value={form.rating ?? ''}
          onChange={(e) =>
            setForm({ ...form, rating: e.target.value ? Number(e.target.value) : undefined })
          }
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
          Add Movie
        </button>
      </div>
    </form>
  );
}
