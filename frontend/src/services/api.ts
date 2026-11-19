import {
  Movie,
  NewMovie,
  UpdateMovie,
  TmdbMovie,
  TMDB_POSTER_SIZE,
  TMDB_BASE_URL,
  TMDB_IMAGE_BASE_URL,
  Watchlist,
  NewWatchlist,
  MovieRating,
} from '../types/movie';

export function tmdbPosterUrl(path: string | null): string {
  if (!path) return '';
  return `${TMDB_IMAGE_BASE_URL}${TMDB_POSTER_SIZE}${path}`;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';

async function request(path: string, options: RequestInit = {}): Promise<Response> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.statusText}`);
  }
  return res;
}

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

async function tmdbRequest(path: string): Promise<any> {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key not configured');
  }
  const res = await fetch(`${TMDB_BASE_URL}${path}?api_key=${TMDB_API_KEY}&language=en-US`);
  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.statusText}`);
  }
  return res.json();
}

export async function getMovies(): Promise<Movie[]> {
  const res = await request('/movies');
  return res.json();
}

export async function addMovie(movie: NewMovie): Promise<Movie> {
  const res = await request('/movies', {
    method: 'POST',
    body: JSON.stringify(movie),
  });
  return res.json();
}

export async function updateMovie(id: number, data: UpdateMovie): Promise<Movie> {
  const res = await request(`/movies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteMovie(id: number): Promise<void> {
  await request(`/movies/${id}`, {
    method: 'DELETE',
  });
}

export async function searchTmdbMovies(query: string): Promise<TmdbMovie[]> {
  const data = await tmdbRequest(`/search/movie?query=${encodeURIComponent(query)}`);
  return data.results ?? [];
}

export async function getTmdbMovieDetails(tmdbId: number): Promise<TmdbMovie> {
  return tmdbRequest(`/movie/${tmdbId}`);
}

export function tmdbPosterPath(path: string | null, size: string = TMDB_POSTER_SIZE): string {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Poster';
  return `${TMDB_IMAGE_BASE_URL}${size}${path}`;
}

export async function getWatchlists(): Promise<Watchlist[]> {
  const res = await request('/watchlists');
  return res.json();
}

export async function getWatchlistMovies(watchlistId: number): Promise<Movie[]> {
  const res = await request(`/watchlists/${watchlistId}/movies`);
  return res.json();
}

export async function createWatchlist(data: NewWatchlist): Promise<Watchlist> {
  const res = await request('/watchlists', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function addMovieToWatchlist(watchlistId: number, movieId: number): Promise<void> {
  await request(`/watchlists/${watchlistId}/movies/${movieId}`, {
    method: 'POST',
  });
}

export async function removeMovieFromWatchlist(watchlistId: number, movieId: number): Promise<void> {
  await request(`/watchlists/${watchlistId}/movies/${movieId}`, {
    method: 'DELETE',
  });
}

export async function deleteWatchlist(watchlistId: number): Promise<void> {
  await request(`/watchlists/${watchlistId}`, {
    method: 'DELETE',
  });
}

export async function getMovieRating(movieId: number): Promise<MovieRating | null> {
  const res = await request(`/movies/${movieId}/rating`);
  return res.json();
}

export async function setMovieRating(movieId: number, rating: number): Promise<MovieRating> {
  const res = await request(`/movies/${movieId}/rating`, {
    method: 'POST',
    body: JSON.stringify({ rating }),
  });
  return res.json();
}

export async function deleteMovieRating(movieId: number): Promise<void> {
  await request(`/movies/${movieId}/rating`, {
    method: 'DELETE',
  });
}