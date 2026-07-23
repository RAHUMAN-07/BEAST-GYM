import express from 'express';
import { run, query, getOne } from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get My Active Workout Plan
router.get('/my-plan', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const workouts = await query('SELECT * FROM workouts WHERE user_id = ?', [userId]);

    const result = [];
    for (const w of workouts) {
      const exercises = await query('SELECT * FROM workout_exercises WHERE workout_id = ?', [w.id]);
      result.push({
        ...w,
        exercises
      });
    }

    return res.json(result);
  } catch (err) {
    console.error('My plan error:', err);
    return res.status(500).json({ error: 'Failed to fetch workout plan.' });
  }
});

// Log Workout Session
router.post('/log', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { workout_id, workout_title, duration_mins, calories_burned, notes } = req.body;

    const logged = await run(
      `INSERT INTO workout_logs (user_id, workout_id, workout_title, duration_mins, calories_burned, notes) VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, workout_id || null, workout_title || 'Custom Session', parseInt(duration_mins) || 30, parseInt(calories_burned) || 250, notes || '']
    );

    // Check workout logs count for achievements
    const countRes = await getOne('SELECT COUNT(*) as count FROM workout_logs WHERE user_id = ?', [userId]);
    const totalCount = countRes.count;

    let newBadge = null;
    if (totalCount === 1) {
      await run(`INSERT INTO achievements (user_id, badge_key, title, description, icon) VALUES (?, 'first_workout', 'First Workout Complete', 'Logged your very first workout session!', '🏋️')`, [userId]);
      newBadge = 'First Workout Complete';
    } else if (totalCount === 5) {
      await run(`INSERT INTO achievements (user_id, badge_key, title, description, icon) VALUES (?, 'workout_5', 'Consistent Beast', 'Completed 5 full workout sessions', '🔥')`, [userId]);
      newBadge = 'Consistent Beast';
    }

    return res.json({
      message: 'Workout logged successfully!',
      logId: logged.id,
      newBadge
    });
  } catch (err) {
    console.error('Log workout error:', err);
    return res.status(500).json({ error: 'Failed to log workout.' });
  }
});

// Workout History
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const logs = await query('SELECT * FROM workout_logs WHERE user_id = ? ORDER BY date_logged DESC, id DESC LIMIT 30', [userId]);
    return res.json(logs);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch workout history.' });
  }
});

// Exercise Catalog & Substitute Lookup
router.get('/templates', async (req, res) => {
  try {
    const { muscle, category, search } = req.query;
    let sql = 'SELECT * FROM exercise_templates WHERE 1=1';
    const params = [];

    if (muscle) {
      sql += ' AND muscle_group = ?';
      params.push(muscle);
    }
    if (category) {
      sql += ' AND (category = ? OR category = "home")';
      params.push(category);
    }
    if (search) {
      sql += ' AND (name LIKE ? OR muscle_group LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const exercises = await query(sql, params);
    return res.json(exercises);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch exercise templates.' });
  }
});

// Substitutes for an Exercise
router.get('/substitutes/:exerciseName', async (req, res) => {
  try {
    const name = decodeURIComponent(req.params.exerciseName);
    const ex = await getOne('SELECT * FROM exercise_templates WHERE name = ?', [name]);
    if (!ex) return res.status(404).json({ error: 'Exercise not found' });

    const related = await query('SELECT * FROM exercise_templates WHERE muscle_group = ? AND name != ? LIMIT 4', [ex.muscle_group, name]);
    return res.json({
      primary: ex,
      substitutes: related,
      suggestedText: ex.substitutes
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to find substitutes.' });
  }
});

export default router;
