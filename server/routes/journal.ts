import express from 'express';
import supabase from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all journals for user
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const { data: journals, error } = await supabase
      .from('journals')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(journals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching journals' });
  }
});

// Create journal
router.post('/', authenticateToken, async (req: any, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ message: 'Title and content are required' });

  try {
    const { data: newJournal, error } = await supabase
      .from('journals')
      .insert([{ user_id: req.user.id, title, content }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(newJournal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating journal' });
  }
});

// Delete journal
router.delete('/:id', authenticateToken, async (req: any, res) => {
  try {
    const { data: journal, error: fetchError } = await supabase
      .from('journals')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (!journal) return res.status(404).json({ message: 'Journal not found' });
    if (journal.user_id !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    const { error: deleteError } = await supabase
      .from('journals')
      .delete()
      .eq('id', req.params.id);

    if (deleteError) throw deleteError;
    res.json({ message: 'Journal deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting journal' });
  }
});

export default router;
