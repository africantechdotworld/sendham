import express from 'express';
import cors from 'cors';
import moviesRouter from './routes/movies';
import { initDb } from './db';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/movies', moviesRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Movie log API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });

export default app;
