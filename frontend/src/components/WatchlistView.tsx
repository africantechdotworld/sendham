import { useEffect, useState } from 'react';
import {
  getWatchlists,
  getWatchlistMovies,
  createWatchlist,
  removeMovieFromWatchlist,
  deleteWatchlist,
  setMovieRating,
} from '../services/api';
import { Watchlist, Movie } from '../types/movie';
import { RatingStars } from './RatingStars';

interface WatchlistViewProps {
  onRefresh: () => void;
}

export function WatchlistView({ onRefresh }: WatchlistViewProps) {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [activeListId, setActiveListId] = useState<number | null>(null);
  const [listMovies, setListMovies] = useState<Movie[]>([]);
  const [newListName, setNewListName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWatchlists = async () => {
    try {
      setLoading(true);
      const data = await getWatchlists();
      setWatchlists(data);
      if (data.length > 0 && activeListId === null) {
        setActiveListId(data[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load watchlists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWatchlists();
  }, [onRefresh]);

  useEffect(() => {
    if (activeListId !== null) {
      const load = async () => {
        try {
          const data = await getWatchlistMovies(activeListId);
          setListMovies(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load watchlist movies');
        }
      };
      load();
    } else {
      setListMovies([]);
    }
  }, [activeListId]);

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    try {
      setLoading(true);
      await createWatchlist({ name: newListName.trim() });
      setNewListName('');
      await loadWatchlists();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create watchlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromList = async (movieId: number) => {
    if (activeListId === null) return;
    try {
      await removeMovieFromWatchlist(activeListId, movieId);
      const data = await getWatchlistMovies(activeListId!);
      setListMovies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove movie from watchlist');
    }
  };

  const handleRateMovie = async (movieId: number, rating: number) => {
    try {
      await setMovieRating(movieId, rating);
      onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rate movie');
    }
  };

  const handleDeleteList = async (id: number) => {
    if (!window.confirm('Delete this watchlist?')) return;
    try {
      await deleteWatchlist(id);
      setActiveListId(null);
      await loadWatchlists();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete watchlist');
    }
  };

  const activeList = watchlists.find((l) => l.id === activeListId);

  if (loading) {
    return <div className="empty-state">Loading watchlists...</div>;
  }

  if (error) {
    return (
      <div className="empty-state" style={{ color: '#dc2626' }}>
        {error}
      </div>
    );
  }

  return (
    <div className="watchlist-view">
      <div className="watchlist-header">
        <h2 className="watchlist-title">Watchlists</h2>
        <form onSubmit={handleCreateList} className="watchlist-create-form">
          <input
            className="watchlist-name-input"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="New watchlist name..."
          />
          <button type="submit" className="btn btn-primary btn-small">
            Create
          </button>
        </form>
      </div>

      <div className="watchlists-grid">
        <div className="watchlist-list">
          {watchlists.map((list) => (
            <div
              key={list.id}
              className={`watchlist-item ${activeListId === list.id ? 'active' : ''}`}
              onClick={() => setActiveListId(list.id)}
            >
              <div className="watchlist-item-info">
                <span className="watchlist-item-name">{list.name}</span>
                <span className="watchlist-item-count">{list.movie_count ?? 0} movies</span>
              </div>
              <button
                type="button"
                className="btn btn-danger btn-small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteList(list.id);
                }}
              >
                Delete
              </button>
            </div>
          ))}
          {watchlists.length === 0 && (
            <div className="empty-state">No watchlists yet. Create one above!</div>
          )}
        </div>

        {activeListId !== null && activeList && (
          <div className="watchlist-detail">
            <div className="watchlist-detail-header">
              <h3 className="watchlist-detail-title">{activeList.name}</h3>
              <button
                type="button"
                className="btn btn-secondary btn-small"
                onClick={() => setActiveListId(null)}
              >
                Back
              </button>
            </div>
            {listMovies.length === 0 ? (
              <div className="empty-state">
                No movies in this watchlist yet.
              </div>
            ) : (
              <div className="movie-grid">
                {listMovies.map((movie) => (
                  <div key={movie.id} className="watchlist-movie-card">
                    <div className="watchlist-movie-info">
                      <div className="watchlist-movie-title">{movie.title}</div>
                      {movie.year && (
                        <span className="watchlist-movie-year">{movie.year}</span>
                      )}
                    </div>
                    <div className="watchlist-movie-actions">
                      <RatingStars
                        movieId={movie.id}
                        currentRating={movie.rating ?? 0}
                        onChange={(rating) => handleRateMovie(movie.id, rating)}
                        size="sm"
                      />
                      <button
                        type="button"
                        className="btn btn-danger btn-small"
                        onClick={() => handleRemoveFromList(movie.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}