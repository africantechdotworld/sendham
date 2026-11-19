import { useState, useEffect } from 'react';
import { searchTmdbMovies } from '../services/api';
import { TmdbMovie } from '../types/movie';
import { MovieCard } from './MovieCard';
import { addMovie } from '../services/api';
import { NewMovie } from '../types/movie';

interface MovieBrowserProps {
  onRefresh?: () => void;
}

export function MovieBrowser({ onRefresh }: MovieBrowserProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TmdbMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());

  const search = async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const data = await searchTmdbMovies(q);
      setResults(data);
    } catch (err) {
      console.error('TMDB search failed', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => search(query), 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSave = async (movie: TmdbMovie) => {
    const payload: NewMovie = {
      title: movie.title,
      year: movie.release_date ? Number(movie.release_date.slice(0, 4)) : undefined,
      rating: movie.vote_average ? Math.round(movie.vote_average) : undefined,
      notes: movie.overview,
    };
    await addMovie(payload);
    setSavedIds((prev) => new Set([...prev, movie.id]));
    onRefresh?.();
  };

  const isSaved = (id: number) => savedIds.has(id);

  return (
    <section className="movie-browser">
      <div className="browser-header">
        <h2 className="browser-title">Discover Movies</h2>
        <p className="browser-subtitle">
          Browse popular titles and save any movie to your log.
        </p>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search movies on TMDB…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {loading && <p className="empty-state">Searching…</p>}

      {!loading && query.trim() && results.length === 0 && (
        <p className="empty-state">No movies found. Try a different search.</p>
      )}

      {!loading && results.length > 0 && (
        <div className="tmdb-grid">
          {results.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSave={handleSave}
              saved={isSaved(movie.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}