import type { Movie, CreateMovieInput, UpdateMovieInput } from '../types/movie';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export async function getMovies(): Promise<Movie[]> {
  const res = await fetch(`${API_BASE}/movies`);
  if (!res.ok) throw new Error('Failed to fetch movies');
  return res.json();
}

export async function createMovie(movie: CreateMovieInput): Promise<Movie> {
  const res = await fetch(`${API_BASE}/movies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movie),
  });
  if (!res.ok) throw new Error('Failed to create movie');
  return res.json();
}

export async function updateMovie(
  id: number,
  movie: UpdateMovieInput
): Promise<Movie> {
  const res = await fetch(`${API_BASE}/movies/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movie),
  });
  if (!res.ok) throw new Error('Failed to update movie');
  return res.json();
}

export async function deleteMovie(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/movies/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete movie');
}
