/**
 * Chavez Bootcamp - Workout Generator
 * Auto-generates personalized workout plans with progressive overload
 */

import { getUserProfile, getWorkoutHistory, getWorkoutPlan } from './storage.js';

// ========================================
// EXERCISE DATABASE
// ========================================

const EXERCISES = {
    // UPPER BODY - PUSH
    pushups: {
        id: 'pushups',
        name: 'Push-ups',
        muscle: 'chest',
        equipment: ['none'],
        difficulty: 'beginner',
        formCues: ['Keep back straight', 'Elbows at 45°', 'Full range of motion']
    },
    benchPress: {
        id: 'benchPress',
        name: 'Bench Press',
        muscle: 'chest',
        equipment: ['barbell', 'bench'],
        difficulty: 'intermediate',
        formCues: ['Arch back slightly', 'Feet planted', 'Bar to chest']
    },
    dumbbellPress: {
        id: 'dumbbellPress',
        name: 'Dumbbell Chest Press',
        muscle: 'chest',
        equipment: ['dumbbells', 'bench'],
        difficulty: 'beginner',
        formCues: ['Control the weight', 'Squeeze at top', 'Full stretch at bottom']
    },
    overheadPress: {
        id: 'overheadPress',
        name: 'Overhead Press',
        muscle: 'shoulders',
        equipment: ['barbell'],
        difficulty: 'intermediate',
        formCues: ['Core tight', 'Press straight up', 'Don\'t arch back']
    },
    lateralRaises: {
        id: 'lateralRaises',
        name: 'Lateral Raises',
        muscle: 'shoulders',
        equipment: ['dumbbells'],
        difficulty: 'beginner',
        formCues: ['Slight elbow bend', 'Lead with elbows', 'Control the negative']
    },
    tricepDips: {
        id: 'tricepDips',
        name: 'Tricep Dips',
        muscle: 'triceps',
        equipment: ['none'],
        difficulty: 'beginner',
        formCues: ['Elbows back, not flared', 'Go to 90°', 'Push through palms']
    },
    tricepExtensions: {
        id: 'tricepExtensions',
        name: 'Tricep Extensions',
        muscle: 'triceps',
        equipment: ['dumbbells'],
        difficulty: 'beginner',
        formCues: ['Keep elbows fixed', 'Full extension', 'Slow negative']
    },

    // UPPER BODY - PULL
    pullups: {
        id: 'pullups',
        name: 'Pull-ups',
        muscle: 'back',
        equipment: ['pullup_bar'],
        difficulty: 'intermediate',
        formCues: ['Full hang at bottom', 'Chin over bar', 'Control descent']
    },
    dumbbellRows: {
        id: 'dumbbellRows',
        name: 'Dumbbell Rows',
        muscle: 'back',
        equipment: ['dumbbells'],
        difficulty: 'beginner',
        formCues: ['Flat back', 'Pull to hip', 'Squeeze shoulder blade']
    },
    bentOverRows: {
        id: 'bentOverRows',
        name: 'Bent Over Rows',
        muscle: 'back',
        equipment: ['barbell'],
        difficulty: 'intermediate',
        formCues: ['Hinge at hips', 'Pull to belly button', 'Keep back flat']
    },
    bicepCurls: {
        id: 'bicepCurls',
        name: 'Bicep Curls',
        muscle: 'biceps',
        equipment: ['dumbbells'],
        difficulty: 'beginner',
        formCues: ['Elbows stationary', 'Full contraction', 'No swinging']
    },
    hammerCurls: {
        id: 'hammerCurls',
        name: 'Hammer Curls',
        muscle: 'biceps',
        equipment: ['dumbbells'],
        difficulty: 'beginner',
        formCues: ['Neutral grip', 'Controlled tempo', 'Squeeze at top']
    },

    // LOWER BODY
    squats: {
        id: 'squats',
        name: 'Squats',
        muscle: 'legs',
        equipment: ['none'],
        difficulty: 'beginner',
        formCues: ['Knees over toes', 'Hip crease below knee', 'Chest up']
    },
    barbellSquats: {
        id: 'barbellSquats',
        name: 'Barbell Squats',
        muscle: 'legs',
        equipment: ['barbell', 'squat_rack'],
        difficulty: 'intermediate',
        formCues: ['Bar on upper back', 'Brace core', 'Push through heels']
    },
    gobletSquats: {
        id: 'gobletSquats',
        name: 'Goblet Squats',
        muscle: 'legs',
        equipment: ['dumbbells'],
        difficulty: 'beginner',
        formCues: ['Hold weight at chest', 'Elbows inside knees', 'Deep squat']
    },
    lunges: {
        id: 'lunges',
        name: 'Lunges',
        muscle: 'legs',
        equipment: ['none'],
        difficulty: 'beginner',
        formCues: ['90° angles', 'Upright torso', 'Back knee near ground']
    },
    romanianDeadlifts: {
        id: 'romanianDeadlifts',
        name: 'Romanian Deadlifts',
        muscle: 'hamstrings',
        equipment: ['dumbbells'],
        difficulty: 'intermediate',
        formCues: ['Slight knee bend', 'Hinge at hips', 'Feel the hamstring stretch']
    },
    deadlifts: {
        id: 'deadlifts',
        name: 'Deadlifts',
        muscle: 'back',
        equipment: ['barbell'],
        difficulty: 'intermediate',
        formCues: ['Flat back', 'Bar close to body', 'Drive through heels']
    },
    calfRaises: {
        id: 'calfRaises',
        name: 'Calf Raises',
        muscle: 'calves',
        equipment: ['none'],
        difficulty: 'beginner',
        formCues: ['Full extension', 'Pause at top', 'Slow negative']
    },
    gluteBridges: {
        id: 'gluteBridges',
        name: 'Glute Bridges',
        muscle: 'glutes',
        equipment: ['none'],
        difficulty: 'beginner',
        formCues: ['Squeeze glutes at top', 'Push through heels', 'Don\'t arch back']
    },

    // CORE
    plank: {
        id: 'plank',
        name: 'Plank',
        muscle: 'core',
        equipment: ['none'],
        difficulty: 'beginner',
        isTime: true,
        formCues: ['Straight line head to heels', 'Core tight', 'Don\'t sag hips']
    },
    crunches: {
        id: 'crunches',
        name: 'Crunches',
        muscle: 'core',
        equipment: ['none'],
        difficulty: 'beginner',
        formCues: ['Don\'t pull on neck', 'Small controlled movement', 'Exhale up']
    },
    legRaises: {
        id: 'legRaises',
        name: 'Leg Raises',
        muscle: 'core',
        equipment: ['none'],
        difficulty: 'intermediate',
        formCues: ['Lower back flat', 'Controlled descent', 'Don\'t swing']
    },
    mountainClimbers: {
        id: 'mountainClimbers',
        name: 'Mountain Climbers',
        muscle: 'core',
        equipment: ['none'],
        difficulty: 'beginner',
        formCues: ['Plank position', 'Drive knees to chest', 'Keep hips low']
    },
    russianTwists: {
        id: 'russianTwists',
        name: 'Russian Twists',
        muscle: 'core',
        equipment: ['none'],
        difficulty: 'beginner',
        formCues: ['Lean back slightly', 'Rotate from core', 'Keep feet elevated']
    },

    // CARDIO/CONDITIONING
    burpees: {
        id: 'burpees',
        name: 'Burpees',
        muscle: 'full_body',
        equipment: ['none'],
        difficulty: 'intermediate',
        formCues: ['Full push-up', 'Explosive jump', 'Land soft']
    },
    jumpingJacks: {
        id: 'jumpingJacks',
        name: 'Jumping Jacks',
        muscle: 'cardio',
        equipment: ['none'],
        difficulty: 'beginner',
        formCues: ['Full arm extension', 'Light on feet', 'Consistent rhythm']
    },
    highKnees: {
        id: 'highKnees',
        name: 'High Knees',
        muscle: 'cardio',
        equipment: ['none'],
        difficulty: 'beginner',
        formCues: ['Knees to hip height', 'Pump arms', 'Stay on balls of feet']
    }
};

// ========================================
// WORKOUT TEMPLATES
// ========================================

const WORKOUT_TEMPLATES = {
    // Full body templates
    fullBody: {
        beginner: [
            { exerciseId: 'squats', sets: 3, reps: 12 },
            { exerciseId: 'pushups', sets: 3, reps: 10 },
            { exerciseId: 'dumbbellRows', sets: 3, reps: 10 },
            { exerciseId: 'lunges', sets: 3, reps: 10 },
            { exerciseId: 'plank', sets: 3, reps: 30, isTime: true },
        ],
        intermediate: [
            { exerciseId: 'gobletSquats', sets: 4, reps: 12 },
            { exerciseId: 'dumbbellPress', sets: 4, reps: 10 },
            { exerciseId: 'bentOverRows', sets: 4, reps: 10 },
            { exerciseId: 'romanianDeadlifts', sets: 3, reps: 12 },
            { exerciseId: 'overheadPress', sets: 3, reps: 10 },
            { exerciseId: 'plank', sets: 3, reps: 45, isTime: true },
        ]
    },
    // Upper body templates
    upper: {
        beginner: [
            { exerciseId: 'pushups', sets: 3, reps: 10 },
            { exerciseId: 'dumbbellRows', sets: 3, reps: 10 },
            { exerciseId: 'lateralRaises', sets: 3, reps: 12 },
            { exerciseId: 'bicepCurls', sets: 3, reps: 10 },
            { exerciseId: 'tricepDips', sets: 3, reps: 10 },
        ],
        intermediate: [
            { exerciseId: 'benchPress', sets: 4, reps: 8 },
            { exerciseId: 'bentOverRows', sets: 4, reps: 8 },
            { exerciseId: 'overheadPress', sets: 3, reps: 10 },
            { exerciseId: 'pullups', sets: 3, reps: 8 },
            { exerciseId: 'bicepCurls', sets: 3, reps: 12 },
            { exerciseId: 'tricepExtensions', sets: 3, reps: 12 },
        ]
    },
    // Lower body templates
    lower: {
        beginner: [
            { exerciseId: 'squats', sets: 3, reps: 15 },
            { exerciseId: 'lunges', sets: 3, reps: 10 },
            { exerciseId: 'gluteBridges', sets: 3, reps: 15 },
            { exerciseId: 'calfRaises', sets: 3, reps: 15 },
            { exerciseId: 'plank', sets: 3, reps: 30, isTime: true },
        ],
        intermediate: [
            { exerciseId: 'barbellSquats', sets: 4, reps: 8 },
            { exerciseId: 'romanianDeadlifts', sets: 4, reps: 10 },
            { exerciseId: 'lunges', sets: 3, reps: 12 },
            { exerciseId: 'gobletSquats', sets: 3, reps: 12 },
            { exerciseId: 'calfRaises', sets: 4, reps: 15 },
            { exerciseId: 'legRaises', sets: 3, reps: 15 },
        ]
    },
    // Core focus
    core: {
        beginner: [
            { exerciseId: 'plank', sets: 3, reps: 30, isTime: true },
            { exerciseId: 'crunches', sets: 3, reps: 15 },
            { exerciseId: 'mountainClimbers', sets: 3, reps: 20 },
            { exerciseId: 'gluteBridges', sets: 3, reps: 15 },
        ],
        intermediate: [
            { exerciseId: 'plank', sets: 4, reps: 45, isTime: true },
            { exerciseId: 'legRaises', sets: 3, reps: 15 },
            { exerciseId: 'russianTwists', sets: 3, reps: 20 },
            { exerciseId: 'mountainClimbers', sets: 3, reps: 30 },
            { exerciseId: 'burpees', sets: 3, reps: 10 },
        ]
    }
};

// ========================================
// SCHEDULE CONFIGURATIONS
// ========================================

const SCHEDULES = {
    3: ['fullBody', 'rest', 'fullBody', 'rest', 'fullBody', 'rest', 'rest'],
    4: ['upper', 'lower', 'rest', 'upper', 'lower', 'rest', 'rest'],
    5: ['upper', 'lower', 'rest', 'upper', 'lower', 'core', 'rest'],
    6: ['upper', 'lower', 'fullBody', 'rest', 'upper', 'lower', 'rest']
};

// ========================================
// PROGRESSIVE OVERLOAD LOGIC
// ========================================

/**
 * Calculate progressive overload adjustments based on history
 */
function applyProgressiveOverload(exercises, weekNumber, userFeedback = null) {
    return exercises.map(ex => {
        const baseEx = { ...ex };
        const weekMultiplier = 1 + (weekNumber - 1) * 0.05; // 5% increase per week

        if (baseEx.isTime) {
            // Time-based exercises: add 5-10 seconds per week
            baseEx.reps = Math.round(baseEx.reps * weekMultiplier);
        } else {
            // Rep-based: add 1-2 reps every other week
            if (weekNumber % 2 === 0) {
                baseEx.reps = Math.min(baseEx.reps + 1, 20);
            }
            // Add a set after 4 weeks
            if (weekNumber > 4 && baseEx.sets < 5) {
                baseEx.sets += 1;
            }
        }

        // Weight recommendation (if applicable)
        if (baseEx.weightLbs) {
            baseEx.weightLbs = Math.round(baseEx.weightLbs * weekMultiplier);
        }

        return baseEx;
    });
}

/**
 * Get starting weights based on user experience
 */
function getStartingWeight(exerciseId, userLevel) {
    const weights = {
        beginner: {
            dumbbellPress: 15,
            dumbbellRows: 15,
            bicepCurls: 10,
            tricepExtensions: 10,
            lateralRaises: 8,
            gobletSquats: 20,
            romanianDeadlifts: 20,
            overheadPress: 15,
            benchPress: 65,
            barbellSquats: 95,
            deadlifts: 95,
            bentOverRows: 65
        },
        intermediate: {
            dumbbellPress: 30,
            dumbbellRows: 30,
            bicepCurls: 20,
            tricepExtensions: 20,
            lateralRaises: 15,
            gobletSquats: 40,
            romanianDeadlifts: 40,
            overheadPress: 30,
            benchPress: 135,
            barbellSquats: 185,
            deadlifts: 185,
            bentOverRows: 95
        }
    };

    return weights[userLevel]?.[exerciseId] || null;
}

// ========================================
// MAIN GENERATOR FUNCTION
// ========================================

/**
 * Generate a complete weekly workout plan
 */
export function generateWorkoutPlan() {
    const profile = getUserProfile();
    if (!profile) return null;

    const currentPlan = getWorkoutPlan();
    const weekNumber = currentPlan ? (currentPlan.weekNumber || 0) + 1 : 1;

    const daysPerWeek = profile.daysPerWeek || 3;
    const location = profile.workoutLocation || 'home';
    const userLevel = profile.fitnessLevel || 'beginner';
    const injuries = profile.injuries || [];

    // Get schedule template
    const schedule = SCHEDULES[daysPerWeek] || SCHEDULES[3];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Generate workouts for each day
    const workouts = schedule.map((type, index) => {
        if (type === 'rest') {
            return {
                day: dayNames[index],
                type: 'rest',
                exercises: [],
                estimatedMinutes: 0
            };
        }

        // Get template
        const template = WORKOUT_TEMPLATES[type]?.[userLevel] || WORKOUT_TEMPLATES.fullBody.beginner;

        // Filter exercises based on equipment and injuries
        let exercises = template.filter(ex => {
            const exerciseInfo = EXERCISES[ex.exerciseId];
            if (!exerciseInfo) return false;

            // Check equipment availability
            if (location === 'home') {
                const homeEquipment = ['none', 'dumbbells', 'resistance_bands'];
                const userEquipment = profile.equipment || [];
                const hasEquipment = exerciseInfo.equipment.some(e =>
                    homeEquipment.includes(e) || userEquipment.includes(e)
                );
                if (!hasEquipment) return false;
            }

            // Check injuries (simplified)
            if (injuries.includes('shoulder') && exerciseInfo.muscle === 'shoulders') return false;
            if (injuries.includes('knee') && exerciseInfo.muscle === 'legs') return false;
            if (injuries.includes('back') && exerciseInfo.muscle === 'back') return false;

            return true;
        });

        // Apply progressive overload
        exercises = applyProgressiveOverload(exercises, weekNumber);

        // Add exercise details and weights
        exercises = exercises.map(ex => {
            const info = EXERCISES[ex.exerciseId];
            const weight = getStartingWeight(ex.exerciseId, userLevel);

            return {
                ...ex,
                name: info.name,
                muscle: info.muscle,
                formCues: info.formCues,
                weightLbs: weight ? Math.round(weight * (1 + (weekNumber - 1) * 0.05)) : null,
                restSeconds: 60
            };
        });

        // Calculate estimated duration
        const estimatedMinutes = exercises.reduce((total, ex) => {
            const setTime = ex.isTime ? (ex.reps / 60) : 0.5; // time in minutes per set
            const restTime = (ex.restSeconds / 60) * (ex.sets - 1);
            return total + (ex.sets * setTime) + restTime;
        }, 0);

        return {
            day: dayNames[index],
            type: type,
            exercises,
            estimatedMinutes: Math.round(estimatedMinutes + 5) // Add 5 min buffer
        };
    });

    return {
        weekNumber,
        goal: profile.goal || 'general_fitness',
        daysPerWeek,
        workouts,
        generatedAt: new Date().toISOString()
    };
}

/**
 * Get exercise by ID
 */
export function getExercise(exerciseId) {
    return EXERCISES[exerciseId] || null;
}

/**
 * Get all exercises
 */
export function getAllExercises() {
    return EXERCISES;
}

/**
 * Calculate workout progress percentage
 */
export function calculateWorkoutProgress(completedSets, totalSets) {
    if (totalSets === 0) return 0;
    return Math.round((completedSets / totalSets) * 100);
}

/**
 * Format time display (for timer exercises)
 */
export function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
