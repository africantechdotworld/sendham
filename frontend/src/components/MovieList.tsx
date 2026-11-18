import { useEffect, useState } from 'react';
import { getMovies, deleteMovie } from '../services/api';
import { Movie } from '../types/movie';
import { MovieItem } from './MovieItem';

export function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const data = await getMovies();
      setMovies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMovie(id);
      setMovies(movies.filter((m) => m.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete movie');
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  if (loading) {
    return <div className="empty-state">Loading movies...</div>;
  }

  if (error) {
    return (
      <div className="empty-state" style={{ color: '#dc2626' }}>
        {error}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="empty-state">
        No movies logged yet. Add one below!
      </div>
    );
  }

  return (
    <div>
      {movies.map((movie) => (
        <MovieItem key={movie.id} movie={movie} onRefresh={loadMovies} />
      ))}
    </div>
  );
}
