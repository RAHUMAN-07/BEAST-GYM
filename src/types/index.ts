export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
}

export interface Profile {
  user_id: number;
  age: number;
  gender: string;
  height_cm: number;
  weight_kg: number;
  fitness_level: 'beginner' | 'intermediate' | 'advanced';
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  body_type: string;
  dietary_pref: 'vegetarian' | 'non-vegetarian' | 'vegan' | 'flexitarian';
  workout_exp: string;
  target_weight_kg?: number;
  target_date?: string;
  health_restrictions?: string;
}

export interface Goal {
  id: number;
  user_id: number;
  goal_type: 'bulking' | 'weight_loss' | 'cutting' | 'strength' | 'cardio' | 'maintenance' | 'flexibility' | 'endurance' | 'custom';
  custom_description?: string;
  tdee_calories: number;
  target_protein: number;
  target_carbs: number;
  target_fats: number;
}

export interface Exercise {
  id: number;
  name: string;
  muscle_group: string;
  equipment: string;
  difficulty: string;
  instructions: string;
  substitutes: string;
  category: 'gym' | 'home';
  video_url?: string;
}

export interface WorkoutExercise {
  id: number;
  workout_id: number;
  exercise_name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  muscle_group: string;
  instructions: string;
}

export interface Workout {
  id: number;
  user_id: number;
  title: string;
  goal_type: string;
  level: string;
  type: 'gym' | 'home';
  duration_mins: number;
  schedule_day: string;
  exercises?: WorkoutExercise[];
}

export interface Meal {
  id: number;
  goal_type: string;
  diet_type: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: string;
  is_indian: number;
}

export interface MealLog {
  id: number;
  user_id: number;
  meal_name: string;
  meal_type: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  date_logged: string;
}

export interface Achievement {
  id: number;
  badge_key: string;
  title: string;
  description: string;
  icon: string;
  unlocked_at: string;
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  goal_target: string;
  category: string;
  participants_count: number;
  start_date: string;
  end_date: string;
}

export interface Reminder {
  id: number;
  reminder_type: 'workout' | 'water' | 'meal' | 'sleep';
  time_str: string;
  is_enabled: number;
}
