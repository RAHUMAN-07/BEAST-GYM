import express from 'express';
import { run, query, getOne } from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/save', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      age, gender, height_cm, weight_kg, fitness_level,
      activity_level, body_type, dietary_pref, workout_exp,
      goal_type, custom_goal, target_weight_kg, target_date,
      health_restrictions, workout_setting // 'gym' or 'home'
    } = req.body;

    const ageNum = parseInt(age) || 25;
    const heightNum = parseFloat(height_cm) || 175;
    const weightNum = parseFloat(weight_kg) || 70;
    const isMale = (gender || 'male').toLowerCase() === 'male';

    // 1. Calculate BMR using Mifflin-St Jeor
    let bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + (isMale ? 5 : -161);

    // 2. Activity Multiplier
    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    const actMult = multipliers[activity_level] || 1.4;
    let tdee = Math.round(bmr * actMult);

    // 3. Goal Adjustment
    let targetCalories = tdee;
    if (goal_type === 'bulking') targetCalories += 450;
    else if (goal_type === 'weight_loss') targetCalories -= 500;
    else if (goal_type === 'cutting') targetCalories -= 400;
    else if (goal_type === 'strength') targetCalories += 250;
    else if (goal_type === 'cardio') targetCalories -= 300;

    targetCalories = Math.max(1200, Math.round(targetCalories));

    // 4. Calculate Macros
    // Protein: ~2.0g per kg body weight
    const proteinGrams = Math.round(weightNum * (goal_type === 'bulking' || goal_type === 'cutting' ? 2.2 : 1.8));
    const proteinCal = proteinGrams * 4;

    // Fat: 25% of target calories
    const fatCal = targetCalories * 0.25;
    const fatGrams = Math.round(fatCal / 9);

    // Carbs: Remaining calories
    const carbCal = Math.max(0, targetCalories - (proteinCal + fatCal));
    const carbGrams = Math.round(carbCal / 4);

    // 5. Save or Update Profile
    await run(`
      INSERT INTO profiles (
        user_id, age, gender, height_cm, weight_kg, fitness_level,
        activity_level, body_type, dietary_pref, workout_exp,
        target_weight_kg, target_date, health_restrictions
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
        age=excluded.age, gender=excluded.gender, height_cm=excluded.height_cm,
        weight_kg=excluded.weight_kg, fitness_level=excluded.fitness_level,
        activity_level=excluded.activity_level, body_type=excluded.body_type,
        dietary_pref=excluded.dietary_pref, workout_exp=excluded.workout_exp,
        target_weight_kg=excluded.target_weight_kg, target_date=excluded.target_date,
        health_restrictions=excluded.health_restrictions
    `, [
      userId, ageNum, gender, heightNum, weightNum, fitness_level,
      activity_level, body_type, dietary_pref, workout_exp,
      target_weight_kg ? parseFloat(target_weight_kg) : null,
      target_date, health_restrictions
    ]);

    // 6. Save or Update Goal
    await run(`
      INSERT INTO goals (user_id, goal_type, custom_description, tdee_calories, target_protein, target_carbs, target_fats)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
        goal_type=excluded.goal_type, custom_description=excluded.custom_description,
        tdee_calories=excluded.tdee_calories, target_protein=excluded.target_protein,
        target_carbs=excluded.target_carbs, target_fats=excluded.target_fats
    `, [userId, goal_type || 'maintenance', custom_goal || '', targetCalories, proteinGrams, carbGrams, fatGrams]);

    // 7. Initial Weight & Body measurement log
    await run(`INSERT INTO body_measurements (user_id, weight_kg) VALUES (?, ?)`, [userId, weightNum]);

    // 8. Auto-generate Workout Plan for user
    await generateInitialWorkouts(userId, goal_type, fitness_level || 'beginner', workout_setting || 'gym');

    // 9. Unlock Onboarding Badge
    await run(`INSERT INTO achievements (user_id, badge_key, title, description, icon) VALUES (?, 'onboarded', 'Journey Begun', 'Completed full fitness profile setup', '🚀')`, [userId]);

    return res.json({
      message: 'Onboarding completed successfully!',
      summary: {
        tdee: targetCalories,
        proteinGrams,
        carbGrams,
        fatGrams,
        bmr: Math.round(bmr)
      }
    });
  } catch (err) {
    console.error('Onboarding save error:', err);
    return res.status(500).json({ error: 'Failed to save onboarding data.' });
  }
});

async function generateInitialWorkouts(userId, goalType, level, setting) {
  // Clear old generated workouts for user
  const oldWorkouts = await query('SELECT id FROM workouts WHERE user_id = ?', [userId]);
  for (const w of oldWorkouts) {
    await run('DELETE FROM workout_exercises WHERE workout_id = ?', [w.id]);
  }
  await run('DELETE FROM workouts WHERE user_id = ?', [userId]);

  const categoryFilter = setting === 'home' ? 'home' : 'gym';
  const availableExercises = await query('SELECT * FROM exercise_templates WHERE category = ? OR category = "home"', [categoryFilter]);

  const days = [
    { title: 'Push Day (Chest, Shoulders & Triceps)', muscleGroup: ['Chest', 'Shoulders', 'Triceps'] },
    { title: 'Pull Day (Back & Biceps)', muscleGroup: ['Back', 'Biceps'] },
    { title: 'Legs & Core Crusher', muscleGroup: ['Legs', 'Core', 'Full Body'] }
  ];

  for (const d of days) {
    const res = await run(`INSERT INTO workouts (user_id, title, goal_type, level, type, duration_mins, schedule_day) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, d.title, goalType, level, setting, 45, d.title.split(' ')[0]]
    );
    const workoutId = res.id;

    // Filter matching exercises
    const matched = availableExercises.filter(ex => d.muscleGroup.includes(ex.muscle_group));
    const selected = matched.length > 0 ? matched : availableExercises.slice(0, 3);

    for (const ex of selected) {
      const sets = level === 'advanced' ? 4 : 3;
      const reps = goalType === 'strength' ? '6-8' : goalType === 'bulking' ? '8-12' : '12-15';
      const rest = goalType === 'strength' ? 120 : 60;

      await run(`INSERT INTO workout_exercises (workout_id, exercise_name, sets, reps, rest_seconds, muscle_group, instructions) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [workoutId, ex.name, sets, reps, rest, ex.muscle_group, ex.instructions]
      );
    }
  }
}

export default router;
