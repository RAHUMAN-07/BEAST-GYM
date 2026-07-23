import express from 'express';
import { run, query, getOne } from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get Recommended Meal Plan
router.get('/plan', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await getOne('SELECT * FROM profiles WHERE user_id = ?', [userId]);
    const goal = await getOne('SELECT * FROM goals WHERE user_id = ?', [userId]);

    const dietType = (profile && profile.dietary_pref) ? profile.dietary_pref.toLowerCase() : 'all';
    const goalType = (goal && goal.goal_type) ? goal.goal_type : 'maintenance';
    const { isIndianOnly } = req.query;

    let sql = 'SELECT * FROM meal_plans WHERE 1=1';
    const params = [];

    if (dietType !== 'all' && dietType !== 'flexitarian') {
      sql += ' AND (diet_type = ? OR diet_type = "vegetarian")';
      params.push(dietType);
    }

    if (isIndianOnly === 'true') {
      sql += ' AND is_indian = 1';
    }

    const meals = await query(sql, params);

    // Group meals by category (breakfast, lunch, dinner, snack)
    const grouped = {
      breakfast: meals.filter(m => m.meal_type === 'breakfast'),
      lunch: meals.filter(m => m.meal_type === 'lunch'),
      dinner: meals.filter(m => m.meal_type === 'dinner'),
      snack: meals.filter(m => m.meal_type === 'snack')
    };

    return res.json({
      targetGoal: goal,
      meals: grouped,
      allMeals: meals
    });
  } catch (err) {
    console.error('Meal plan error:', err);
    return res.status(500).json({ error: 'Failed to fetch meal plan.' });
  }
});

// Log Consumed Meal
router.post('/log-meal', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { meal_name, meal_type, calories, protein, carbs, fats } = req.body;

    if (!meal_name || calories === undefined) {
      return res.status(400).json({ error: 'Meal name and calories required.' });
    }

    const result = await run(
      `INSERT INTO meal_logs (user_id, meal_name, meal_type, calories, protein, carbs, fats) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, meal_name, meal_type || 'snack', parseInt(calories) || 0, parseInt(protein) || 0, parseInt(carbs) || 0, parseInt(fats) || 0]
    );

    return res.json({ message: 'Meal logged successfully!', logId: result.id });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to log meal.' });
  }
});

// Log Water Intake
router.post('/log-water', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount_ml } = req.body;
    const amount = parseInt(amount_ml) || 250;

    await run(`INSERT INTO water_logs (user_id, amount_ml) VALUES (?, ?)`, [userId, amount]);

    // Check today total water
    const totalRow = await getOne(
      `SELECT SUM(amount_ml) as total FROM water_logs WHERE user_id = ? AND date_logged = DATE('now')`,
      [userId]
    );
    const totalMl = totalRow ? totalRow.total : 0;

    if (totalMl >= 2000) {
      // Award water badge if not unlocked
      const existing = await getOne(`SELECT * FROM achievements WHERE user_id = ? AND badge_key = 'water_warrior'`, [userId]);
      if (!existing) {
        await run(`INSERT INTO achievements (user_id, badge_key, title, description, icon) VALUES (?, 'water_warrior', 'Hydration Hero', 'Logged over 2,000ml of water in a day', '💧')`, [userId]);
      }
    }

    return res.json({ message: 'Water logged!', totalMl });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to log water.' });
  }
});

// Today's Nutrition Summary
router.get('/today', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const goal = await getOne('SELECT * FROM goals WHERE user_id = ?', [userId]);

    const mealsToday = await query(
      `SELECT * FROM meal_logs WHERE user_id = ? AND date_logged = DATE('now') ORDER BY id DESC`,
      [userId]
    );

    const totals = mealsToday.reduce((acc, m) => {
      acc.calories += m.calories || 0;
      acc.protein += m.protein || 0;
      acc.carbs += m.carbs || 0;
      acc.fats += m.fats || 0;
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

    const waterRow = await getOne(
      `SELECT SUM(amount_ml) as total FROM water_logs WHERE user_id = ? AND date_logged = DATE('now')`,
      [userId]
    );

    return res.json({
      goal: goal || { tdee_calories: 2200, target_protein: 140, target_carbs: 220, target_fats: 60 },
      totals,
      waterMl: waterRow && waterRow.total ? waterRow.total : 0,
      mealsToday
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch daily nutrition summary.' });
  }
});

// Generate Grocery List
router.get('/grocery-list', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await getOne('SELECT * FROM profiles WHERE user_id = ?', [userId]);
    const dietType = (profile && profile.dietary_pref) ? profile.dietary_pref.toLowerCase() : 'all';

    let meals = await query('SELECT ingredients FROM meal_plans');
    const ingredientSet = new Set();

    meals.forEach(m => {
      if (m.ingredients) {
        m.ingredients.split(',').forEach(item => {
          ingredientSet.add(item.trim());
        });
      }
    });

    return res.json({
      items: Array.from(ingredientSet),
      count: ingredientSet.size
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to generate grocery list.' });
  }
});

export default router;
