import { useState } from 'react';
import { MovieForm } from './components/MovieForm';
import { MovieList } from './components/MovieList';

export default function App() {
  const [showForm, setShowForm] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Movie Log</h1>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Hide form' : 'Add movie'}
        </button>
      </header>

      {showForm && <MovieForm onAdd={() => setRefreshKey(k => k + 1)} />}

      <MovieList refreshKey={refreshKey} />
    </div>
  );
}
