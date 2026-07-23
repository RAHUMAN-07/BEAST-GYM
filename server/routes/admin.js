import express from 'express';
import { run, query, getOne } from '../db/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Apply admin protection to all routes in this file
router.use(authenticateToken, requireAdmin);

// Platform Overview Stats
router.get('/stats', async (req, res) => {
  try {
    const userCount = await getOne('SELECT COUNT(*) as total FROM users');
    const workoutCount = await getOne('SELECT COUNT(*) as total FROM workout_logs');
    const caloriesCount = await getOne('SELECT SUM(calories_burned) as total FROM workout_logs');
    const challengeCount = await getOne('SELECT COUNT(*) as total FROM challenges');

    return res.json({
      totalUsers: userCount ? userCount.total : 0,
      totalWorkoutsLogged: workoutCount ? workoutCount.total : 0,
      totalCaloriesBurned: (caloriesCount && caloriesCount.total) ? caloriesCount.total : 0,
      activeChallenges: challengeCount ? challengeCount.total : 0
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch admin stats.' });
  }
});

// View All Users
router.get('/users', async (req, res) => {
  try {
    const users = await query(`
      SELECT u.id, u.name, u.email, u.role, u.is_verified, u.created_at,
             p.age, p.gender, p.fitness_level, p.weight_kg, g.goal_type
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      LEFT JOIN goals g ON u.id = g.user_id
      ORDER BY u.created_at DESC
    `);
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch users list.' });
  }
});

// Add Exercise Template
router.post('/templates/workout', async (req, res) => {
  try {
    const { name, muscle_group, equipment, difficulty, instructions, substitutes, category } = req.body;
    await run(
      `INSERT INTO exercise_templates (name, muscle_group, equipment, difficulty, instructions, substitutes, category) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, muscle_group, equipment, difficulty, instructions, substitutes, category || 'gym']
    );
    return res.json({ message: 'Exercise template created successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create exercise template.' });
  }
});

// Add Meal Template
router.post('/templates/meal', async (req, res) => {
  try {
    const { goal_type, diet_type, meal_type, name, calories, protein, carbs, fats, ingredients, is_indian } = req.body;
    await run(
      `INSERT INTO meal_plans (goal_type, diet_type, meal_type, name, calories, protein, carbs, fats, ingredients, is_indian) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [goal_type, diet_type, meal_type, name, parseInt(calories) || 0, parseInt(protein) || 0, parseInt(carbs) || 0, parseInt(fats) || 0, ingredients, is_indian ? 1 : 0]
    );
    return res.json({ message: 'Meal template created successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create meal template.' });
  }
});

// Post Announcement
router.post('/announcements', async (req, res) => {
  try {
    const { title, content, author } = req.body;
    await run(
      `INSERT INTO admin_notes (title, content, author) VALUES (?, ?, ?)`,
      [title, content, author || 'FitPulse Admin']
    );
    return res.json({ message: 'Announcement published successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to publish announcement.' });
  }
});

export default router;
