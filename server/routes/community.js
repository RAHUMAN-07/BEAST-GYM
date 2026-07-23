import express from 'express';
import { run, query } from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get Challenges
router.get('/challenges', async (req, res) => {
  try {
    const list = await query('SELECT * FROM challenges ORDER BY id DESC');
    return res.json(list);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch challenges.' });
  }
});

// Join Challenge
router.post('/challenges/join', authenticateToken, async (req, res) => {
  try {
    const { challengeId } = req.body;
    await run('UPDATE challenges SET participants_count = participants_count + 1 WHERE id = ?', [challengeId]);
    return res.json({ message: 'Successfully joined challenge!' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to join challenge.' });
  }
});

// Leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await query(`
      SELECT u.id, u.name, u.avatar, p.fitness_level, 
             COUNT(wl.id) as total_workouts, 
             SUM(wl.calories_burned) as total_calories
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      LEFT JOIN workout_logs wl ON u.id = wl.user_id
      GROUP BY u.id
      ORDER BY total_workouts DESC, total_calories DESC
      LIMIT 10
    `);
    return res.json(leaderboard);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch leaderboard.' });
  }
});

// Admin Announcements / Fitness Tips
router.get('/tips', async (req, res) => {
  try {
    const tips = await query('SELECT * FROM admin_notes ORDER BY created_at DESC');
    return res.json(tips);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch tips.' });
  }
});

export default router;
