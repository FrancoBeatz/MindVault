import express from 'express';
import sql from '../config/postgres.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all journals for user
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const journals = await sql`
      SELECT * FROM journals 
      WHERE user_id = ${req.user.id} 
      ORDER BY created_at DESC
    `;

    res.json(journals);
  } catch (error: any) {
    console.error('Database Error:', error);
    res.status(500).json({ 
      message: 'Error fetching journals', 
      error: error.message,
      code: error.code
    });
  }
});

// Create journal
router.post('/', authenticateToken, async (req: any, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ message: 'Title and content are required' });

  try {
    const [newJournal] = await sql`
      INSERT INTO journals (user_id, title, content)
      VALUES (${req.user.id}, ${title}, ${content})
      RETURNING *
    `;

    res.status(201).json(newJournal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating journal' });
  }
});

// Delete journal
router.delete('/:id', authenticateToken, async (req: any, res) => {
  try {
    const [journal] = await sql`
      SELECT * FROM journals WHERE id = ${req.params.id}
    `;

    if (!journal) return res.status(404).json({ message: 'Journal not found' });
    if (journal.user_id !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    await sql`
      DELETE FROM journals WHERE id = ${req.params.id}
    `;

    res.json({ message: 'Journal deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting journal' });
  }
});

export default router;
