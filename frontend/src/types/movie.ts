export interface Movie {
  id: number;
  title: string;
  director?: string;
  year?: number;
  rating?: number;
  watched: boolean;
  notes?: string;
}

export interface NewMovie {
  title: string;
  director?: string;
  year?: number;
  rating?: number;
  watched?: boolean;
  notes?: string;
}

export interface UpdateMovie {
  title?: string;
  director?: string;
  year?: number;
  rating?: number;
  watched?: boolean;
  notes?: string;
}
