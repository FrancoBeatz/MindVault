import express from 'express';
import sql from '../config/postgres.js';
import { authenticateToken } from '../middleware/auth.js';
import ErrorHandler from '../utils/error-handler.js';

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
  } catch (error) {
    ErrorHandler.logError(error, 'GET /journals', req.user?.id);
    const apiError = ErrorHandler.handleRouteError(error, 'GET /journals');
    res.status(apiError.statusCode).json({ message: apiError.message });
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
    ErrorHandler.logError(error, 'POST /journals', req.user?.id);
    const apiError = ErrorHandler.handleRouteError(error, 'POST /journals');
    res.status(apiError.statusCode).json({ message: apiError.message });
  }
});

// Update journal
router.put('/:id', authenticateToken, async (req: any, res) => {
  const { title, content } = req.body;
  
  try {
    const [journal] = await sql`
      SELECT * FROM journals WHERE id = ${req.params.id}
    `;

    if (!journal) return res.status(404).json({ message: 'Journal not found' });
    if (journal.user_id !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    const [updatedJournal] = await sql`
      UPDATE journals 
      SET title = ${title || journal.title}, 
          content = ${content || journal.content},
          updated_at = NOW()
      WHERE id = ${req.params.id}
      RETURNING *
    `;

    res.json(updatedJournal);
  } catch (error) {
    ErrorHandler.logError(error, 'PUT /journals/:id', req.user?.id);
    const apiError = ErrorHandler.handleRouteError(error, 'PUT /journals/:id');
    res.status(apiError.statusCode).json({ message: apiError.message });
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
    ErrorHandler.logError(error, 'DELETE /journals/:id', req.user?.id);
    const apiError = ErrorHandler.handleRouteError(error, 'DELETE /journals/:id');
    res.status(apiError.statusCode).json({ message: apiError.message });
  }
});

export default router;