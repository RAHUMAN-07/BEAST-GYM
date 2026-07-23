import { run, query, getOne } from './database.js';
import bcrypt from 'bcryptjs';

export async function initDb() {
  console.log('Initializing database tables...');

  // 1. Users table
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      avatar TEXT,
      is_verified INTEGER DEFAULT 1,
      reset_token TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. Profiles table
  await run(`
    CREATE TABLE IF NOT EXISTS profiles (
      user_id INTEGER PRIMARY KEY,
      age INTEGER,
      gender TEXT,
      height_cm REAL,
      weight_kg REAL,
      fitness_level TEXT,
      activity_level TEXT,
      body_type TEXT,
      dietary_pref TEXT,
      workout_exp TEXT,
      target_weight_kg REAL,
      target_date TEXT,
      health_restrictions TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 3. Goals table
  await run(`
    CREATE TABLE IF NOT EXISTS goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE,
      goal_type TEXT NOT NULL,
      custom_description TEXT,
      tdee_calories INTEGER,
      target_protein INTEGER,
      target_carbs INTEGER,
      target_fats INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 4. Exercise Templates
  await run(`
    CREATE TABLE IF NOT EXISTS exercise_templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      muscle_group TEXT NOT NULL,
      equipment TEXT,
      difficulty TEXT,
      instructions TEXT,
      substitutes TEXT,
      category TEXT DEFAULT 'gym',
      video_url TEXT
    )
  `);

  // 5. Workouts
  await run(`
    CREATE TABLE IF NOT EXISTS workouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT NOT NULL,
      goal_type TEXT,
      level TEXT,
      type TEXT DEFAULT 'gym',
      duration_mins INTEGER,
      schedule_day TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 6. Workout Exercises
  await run(`
    CREATE TABLE IF NOT EXISTS workout_exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workout_id INTEGER,
      exercise_name TEXT NOT NULL,
      sets INTEGER,
      reps TEXT,
      rest_seconds INTEGER,
      muscle_group TEXT,
      instructions TEXT,
      FOREIGN KEY(workout_id) REFERENCES workouts(id) ON DELETE CASCADE
    )
  `);

  // 7. Workout Logs
  await run(`
    CREATE TABLE IF NOT EXISTS workout_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      workout_id INTEGER,
      workout_title TEXT,
      duration_mins INTEGER,
      calories_burned INTEGER,
      date_logged DATE DEFAULT (DATE('now')),
      notes TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 8. Meal Plans / Templates
  await run(`
    CREATE TABLE IF NOT EXISTS meal_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      goal_type TEXT,
      diet_type TEXT,
      meal_type TEXT,
      name TEXT NOT NULL,
      calories INTEGER,
      protein INTEGER,
      carbs INTEGER,
      fats INTEGER,
      ingredients TEXT,
      is_indian INTEGER DEFAULT 0
    )
  `);

  // 9. Meal Logs
  await run(`
    CREATE TABLE IF NOT EXISTS meal_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      meal_name TEXT NOT NULL,
      meal_type TEXT,
      calories INTEGER,
      protein INTEGER,
      carbs INTEGER,
      fats INTEGER,
      date_logged DATE DEFAULT (DATE('now')),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 10. Water Logs
  await run(`
    CREATE TABLE IF NOT EXISTS water_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      amount_ml INTEGER,
      date_logged DATE DEFAULT (DATE('now')),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 11. Sleep & Step Logs
  await run(`
    CREATE TABLE IF NOT EXISTS sleep_step_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      sleep_hours REAL,
      steps_count INTEGER,
      date_logged DATE DEFAULT (DATE('now')),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 12. Body Measurements
  await run(`
    CREATE TABLE IF NOT EXISTS body_measurements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      weight_kg REAL,
      chest_cm REAL,
      waist_cm REAL,
      hips_cm REAL,
      biceps_cm REAL,
      thighs_cm REAL,
      date_logged DATE DEFAULT (DATE('now')),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 13. Progress Photos
  await run(`
    CREATE TABLE IF NOT EXISTS progress_photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      image_url TEXT,
      notes TEXT,
      date_logged DATE DEFAULT (DATE('now')),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 14. Notifications
  await run(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT,
      message TEXT,
      is_read INTEGER DEFAULT 0,
      type TEXT DEFAULT 'info',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 15. Achievements
  await run(`
    CREATE TABLE IF NOT EXISTS achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      badge_key TEXT,
      title TEXT,
      description TEXT,
      icon TEXT,
      unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 16. Favorites
  await run(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      item_type TEXT,
      item_id INTEGER,
      title TEXT,
      details TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 17. Reminders
  await run(`
    CREATE TABLE IF NOT EXISTS reminders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      reminder_type TEXT,
      time_str TEXT,
      is_enabled INTEGER DEFAULT 1,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 18. Challenges
  await run(`
    CREATE TABLE IF NOT EXISTS challenges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      goal_target TEXT,
      category TEXT,
      participants_count INTEGER DEFAULT 0,
      start_date DATE,
      end_date DATE
    )
  `);

  // 19. Admin Notes / Announcements
  await run(`
    CREATE TABLE IF NOT EXISTS admin_notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author TEXT DEFAULT 'FitPulse Admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await seedData();
  console.log('Database initialization completed.');
}

async function seedData() {
  // Check if admin user exists
  const existingAdmin = await getOne(`SELECT * FROM users WHERE email = 'admin@fitpulse.com'`);
  if (!existingAdmin) {
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const result = await run(
      `INSERT INTO users (name, email, password_hash, role, is_verified) VALUES (?, ?, ?, ?, ?)`,
      ['FitPulse Admin', 'admin@fitpulse.com', adminPasswordHash, 'admin', 1]
    );
    const adminId = result.id;
    await run(`INSERT INTO profiles (user_id, age, gender, height_cm, weight_kg, fitness_level, activity_level, body_type, dietary_pref, workout_exp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [adminId, 30, 'male', 180, 80, 'advanced', 'active', 'mesomorph', 'flexitarian', 'advanced']
    );
    await run(`INSERT INTO goals (user_id, goal_type, tdee_calories, target_protein, target_carbs, target_fats) VALUES (?, ?, ?, ?, ?, ?)`,
      [adminId, 'maintenance', 2600, 160, 260, 70]
    );
  }

  // Seed Demo User
  const existingDemoUser = await getOne(`SELECT * FROM users WHERE email = 'john@example.com'`);
  if (!existingDemoUser) {
    const demoPasswordHash = await bcrypt.hash('password123', 10);
    const res = await run(
      `INSERT INTO users (name, email, password_hash, role, is_verified) VALUES (?, ?, ?, ?, ?)`,
      ['John Doe', 'john@example.com', demoPasswordHash, 'user', 1]
    );
    const userId = res.id;
    await run(`INSERT INTO profiles (user_id, age, gender, height_cm, weight_kg, fitness_level, activity_level, body_type, dietary_pref, workout_exp, target_weight_kg, target_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, 26, 'male', 178, 76, 'intermediate', 'moderate', 'mesomorph', 'vegetarian', 'intermediate', 80, '2026-12-31']
    );
    await run(`INSERT INTO goals (user_id, goal_type, tdee_calories, target_protein, target_carbs, target_fats) VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, 'bulking', 2800, 170, 310, 75]
    );
    // Seed sample logs for demo user
    await run(`INSERT INTO water_logs (user_id, amount_ml) VALUES (?, 1750)`, [userId]);
    await run(`INSERT INTO sleep_step_logs (user_id, sleep_hours, steps_count) VALUES (?, 7.5, 8420)`, [userId]);
    await run(`INSERT INTO body_measurements (user_id, weight_kg, chest_cm, waist_cm, hips_cm, biceps_cm, thighs_cm) VALUES (?, 76, 102, 82, 98, 38, 58)`, [userId]);
    await run(`INSERT INTO achievements (user_id, badge_key, title, description, icon) VALUES 
      (?, 'first_step', 'First Step', 'Registered and set up your fitness profile', '🏆'),
      (?, 'water_warrior', 'Hydration Hero', 'Logged over 2,000ml of water in a day', '💧')
    `, [userId, userId]);
  }

  // Seed Exercise Templates
  const countExercises = await getOne(`SELECT COUNT(*) as count FROM exercise_templates`);
  if (countExercises.count === 0) {
    const exercises = [
      // Chest
      ['Barbell Bench Press', 'Chest', 'Barbell', 'Intermediate', 'Lie flat on bench, lower bar to mid-chest, drive upward explosively.', 'Dumbbell Bench Press, Push-ups', 'gym'],
      ['Incline Dumbbell Press', 'Chest', 'Dumbbells', 'Intermediate', 'Set bench to 30 degrees, press dumbbells upward over upper chest.', 'Barbell Incline Press, Decline Push-ups', 'gym'],
      ['Standard Push-Ups', 'Chest', 'Bodyweight', 'Beginner', 'Keep body in straight line, lower chest to floor and push up.', 'Knee Push-ups, Incline Push-ups', 'home'],
      // Back
      ['Lat Pulldown', 'Back', 'Cable Machine', 'Beginner', 'Pull bar down to upper chest while keeping spine tall and chest up.', 'Pull-ups, Resistance Band Pulldown', 'gym'],
      ['Barbell Bent-Over Row', 'Back', 'Barbell', 'Intermediate', 'Hinge at hips 45 deg, pull bar to lower belly button.', 'Dumbbell Rows, Inverted Rows', 'gym'],
      ['Bodyweight Pull-ups', 'Back', 'Bodyweight', 'Intermediate', 'Grip bar shoulder-width, pull chin above bar, lower smoothly.', 'Assisted Pull-ups, Lat Pulldown', 'home'],
      // Legs
      ['Barbell Squat', 'Legs', 'Barbell', 'Intermediate', 'Keep back neutral, lower hips below knees, drive through heels.', 'Goblet Squat, Leg Press', 'gym'],
      ['Bulgarian Split Squat', 'Legs', 'Dumbbells', 'Intermediate', 'Place rear foot on bench, lower front leg to 90 degrees.', 'Lunges, Step-ups', 'gym'],
      ['Bodyweight Air Squats', 'Legs', 'Bodyweight', 'Beginner', 'Stand feet shoulder-width, squat back like sitting in a chair.', 'Wall Sits, Jump Squats', 'home'],
      // Shoulders
      ['Overhead Dumbbell Press', 'Shoulders', 'Dumbbells', 'Beginner', 'Press dumbbells overhead from shoulder height without arching lower back.', 'Barbell Military Press, Pike Push-ups', 'gym'],
      ['Pike Push-Ups', 'Shoulders', 'Bodyweight', 'Intermediate', 'Elevate hips into inverted V-shape, lower top of head toward floor.', 'Overhead Press, Elevated Pike Press', 'home'],
      // Arms
      ['Barbell Bicep Curl', 'Biceps', 'Barbell', 'Beginner', 'Keep elbows pinned to sides, curl bar toward shoulders.', 'Dumbbell Curls, Hammer Curls', 'gym'],
      ['Tricep Rope Pushdown', 'Triceps', 'Cable', 'Beginner', 'Extend arms downward and flair rope ends outward at full extension.', 'Dumbbell Kickbacks, Dips', 'gym'],
      ['Chair / Bench Dips', 'Triceps', 'Bodyweight', 'Beginner', 'Lower body off edge of bench bending elbows to 90 degrees.', 'Diamond Push-ups, Tricep Extension', 'home'],
      // Core & Cardio
      ['Plank Hold', 'Core', 'Bodyweight', 'Beginner', 'Hold rigid push-up position on forearms, contract abs tightly.', 'Side Plank, Mountain Climbers', 'home'],
      ['Burpees', 'Full Body', 'Bodyweight', 'Intermediate', 'Squat, kick feet back to plank, perform push-up, jump up explosively.', 'Jumping Jacks, Mountain Climbers', 'home'],
    ];

    for (const ex of exercises) {
      await run(`INSERT INTO exercise_templates (name, muscle_group, equipment, difficulty, instructions, substitutes, category) VALUES (?, ?, ?, ?, ?, ?, ?)`, ex);
    }
  }

  // Seed Meal Templates (Including Indian Veg/Non-Veg options)
  const countMeals = await getOne(`SELECT COUNT(*) as count FROM meal_plans`);
  if (countMeals.count === 0) {
    const meals = [
      // High Protein / Bulking / Indian
      ['bulking', 'vegetarian', 'breakfast', 'Oats with Paneer Bhurji & Almond Milk', 580, 32, 70, 18, 'Oats, Cottage Cheese (Paneer), Almond Milk, Turmeric, Bell Peppers', 1],
      ['bulking', 'non-vegetarian', 'breakfast', 'Scrambled Eggs with Multigrain Paratha & Avocado', 650, 38, 65, 24, 'Whole Eggs, Whole Wheat Paratha, Avocado, Spices', 1],
      ['bulking', 'vegetarian', 'lunch', 'Rajma Chawal with Tofu Curry & Cucumber Salad', 720, 35, 95, 16, 'Kidney Beans, Basmati Rice, Tofu, Tomato Onion Gravy', 1],
      ['bulking', 'non-vegetarian', 'lunch', 'Grilled Chicken Tikka with Steamed Brown Rice & Dal Makhani', 780, 52, 85, 20, 'Chicken Breast, Indian Spices, Brown Rice, Black Lentils', 1],
      ['bulking', 'vegetarian', 'dinner', 'Paneer Tikka Roll with Greek Yogurt & Soya Chunks Curry', 640, 42, 60, 22, 'Paneer, Whole Wheat Wrap, Soya Chunks, Mint Chutney', 1],
      ['bulking', 'non-vegetarian', 'dinner', 'Egg Curry with Whole Wheat Roti & Mixed Veg Sprouts', 610, 40, 55, 20, 'Boiled Eggs, Curry Gravy, Chapatis, Mung Bean Sprouts', 1],

      // Weight Loss / Cutting
      ['weight_loss', 'vegetarian', 'breakfast', 'Moong Dal Chela with Paneer Stuffing', 360, 22, 40, 10, 'Split Yellow Lentils, Paneer, Coriander, Green Chilies', 1],
      ['weight_loss', 'non-vegetarian', 'breakfast', 'Egg White Omelette with Spinach & Whole Toast', 320, 28, 25, 8, 'Egg Whites, Spinach, Tomatoes, Whole Wheat Bread', 0],
      ['weight_loss', 'vegetarian', 'lunch', 'Soya Chunks Bhurji with Brown Rice & Tadka Dal', 440, 36, 50, 9, 'Defatted Soya Chunks, Yellow Lentils, Brown Rice, Spices', 1],
      ['weight_loss', 'non-vegetarian', 'lunch', 'Tandoori Grilled Chicken Bowl with Quinoa Salad', 460, 48, 38, 10, 'Chicken Breast, Quinoa, Cucumber, Lemon Juice', 1],
      ['weight_loss', 'vegetarian', 'dinner', 'Grilled Tofu Stir-Fry with Broccoli & Cauliflower Rice', 350, 28, 22, 12, 'Tofu, Broccoli, Bell Peppers, Cauliflower, Soy Sauce', 0],
      ['weight_loss', 'non-vegetarian', 'dinner', 'Lemon Herb Fish Fillet with Roasted Vegetables', 380, 42, 18, 14, 'White Fish, Asparagus, Carrots, Olive Oil, Herbs', 0],

      // Snacks
      ['maintenance', 'vegetarian', 'snack', 'Roasted Chana & Pumpkin Seeds with Green Tea', 220, 12, 28, 6, 'Roasted Chickpeas, Roasted Seeds, Green Tea', 1],
      ['bulking', 'vegetarian', 'snack', 'Peanut Butter Shake with Whey Protein & Banana', 450, 35, 45, 14, 'Whey Protein, Milk, Banana, Peanut Butter', 0],
    ];

    for (const m of meals) {
      await run(`INSERT INTO meal_plans (goal_type, diet_type, meal_type, name, calories, protein, carbs, fats, ingredients, is_indian) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, m);
    }
  }

  // Seed Challenges
  const countChallenges = await getOne(`SELECT COUNT(*) as count FROM challenges`);
  if (countChallenges.count === 0) {
    await run(`INSERT INTO challenges (title, description, goal_target, category, participants_count, start_date, end_date) VALUES
      ('30-Day Shred Challenge', 'Burn 15,000 extra calories and log workouts consistently for 30 days.', '15000 kcal', 'Weight Loss', 342, '2026-07-01', '2026-07-31'),
      ('10,000 Steps Daily Quest', 'Walk at least 10,000 steps every day for 2 weeks straight.', '140,000 steps', 'Cardio', 512, '2026-07-10', '2026-07-24'),
      ('Hydration Hero Sprint', 'Drink 3.0 Liters of water every day for 7 consecutive days.', '21.0 Liters', 'Wellness', 628, '2026-07-15', '2026-07-22')
    `);
  }

  // Seed Admin Announcements
  const countAnnouncements = await getOne(`SELECT COUNT(*) as count FROM admin_notes`);
  if (countAnnouncements.count === 0) {
    await run(`INSERT INTO admin_notes (title, content, author) VALUES
      ('Welcome to FitPulse Pro!', 'Track your workouts, stay on top of your macros with our Indian & Global food options, and hit your fitness targets!', 'Coach Alex'),
      ('New Home Workout Routines Added', 'Check out our new Bodyweight & HIIT home routines designed for high performance without equipment.', 'FitPulse Team')
    `);
  }
}
