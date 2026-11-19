import { useState } from 'react';

import { getMovieRating, setMovieRating, deleteMovieRating } from '../services/api';

interface RatingStarsProps {
  movieId: number;
  currentRating?: number;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
}

export function RatingStars({
  movieId,
  currentRating,
  onChange,
  size = 'md',
  readOnly = false,
}: RatingStarsProps) {
  const [rating, setRating] = useState(currentRating ?? 0);
  const [saving, setSaving] = useState(false);

  const sizes = { sm: 18, md: 22, lg: 28 };
  const starSize = sizes[size];

  const handleStarClick = async (newRating: number) => {
    if (readOnly) return;
    setRating(newRating);
    setSaving(true);
    try {
      const existing = await getMovieRating(movieId);
      if (existing) {
        await setMovieRating(movieId, newRating);
      } else {
        await setMovieRating(movieId, newRating);
      }
      onChange?.(newRating);
    } catch (err) {
      console.error('Failed to save rating', err);
    } finally {
      setSaving(false);
    }
  };

  const handleClear = async () => {
    if (readOnly) return;
    setRating(0);
    setSaving(true);
    try {
      await deleteMovieRating(movieId);
      onChange?.(0);
    } catch (err) {
      console.error('Failed to clear rating', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={`rating-stars rating-${size}`}
      role="radiogroup"
      aria-label="Rating"
    >
      {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((star) => (
        <button
          key={star}
          type="button"
          className={`star-btn ${
            rating >= star ? 'filled' : ''
          } ${readOnly ? 'readonly' : ''}`}
          aria-checked={rating >= star ? 'true' : 'false'}
          onClick={() => handleStarClick(star)}
          title={`${star} of 10`}
          disabled={saving || readOnly}
        >
          <svg
            width={starSize}
            height={starSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      ))}
      {!readOnly && rating > 0 && (
        <button
          type="button"
          className="clear-rating"
          onClick={handleClear}
          disabled={saving}
        >
          Clear
        </button>
      )}
    </div>
  );
}