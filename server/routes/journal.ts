import express from 'express';
import db from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all journals for user
router.get('/', authenticateToken, (req: any, res) => {
  try {
    const journals = db.prepare('SELECT * FROM journals WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
    res.json(journals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching journals' });
  }
});

// Create journal
router.post('/', authenticateToken, (req: any, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ message: 'Title and content are required' });

  try {
    const result = db.prepare('INSERT INTO journals (user_id, title, content) VALUES (?, ?, ?)').run(req.user.id, title, content);
    const newJournal = db.prepare('SELECT * FROM journals WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newJournal);
  } catch (error) {
    res.status(500).json({ message: 'Error creating journal' });
  }
});

// Delete journal
router.delete('/:id', authenticateToken, (req: any, res) => {
  try {
    const journal: any = db.prepare('SELECT * FROM journals WHERE id = ?').get(req.params.id);
    if (!journal) return res.status(404).json({ message: 'Journal not found' });
    if (journal.user_id !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    db.prepare('DELETE FROM journals WHERE id = ?').run(req.params.id);
    res.json({ message: 'Journal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting journal' });
  }
});

export default router;
