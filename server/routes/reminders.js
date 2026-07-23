import express from 'express';
import { run, query } from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get Reminders
router.get('/', authenticateToken, async (req, res) => {
  try {
    const reminders = await query('SELECT * FROM reminders WHERE user_id = ?', [req.user.id]);
    return res.json(reminders);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch reminders.' });
  }
});

// Update / Toggle Reminder
router.post('/toggle', authenticateToken, async (req, res) => {
  try {
    const { reminder_type, time_str, is_enabled } = req.body;
    const userId = req.user.id;

    await run(`
      INSERT INTO reminders (user_id, reminder_type, time_str, is_enabled)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id, reminder_type) DO UPDATE SET
        time_str=excluded.time_str, is_enabled=excluded.is_enabled
    `, [userId, reminder_type, time_str, is_enabled ? 1 : 0]);

    return res.json({ message: 'Reminder updated.' });
  } catch (err) {
    // In case no UNIQUE index exists on (user_id, reminder_type), fallback to delete & insert
    try {
      await run('DELETE FROM reminders WHERE user_id = ? AND reminder_type = ?', [req.user.id, req.body.reminder_type]);
      await run('INSERT INTO reminders (user_id, reminder_type, time_str, is_enabled) VALUES (?, ?, ?, ?)',
        [req.user.id, req.body.reminder_type, req.body.time_str, req.body.is_enabled ? 1 : 0]
      );
      return res.json({ message: 'Reminder updated.' });
    } catch (e) {
      return res.status(500).json({ error: 'Failed to update reminder.' });
    }
  }
});

export default router;
