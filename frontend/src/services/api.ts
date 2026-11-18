import { Movie, NewMovie, UpdateMovie } from '../types/movie';

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
