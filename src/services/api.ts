const API_BASE = '/api';

function getHeaders() {
  const token = localStorage.getItem('fitpulse_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function handleResponse(res: Response) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'API Request failed');
  }
  return data;
}

export const api = {
  // Auth
  register: (body: any) => fetch(`${API_BASE}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(handleResponse),
  login: (body: any) => fetch(`${API_BASE}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(handleResponse),
  forgotPassword: (body: any) => fetch(`${API_BASE}/auth/forgot-password`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(handleResponse),
  resetPassword: (body: any) => fetch(`${API_BASE}/auth/reset-password`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(handleResponse),
  getMe: () => fetch(`${API_BASE}/auth/me`, { headers: getHeaders() }).then(handleResponse),

  // Onboarding
  saveOnboarding: (body: any) => fetch(`${API_BASE}/onboarding/save`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),

  // Workouts
  getMyPlan: () => fetch(`${API_BASE}/workouts/my-plan`, { headers: getHeaders() }).then(handleResponse),
  logWorkout: (body: any) => fetch(`${API_BASE}/workouts/log`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  getWorkoutHistory: () => fetch(`${API_BASE}/workouts/history`, { headers: getHeaders() }).then(handleResponse),
  getExerciseTemplates: (params: string = '') => fetch(`${API_BASE}/workouts/templates?${params}`, { headers: getHeaders() }).then(handleResponse),
  getExerciseSubstitutes: (name: string) => fetch(`${API_BASE}/workouts/substitutes/${encodeURIComponent(name)}`, { headers: getHeaders() }).then(handleResponse),

  // Nutrition
  getMealPlan: (params: string = '') => fetch(`${API_BASE}/nutrition/plan?${params}`, { headers: getHeaders() }).then(handleResponse),
  logMeal: (body: any) => fetch(`${API_BASE}/nutrition/log-meal`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  logWater: (amount_ml: number) => fetch(`${API_BASE}/nutrition/log-water`, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ amount_ml }) }).then(handleResponse),
  getTodayNutrition: () => fetch(`${API_BASE}/nutrition/today`, { headers: getHeaders() }).then(handleResponse),
  getGroceryList: () => fetch(`${API_BASE}/nutrition/grocery-list`, { headers: getHeaders() }).then(handleResponse),

  // Progress & Trackers
  getProgressSummary: () => fetch(`${API_BASE}/progress/summary`, { headers: getHeaders() }).then(handleResponse),
  logBodyMeasurements: (body: any) => fetch(`${API_BASE}/progress/body-measurements`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  getBodyMeasurementsHistory: () => fetch(`${API_BASE}/progress/body-measurements`, { headers: getHeaders() }).then(handleResponse),
  logSleepSteps: (body: any) => fetch(`${API_BASE}/progress/sleep-steps`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  getSleepStepsHistory: () => fetch(`${API_BASE}/progress/sleep-steps`, { headers: getHeaders() }).then(handleResponse),
  saveProgressPhoto: (body: any) => fetch(`${API_BASE}/progress/photos`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  getProgressPhotos: () => fetch(`${API_BASE}/progress/photos`, { headers: getHeaders() }).then(handleResponse),

  // Community
  getChallenges: () => fetch(`${API_BASE}/community/challenges`, { headers: getHeaders() }).then(handleResponse),
  joinChallenge: (challengeId: number) => fetch(`${API_BASE}/community/challenges/join`, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ challengeId }) }).then(handleResponse),
  getLeaderboard: () => fetch(`${API_BASE}/community/leaderboard`, { headers: getHeaders() }).then(handleResponse),
  getTips: () => fetch(`${API_BASE}/community/tips`, { headers: getHeaders() }).then(handleResponse),

  // Admin
  getAdminStats: () => fetch(`${API_BASE}/admin/stats`, { headers: getHeaders() }).then(handleResponse),
  getAdminUsers: () => fetch(`${API_BASE}/admin/users`, { headers: getHeaders() }).then(handleResponse),
  addExerciseTemplate: (body: any) => fetch(`${API_BASE}/admin/templates/workout`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  addMealTemplate: (body: any) => fetch(`${API_BASE}/admin/templates/meal`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  postAnnouncement: (body: any) => fetch(`${API_BASE}/admin/announcements`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),

  // Reminders
  getReminders: () => fetch(`${API_BASE}/reminders`, { headers: getHeaders() }).then(handleResponse),
  toggleReminder: (body: any) => fetch(`${API_BASE}/reminders/toggle`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse)
};
