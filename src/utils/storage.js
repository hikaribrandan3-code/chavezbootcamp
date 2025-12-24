/**
 * Chavez Bootcamp - Local Storage Utilities
 * Persistent data layer for user profile, workouts, progress, and settings
 */

const STORAGE_KEYS = {
  USER_PROFILE: 'chavez_user_profile',
  WORKOUT_PLAN: 'chavez_workout_plan',
  WORKOUT_HISTORY: 'chavez_workout_history',
  WEIGHT_LOGS: 'chavez_weight_logs',
  PROGRESS_PHOTOS: 'chavez_progress_photos',
  BADGES: 'chavez_badges',
  STREAK: 'chavez_streak',
  SETTINGS: 'chavez_settings',
  CHAT_HISTORY: 'chavez_chat_history'
};

// ========================================
// GENERIC HELPERS
// ========================================

function getItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key}:`, e);
    return defaultValue;
  }
}

function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error(`Error writing ${key}:`, e);
    return false;
  }
}

// ========================================
// USER PROFILE
// ========================================

export function getUserProfile() {
  return getItem(STORAGE_KEYS.USER_PROFILE, null);
}

export function setUserProfile(profile) {
  const withTimestamp = {
    ...profile,
    createdAt: profile.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  return setItem(STORAGE_KEYS.USER_PROFILE, withTimestamp);
}

export function hasCompletedOnboarding() {
  const profile = getUserProfile();
  return profile !== null && profile.onboardingComplete === true;
}

export function clearUserProfile() {
  localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
}

// ========================================
// WORKOUT PLAN
// ========================================

export function getWorkoutPlan() {
  return getItem(STORAGE_KEYS.WORKOUT_PLAN, null);
}

export function setWorkoutPlan(plan) {
  return setItem(STORAGE_KEYS.WORKOUT_PLAN, {
    ...plan,
    generatedAt: new Date().toISOString(),
    weekNumber: plan.weekNumber || 1
  });
}

export function getTodaysWorkout() {
  const plan = getWorkoutPlan();
  if (!plan || !plan.workouts) return null;
  
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
  return plan.workouts.find(w => w.day.toLowerCase() === dayNames[dayOfWeek]) || null;
}

// ========================================
// WORKOUT HISTORY
// ========================================

export function getWorkoutHistory() {
  return getItem(STORAGE_KEYS.WORKOUT_HISTORY, []);
}

export function logCompletedWorkout(workout) {
  const history = getWorkoutHistory();
  const entry = {
    ...workout,
    completedAt: new Date().toISOString(),
    id: `workout_${Date.now()}`
  };
  history.push(entry);
  setItem(STORAGE_KEYS.WORKOUT_HISTORY, history);
  
  // Update streak
  updateStreak();
  
  // Check for badge unlocks
  checkBadgeUnlocks();
  
  return entry;
}

export function getWorkoutsCompletedThisWeek() {
  const history = getWorkoutHistory();
  const startOfWeek = getStartOfWeek(new Date());
  
  return history.filter(w => {
    const completedDate = new Date(w.completedAt);
    return completedDate >= startOfWeek;
  }).length;
}

export function getTotalWorkoutsCompleted() {
  return getWorkoutHistory().length;
}

// ========================================
// WEIGHT LOGS
// ========================================

export function getWeightLogs() {
  return getItem(STORAGE_KEYS.WEIGHT_LOGS, []);
}

export function logWeight(weight, notes = '') {
  const logs = getWeightLogs();
  const entry = {
    weight: parseFloat(weight),
    notes,
    loggedAt: new Date().toISOString(),
    id: `weight_${Date.now()}`
  };
  logs.push(entry);
  setItem(STORAGE_KEYS.WEIGHT_LOGS, logs);
  
  // Check for weight-related badge unlocks
  checkBadgeUnlocks();
  
  return entry;
}

export function getLatestWeight() {
  const logs = getWeightLogs();
  if (logs.length === 0) {
    const profile = getUserProfile();
    return profile?.currentWeight || null;
  }
  return logs[logs.length - 1].weight;
}

export function getWeightProgress() {
  const profile = getUserProfile();
  if (!profile) return null;
  
  const startWeight = profile.currentWeight;
  const goalWeight = profile.goalWeight;
  const currentWeight = getLatestWeight() || startWeight;
  
  const totalToLose = startWeight - goalWeight;
  const actuallyLost = startWeight - currentWeight;
  
  if (totalToLose === 0) return 100;
  
  const percentage = Math.round((actuallyLost / totalToLose) * 100);
  return Math.max(0, Math.min(100, percentage));
}

// ========================================
// PROGRESS PHOTOS
// ========================================

export function getProgressPhotos() {
  return getItem(STORAGE_KEYS.PROGRESS_PHOTOS, []);
}

export function saveProgressPhoto(photoData, type = 'progress') {
  const photos = getProgressPhotos();
  const entry = {
    id: `photo_${Date.now()}`,
    data: photoData,
    type,
    takenAt: new Date().toISOString(),
    streakDay: getCurrentStreak()
  };
  photos.push(entry);
  setItem(STORAGE_KEYS.PROGRESS_PHOTOS, photos);
  return entry;
}

// ========================================
// STREAK TRACKING
// ========================================

export function getStreakData() {
  return getItem(STORAGE_KEYS.STREAK, {
    currentStreak: 0,
    longestStreak: 0,
    lastWorkoutDate: null
  });
}

export function getCurrentStreak() {
  return getStreakData().currentStreak;
}

export function updateStreak() {
  const streakData = getStreakData();
  const today = new Date().toDateString();
  const lastWorkout = streakData.lastWorkoutDate;
  
  if (lastWorkout === today) {
    // Already worked out today
    return streakData;
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  let newStreak = 1;
  if (lastWorkout === yesterday.toDateString()) {
    // Consecutive day, increment streak
    newStreak = streakData.currentStreak + 1;
  }
  
  const updatedData = {
    currentStreak: newStreak,
    longestStreak: Math.max(streakData.longestStreak, newStreak),
    lastWorkoutDate: today
  };
  
  setItem(STORAGE_KEYS.STREAK, updatedData);
  return updatedData;
}

function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

// ========================================
// BADGES & ACHIEVEMENTS
// ========================================

const BADGE_DEFINITIONS = [
  { id: 'first_workout', name: 'First Blood', description: 'Completed your first workout', icon: '🎖️' },
  { id: 'streak_3', name: 'Hat Trick', description: '3-day workout streak', icon: '🔥' },
  { id: 'streak_7', name: 'Week Warrior', description: '7-day workout streak', icon: '⚔️' },
  { id: 'streak_30', name: 'Iron Discipline', description: '30-day workout streak', icon: '🏆' },
  { id: 'workouts_10', name: 'Committed', description: 'Completed 10 workouts', icon: '💪' },
  { id: 'workouts_50', name: 'Seasoned', description: 'Completed 50 workouts', icon: '🎯' },
  { id: 'workouts_100', name: 'Centurion', description: 'Completed 100 workouts', icon: '⭐' },
  { id: 'lost_5', name: 'First 5 Down', description: 'Lost 5 lbs', icon: '📉' },
  { id: 'lost_10', name: 'Double Digits', description: 'Lost 10 lbs', icon: '🔻' },
  { id: 'lost_20', name: 'Transformation', description: 'Lost 20 lbs', icon: '🦅' },
  { id: 'goal_25', name: 'Quarter Way', description: '25% to goal weight', icon: '🎖️' },
  { id: 'goal_50', name: 'Halfway Hero', description: '50% to goal weight', icon: '🥈' },
  { id: 'goal_75', name: 'Almost There', description: '75% to goal weight', icon: '🥇' },
  { id: 'goal_100', name: 'Mission Complete', description: 'Reached goal weight!', icon: '🏅' }
];

export function getBadges() {
  return getItem(STORAGE_KEYS.BADGES, []);
}

export function getAllBadgeDefinitions() {
  return BADGE_DEFINITIONS;
}

export function unlockBadge(badgeId) {
  const badges = getBadges();
  if (badges.includes(badgeId)) return false;
  
  badges.push(badgeId);
  setItem(STORAGE_KEYS.BADGES, badges);
  
  // Return badge info for celebration
  return BADGE_DEFINITIONS.find(b => b.id === badgeId);
}

export function hasBadge(badgeId) {
  return getBadges().includes(badgeId);
}

function checkBadgeUnlocks() {
  const totalWorkouts = getTotalWorkoutsCompleted();
  const streak = getCurrentStreak();
  const profile = getUserProfile();
  const currentWeight = getLatestWeight();
  
  // Workout count badges
  if (totalWorkouts >= 1 && !hasBadge('first_workout')) unlockBadge('first_workout');
  if (totalWorkouts >= 10 && !hasBadge('workouts_10')) unlockBadge('workouts_10');
  if (totalWorkouts >= 50 && !hasBadge('workouts_50')) unlockBadge('workouts_50');
  if (totalWorkouts >= 100 && !hasBadge('workouts_100')) unlockBadge('workouts_100');
  
  // Streak badges
  if (streak >= 3 && !hasBadge('streak_3')) unlockBadge('streak_3');
  if (streak >= 7 && !hasBadge('streak_7')) unlockBadge('streak_7');
  if (streak >= 30 && !hasBadge('streak_30')) unlockBadge('streak_30');
  
  // Weight loss badges
  if (profile && currentWeight) {
    const lost = profile.currentWeight - currentWeight;
    if (lost >= 5 && !hasBadge('lost_5')) unlockBadge('lost_5');
    if (lost >= 10 && !hasBadge('lost_10')) unlockBadge('lost_10');
    if (lost >= 20 && !hasBadge('lost_20')) unlockBadge('lost_20');
    
    // Goal progress badges
    const progress = getWeightProgress();
    if (progress >= 25 && !hasBadge('goal_25')) unlockBadge('goal_25');
    if (progress >= 50 && !hasBadge('goal_50')) unlockBadge('goal_50');
    if (progress >= 75 && !hasBadge('goal_75')) unlockBadge('goal_75');
    if (progress >= 100 && !hasBadge('goal_100')) unlockBadge('goal_100');
  }
}

// ========================================
// SETTINGS
// ========================================

export function getSettings() {
  return getItem(STORAGE_KEYS.SETTINGS, {
    units: 'lbs',
    notifications: true,
    workoutReminder: '07:00',
    restDayReminder: true,
    streakReminder: true,
    coachMessages: true
  });
}

export function updateSettings(updates) {
  const current = getSettings();
  return setItem(STORAGE_KEYS.SETTINGS, { ...current, ...updates });
}

// ========================================
// CHAT HISTORY
// ========================================

export function getChatHistory() {
  return getItem(STORAGE_KEYS.CHAT_HISTORY, []);
}

export function addChatMessage(role, content) {
  const history = getChatHistory();
  history.push({
    role,
    content,
    timestamp: new Date().toISOString()
  });
  // Keep last 50 messages
  if (history.length > 50) {
    history.splice(0, history.length - 50);
  }
  setItem(STORAGE_KEYS.CHAT_HISTORY, history);
  return history;
}

export function clearChatHistory() {
  return setItem(STORAGE_KEYS.CHAT_HISTORY, []);
}

// ========================================
// FULL DATA MANAGEMENT
// ========================================

export function exportAllData() {
  return {
    profile: getUserProfile(),
    workoutPlan: getWorkoutPlan(),
    workoutHistory: getWorkoutHistory(),
    weightLogs: getWeightLogs(),
    progressPhotos: getProgressPhotos(),
    badges: getBadges(),
    streak: getStreakData(),
    settings: getSettings(),
    exportedAt: new Date().toISOString()
  };
}

export function deleteAllData() {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  return true;
}

export function getDaysUntilGoal() {
  const profile = getUserProfile();
  if (!profile || !profile.goalDate) return null;
  
  const goalDate = new Date(profile.goalDate);
  const today = new Date();
  const diffTime = goalDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
}
