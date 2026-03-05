import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import authRoutes from './routes/auth.js';
import journalRoutes from './routes/journal.js';
import { initDb } from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Initialize Database
initDb();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/journals', journalRoutes);

// Vite middleware for development
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  // Serve static files in production (only if not on Vercel)
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Only listen if not in a serverless environment
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 MindVault Server running on http://0.0.0.0:${PORT}`);
  });
}

export default app;
