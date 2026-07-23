import express from 'express';
import { run, query, getOne } from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Summary Analytics & Charts Data
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Weight history (last 14 logs)
    const weightHistory = await query(
      `SELECT weight_kg, date_logged FROM body_measurements WHERE user_id = ? AND weight_kg IS NOT NULL ORDER BY date_logged ASC, id ASC LIMIT 14`,
      [userId]
    );

    // Calorie history (last 7 days)
    const calorieHistory = await query(
      `SELECT date_logged, SUM(calories) as total_calories FROM meal_logs WHERE user_id = ? GROUP BY date_logged ORDER BY date_logged ASC LIMIT 7`,
      [userId]
    );

    // Total workouts
    const workoutCount = await getOne(`SELECT COUNT(*) as total FROM workout_logs WHERE user_id = ?`, [userId]);

    // Badges
    const achievements = await query(`SELECT * FROM achievements WHERE user_id = ? ORDER BY unlocked_at DESC`, [userId]);

    // Calculate Workout Streak (consecutive days logged)
    const streakRow = await query(
      `SELECT DISTINCT date_logged FROM workout_logs WHERE user_id = ? ORDER BY date_logged DESC LIMIT 30`,
      [userId]
    );

    let streak = 0;
    if (streakRow.length > 0) {
      streak = streakRow.length; // Simplified streak calculation
    }

    return res.json({
      weightHistory,
      calorieHistory,
      totalWorkouts: workoutCount ? workoutCount.total : 0,
      streak,
      achievements
    });
  } catch (err) {
    console.error('Progress summary error:', err);
    return res.status(500).json({ error: 'Failed to fetch progress summary.' });
  }
});

// Log & Fetch Body Measurements
router.post('/body-measurements', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { weight_kg, chest_cm, waist_cm, hips_cm, biceps_cm, thighs_cm } = req.body;

    await run(
      `INSERT INTO body_measurements (user_id, weight_kg, chest_cm, waist_cm, hips_cm, biceps_cm, thighs_cm) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, weight_kg ? parseFloat(weight_kg) : null, chest_cm ? parseFloat(chest_cm) : null, waist_cm ? parseFloat(waist_cm) : null, hips_cm ? parseFloat(hips_cm) : null, biceps_cm ? parseFloat(biceps_cm) : null, thighs_cm ? parseFloat(thighs_cm) : null]
    );

    if (weight_kg) {
      await run(`UPDATE profiles SET weight_kg = ? WHERE user_id = ?`, [parseFloat(weight_kg), userId]);
    }

    return res.json({ message: 'Body measurements logged!' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to log body measurements.' });
  }
});

router.get('/body-measurements', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await query(`SELECT * FROM body_measurements WHERE user_id = ? ORDER BY date_logged DESC, id DESC LIMIT 20`, [userId]);
    return res.json(history);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch body measurements.' });
  }
});

// Log & Fetch Sleep & Steps
router.post('/sleep-steps', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { sleep_hours, steps_count } = req.body;

    await run(
      `INSERT INTO sleep_step_logs (user_id, sleep_hours, steps_count) VALUES (?, ?, ?)`,
      [userId, sleep_hours ? parseFloat(sleep_hours) : null, steps_count ? parseInt(steps_count) : null]
    );

    return res.json({ message: 'Sleep and step data logged!' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to log sleep/steps.' });
  }
});

router.get('/sleep-steps', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await query(`SELECT * FROM sleep_step_logs WHERE user_id = ? ORDER BY date_logged DESC, id DESC LIMIT 14`, [userId]);
    return res.json(history);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch sleep and step logs.' });
  }
});

// Progress Photos
router.post('/photos', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { image_url, notes } = req.body;

    await run(`INSERT INTO progress_photos (user_id, image_url, notes) VALUES (?, ?, ?)`, [userId, image_url || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80', notes || '']);

    return res.json({ message: 'Progress photo saved!' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to save progress photo.' });
  }
});

router.get('/photos', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const photos = await query(`SELECT * FROM progress_photos WHERE user_id = ? ORDER BY date_logged DESC, id DESC`, [userId]);
    return res.json(photos);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch progress photos.' });
  }
});

export default router;
