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
      notes TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await db.close();
}
