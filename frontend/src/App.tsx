import { useState } from 'react';
import { MovieForm } from './components/MovieForm';
import { MovieList } from './components/MovieList';
import { MovieBrowser } from './components/MovieBrowser';
import { WatchlistView } from './components/WatchlistView';

type Tab = 'log' | 'browse' | 'watchlists';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('log');
  const [refreshKey, setRefreshKey] = useState(0);
  const [showForm, setShowForm] = useState(true);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Movie Log</h1>
        <div className="nav-tabs">
          <button
            type="button"
            className={`nav-tab ${activeTab === 'log' ? 'active' : ''}`}
            onClick={() => setActiveTab('log')}
          >
            My Log
          </button>
          <button
            type="button"
            className={`nav-tab ${activeTab === 'browse' ? 'active' : ''}`}
            onClick={() => setActiveTab('browse')}
          >
            Browse
          </button>
          <button
            type="button"
            className={`nav-tab ${activeTab === 'watchlists' ? 'active' : ''}`}
            onClick={() => setActiveTab('watchlists')}
          >
            Watchlists
          </button>
        </div>
      </header>

      {activeTab === 'log' && (
        <>
          {showForm && (
            <MovieForm onAdd={() => setRefreshKey((k) => k + 1)} />
          )}
          <button
            type="button"
            className="btn btn-secondary btn-sm toggle-form"
            onClick={() => setShowForm((s) => !s)}
          >
            {showForm ? 'Hide form' : 'Add movie'}
          </button>
          <MovieList refreshKey={refreshKey} />
        </>
      )}

      {activeTab === 'browse' && (
        <MovieBrowser onRefresh={() => setRefreshKey((k) => k + 1)} />
      )}

      {activeTab === 'watchlists' && (
        <WatchlistView onRefresh={() => setRefreshKey((k) => k + 1)} />
      )}
    </div>
  );
}