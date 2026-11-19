import { useState } from 'react';
import { TmdbMovie } from '../types/movie';
import { tmdbPosterUrl } from '../services/api';
import { RatingStars } from './RatingStars';

interface MovieCardProps {
  movie: TmdbMovie;
  onSave: (movie: TmdbMovie) => void;
  saved: boolean;
}

export function MovieCard({ movie, onSave, saved }: MovieCardProps) {
  const [saving, setSaving] = useState(false);
  const posterUrl = tmdbPosterUrl(movie.poster_path);

  const handleSave = async () => {
    setSaving(true);
    try {
      onSave(movie);
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="movie-card tmdb-card">
      <div className="tmdb-poster-wrapper">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={`${movie.title} poster`}
            className="tmdb-poster"
            loading="lazy"
          />
        ) : (
          <div className="tmdb-poster-placeholder">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 29.17H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v23.17a2 2 0 0 1-2 2Z" />
              <polyline points="7 11 12 17 17 11" />
              <line x1="12" x2="12" y1="17" y2="17" />
            </svg>
          </div>
        )}
        <span className="tmdb-release-year">{movie.release_date?.slice(0, 4) ?? '—'}</span>
      </div>
      <div className="tmdb-card-body">
        <h3 className="tmdb-title">{movie.title}</h3>
        <div className="tmdb-meta">
          {movie.vote_average && (
            <span className="tmdb-vote">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              {movie.vote_average.toFixed(1)}
            </span>
          )}
          {movie.genre_ids?.slice(0, 2).map((gid) => (
            <span key={gid} className="tmdb-genre">
              Genre {gid}
            </span>
          ))}
        </div>
        {movie.overview && (
          <p className="tmdb-overview">{movie.overview}</p>
        )}
        <div className="tmdb-actions">
          <button
            type="button"
            className={`save-btn ${saved ? 'saved' : ''} ${saving ? 'saving' : ''}`}
            onClick={handleSave}
            disabled={saved || saving}
          >
            {saved ? 'Saved' : saving ? 'Saving…' : 'Save to log'}
          </button>
          <RatingStars
            movieId={-movie.id}
            size="sm"
            readOnly
            currentRating={Math.round(movie.vote_average)}
          />
        </div>
      </div>
    </article>
  );
}