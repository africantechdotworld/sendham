import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

export async function openDb() {
  return open({
    filename: './sendham.sqlite',
    driver: sqlite3.Database,
  });
}

export async function initDb() {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      director TEXT,
      year INTEGER,
      rating REAL,
      watched INTEGER DEFAULT 0,
      watch_status TEXT,
      notes TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS ratings (
      movie_id INTEGER PRIMARY KEY,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 10),
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
    )
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS watchlists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS watchlist_items (
      watchlist_id INTEGER NOT NULL,
      movie_id INTEGER NOT NULL,
      PRIMARY KEY (watchlist_id, movie_id),
      FOREIGN KEY (watchlist_id) REFERENCES watchlists(id) ON DELETE CASCADE,
      FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
    )
  `);
  await db.close();
}
