export interface Movie {
  id: number;
  title: string;
  director?: string;
  year?: number;
  rating?: number;
  watched: boolean;
  watch_status?: 'watched' | 'watching' | 'plan_to_watch';
  notes?: string;
}

export interface NewMovie {
  title: string;
  director?: string;
  year?: number;
  rating?: number;
  watched?: boolean;
  watch_status?: 'watched' | 'watching' | 'plan_to_watch';
  notes?: string;
}

export interface UpdateMovie {
  title?: string;
  director?: string;
  year?: number;
  rating?: number;
  watched?: boolean;
  watch_status?: 'watched' | 'watching' | 'plan_to_watch';
  notes?: string;
}

export interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date: string;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
  original_language: string;
  original_title: string;
  video: boolean;
}

export interface TmdbSearchResponse {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
}

export const TMDB_POSTER_SIZE = 'w500';
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export interface Watchlist {
  id: number;
  name: string;
  movie_count?: number;
}

export interface NewWatchlist {
  name: string;
}

export interface MovieRating {
  movie_id: number;
  rating: number;
}