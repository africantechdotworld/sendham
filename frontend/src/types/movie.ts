export interface Movie {
  id: number;
  title: string;
  director?: string;
  year?: number;
  rating?: number;
  watched: boolean;
  notes?: string;
  createdAt: string;
}

export interface CreateMovieInput {
  title: string;
  director?: string;
  year?: number;
  rating?: number;
  watched?: boolean;
  notes?: string;
}

export interface UpdateMovieInput {
  title?: string;
  director?: string;
  year?: number;
  rating?: number;
  watched?: boolean;
  notes?: string;
}
