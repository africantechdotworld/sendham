import { useEffect, useState } from 'react';
import { Movie } from '../types/movie';
import { getMovies } from '../services/api';
import { MovieItem } from './MovieItem';
import { MovieForm } from './MovieForm';

export function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const data = await getMovies();
      setMovies(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const onRefresh = () => {
    loadMovies();
  };

  if (loading) {
    return <div className="loading">Loading movies…</div>;
  }

  if (error) {
    return (
      <div className="empty-state">
        <p>Error: {error}</p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={loadMovies}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <>
      <MovieForm onRefresh={onRefresh} />
      <h2>Your Movie Log ({movies.length})</h2>
      {movies.length === 0 ? (
        <div className="empty-state">
          <p>No movies yet. Add your first one above!</p>
        </div>
      ) : (
        <div className="movie-list">
          {movies.map((movie) => (
            <MovieItem key={movie.id} movie={movie} onRefresh={onRefresh} />
          ))}
        </div>
      )}
    </>
  );
}
