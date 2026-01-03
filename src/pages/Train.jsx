/**
 * Chavez Bootcamp - Train Page
 * Workout calendar, daily workout, and active session
 */

import { useState, useEffect, useRef } from 'react'
import { getWorkoutPlan, getTodaysWorkout, logCompletedWorkout, getUserProfile, getWorkoutHistory, getRestDayOverride, setRestDayOverride } from '../utils/storage.js'
import { formatTime } from '../utils/workoutGenerator.js'
import './Train.css'

// Battle Record Calendar Component
function BattleRecordCard() {
    const [workoutDates, setWorkoutDates] = useState(new Set())
    const [currentMonth, setCurrentMonth] = useState(new Date())

    useEffect(() => {
        const history = getWorkoutHistory()
        const dates = new Set()

        history.forEach(workout => {
            if (workout.completedAt) {
                const date = new Date(workout.completedAt)
                // Store as YYYY-MM-DD for easy comparison
                dates.add(date.toISOString().split('T')[0])
            }
        })

        setWorkoutDates(dates)
    }, [])

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (date) => {
        const first = new Date(date.getFullYear(), date.getMonth(), 1)
        return first.getDay() === 0 ? 6 : first.getDay() - 1 // Monday = 0
    }

    const isWorkoutDay = (day) => {
        const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
            .toISOString().split('T')[0]
        return workoutDates.has(dateStr)
    }

    const isToday = (day) => {
        const today = new Date()
        return day === today.getDate() &&
            currentMonth.getMonth() === today.getMonth() &&
            currentMonth.getFullYear() === today.getFullYear()
    }

    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
        'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const totalWorkouts = workoutDates.size

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
    }

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
    }

    return (
        <div className="battle-record-card">
            <div className="battle-record-header">
                <h3 className="battle-record-title">BATTLE RECORD</h3>
                <span className="battle-record-count">{totalWorkouts} HITS</span>
            </div>

            {/* Month Navigator */}
            <div className="battle-month-nav">
                <button className="month-nav-btn" onClick={prevMonth}>‹</button>
                <span className="month-label">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </span>
                <button className="month-nav-btn" onClick={nextMonth}>›</button>
            </div>

            {/* Day Labels */}
            <div className="battle-day-labels">
                {dayNames.map((day, idx) => (
                    <span key={idx} className="day-label">{day}</span>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="battle-calendar-grid">
                {/* Empty cells for offset */}
                {Array.from({ length: firstDay }).map((_, idx) => (
                    <div key={`empty-${idx}`} className="calendar-cell empty" />
                ))}

                {/* Day cells */}
                {Array.from({ length: daysInMonth }).map((_, idx) => {
                    const day = idx + 1
                    const hasWorkout = isWorkoutDay(day)
                    const isTodayCell = isToday(day)

                    return (
                        <div
                            key={day}
                            className={`calendar-cell ${hasWorkout ? 'hit' : ''} ${isTodayCell ? 'today' : ''}`}
                        >
                            <span className="cell-day">{day}</span>
                        </div>
                    )
                })}
            </div>

            {/* Legend */}
            <div className="battle-legend">
                <span className="legend-item">
                    <span className="legend-dot empty-dot" /> Miss
                </span>
                <span className="legend-item">
                    <span className="legend-dot hit-dot" /> Hit
                </span>
            </div>
        </div>
    )
}


function Train() {
    const [view, setView] = useState('overview') // overview | session | complete
    const [workoutPlan, setWorkoutPlan] = useState(null)
    const [todaysWorkout, setTodaysWorkout] = useState(null)
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
    const [currentSet, setCurrentSet] = useState(1)
    const [completedSets, setCompletedSets] = useState({})
    const [isResting, setIsResting] = useState(false)
    const [restTime, setRestTime] = useState(60)
    const [sessionTime, setSessionTime] = useState(0)
    const [feedback, setFeedback] = useState('')
    const [isOverrideSession, setIsOverrideSession] = useState(false)

    // Generate a fallback Full Body workout for Rest Day Override
    const generateOverrideWorkout = () => ({
        day: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
        type: 'fullBody',
        isOverride: true,
        estimatedMinutes: 25,
        exercises: [
            { name: 'Squats', sets: 3, reps: 12, restSeconds: 60, formCues: ['Knees over toes', 'Hip crease below knee', 'Chest up'] },
            { name: 'Push-ups', sets: 3, reps: 10, restSeconds: 60, formCues: ['Keep back straight', 'Elbows at 45°', 'Full range of motion'] },
            { name: 'Lunges', sets: 3, reps: 10, restSeconds: 60, formCues: ['90° angles', 'Upright torso', 'Back knee near ground'] },
            { name: 'Plank', sets: 3, reps: 30, isTime: true, restSeconds: 45, formCues: ['Straight line head to heels', 'Core tight', "Don't sag hips"] },
        ]
    })

    const sessionTimerRef = useRef(null)
    const restTimerRef = useRef(null)

    useEffect(() => {
        setWorkoutPlan(getWorkoutPlan())

        // Check for Rest Day Override flag
        const overrideRequested = getRestDayOverride()
        const workout = getTodaysWorkout()

        if (overrideRequested && (!workout || workout.type === 'rest')) {
            // Force session initialization with fallback workout
            const overrideWorkout = generateOverrideWorkout()
            setTodaysWorkout(overrideWorkout)
            setIsOverrideSession(true)
            setRestDayOverride(false) // Clear flag immediately - prevents ghost sessions
        } else {
            setTodaysWorkout(workout)
            setRestDayOverride(false) // Always clear on mount
        }
    }, [])

    // Session timer
    useEffect(() => {
        if (view === 'session') {
            sessionTimerRef.current = setInterval(() => {
                setSessionTime(prev => prev + 1)
            }, 1000)
        } else {
            clearInterval(sessionTimerRef.current)
        }
        return () => clearInterval(sessionTimerRef.current)
    }, [view])

    // Rest timer
    useEffect(() => {
        if (isResting && restTime > 0) {
            restTimerRef.current = setInterval(() => {
                setRestTime(prev => {
                    if (prev <= 1) {
                        setIsResting(false)
                        return 60
                    }
                    return prev - 1
                })
            }, 1000)
        }
        return () => clearInterval(restTimerRef.current)
    }, [isResting, restTime])

    const startWorkout = () => {
        setView('session')
        setCurrentExerciseIndex(0)
        setCurrentSet(1)
        setCompletedSets({})
        setSessionTime(0)
    }

    const completeSet = () => {
        const exercise = todaysWorkout.exercises[currentExerciseIndex]
        const key = `${currentExerciseIndex}-${currentSet}`

        setCompletedSets(prev => ({ ...prev, [key]: true }))

        if (currentSet < exercise.sets) {
            // More sets to go - start rest
            setCurrentSet(prev => prev + 1)
            setIsResting(true)
            setRestTime(exercise.restSeconds || 60)
        } else if (currentExerciseIndex < todaysWorkout.exercises.length - 1) {
            // Move to next exercise
            setCurrentExerciseIndex(prev => prev + 1)
            setCurrentSet(1)
            setIsResting(true)
            setRestTime(90) // Longer rest between exercises
        } else {
            // Workout complete!
            setView('complete')
        }
    }

    const skipRest = () => {
        setIsResting(false)
        setRestTime(60)
    }

    const finishWorkout = () => {
        // Log the completed workout
        logCompletedWorkout({
            ...todaysWorkout,
            duration: sessionTime,
            feedback,
            completedSets: Object.keys(completedSets).length
        })

        // Reset and go back
        setView('overview')
        setFeedback('')
    }

    const getTotalSets = () => {
        if (!todaysWorkout) return 0
        return todaysWorkout.exercises.reduce((sum, ex) => sum + ex.sets, 0)
    }

    const getCompletedSetsCount = () => Object.keys(completedSets).length

    const getDayName = (index) => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        return days[index]
    }

    // Overview View
    if (view === 'overview') {
        return (
            <div className="page train-page">
                <h1 className="page-title">TRAINING</h1>

                {/* Week Overview */}
                {workoutPlan && (
                    <>
                        <div className="week-header">
                            <span className="badge badge-accent">WEEK {workoutPlan.weekNumber}</span>
                        </div>

                        <div className="week-calendar">
                            {workoutPlan.workouts.map((workout, idx) => {
                                const isToday = workout.day === getTodaysWorkout()?.day
                                return (
                                    <div
                                        key={idx}
                                        className={`calendar-day ${workout.type === 'rest' ? 'rest' : ''} ${isToday ? 'today' : ''}`}
                                    >
                                        <span className="day-name">{getDayName(idx)}</span>
                                        <span className="day-type">
                                            {workout.type === 'rest' ? '😴' : workout.type.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}

                {/* Today's Workout */}
                {todaysWorkout && todaysWorkout.type !== 'rest' ? (
                    <div className="today-workout">
                        <h2>TODAY: {todaysWorkout.type.toUpperCase()} DAY</h2>
                        <p className="workout-stats">
                            {todaysWorkout.exercises.length} exercises • {todaysWorkout.estimatedMinutes} min • {getTotalSets()} sets
                        </p>

                        <div className="exercise-preview-list">
                            {todaysWorkout.exercises.map((ex, idx) => (
                                <div key={idx} className="exercise-preview-item">
                                    <span className="exercise-num">{idx + 1}</span>
                                    <span className="exercise-name">{ex.name}</span>
                                    <span className="exercise-sets">
                                        {ex.isTime ? `${ex.sets}x${ex.reps}s` : `${ex.sets}x${ex.reps}`}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <button className="btn btn-primary btn-large btn-block" onClick={startWorkout}>
                            START WORKOUT →
                        </button>
                    </div>
                ) : (
                    <div className="rest-day-message">
                        <h2>😴 REST DAY</h2>
                        <p>Recover. Stretch. Stay hydrated. Tomorrow we go again.</p>
                    </div>
                )}

                {/* BATTLE RECORD - Consistency Calendar */}
                <BattleRecordCard />
            </div>
        )
    }

    // Active Session View
    if (view === 'session' && todaysWorkout) {
        const exercise = todaysWorkout.exercises[currentExerciseIndex]
        const progress = (getCompletedSetsCount() / getTotalSets()) * 100

        return (
            <div className="page session-page">
                {/* Session Header */}
                <div className="session-header">
                    <button className="btn btn-ghost" onClick={() => setView('overview')}>
                        ← Exit
                    </button>
                    <div className="session-timer">
                        {formatTime(sessionTime)}
                    </div>
                    <div className="session-progress">
                        {Math.round(progress)}%
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="progress-bar session-progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>

                {/* Rest Timer Overlay */}
                {isResting && (
                    <div className="rest-overlay">
                        <div className="rest-content">
                            <h2>REST</h2>
                            <div className="rest-timer-display">{restTime}</div>
                            <p>Next: Set {currentSet} of {exercise.sets}</p>
                            <button className="btn btn-secondary" onClick={skipRest}>
                                SKIP REST →
                            </button>
                        </div>
                    </div>
                )}

                {/* Current Exercise */}
                <div className="current-exercise">
                    <div className="exercise-counter">
                        {currentExerciseIndex + 1} / {todaysWorkout.exercises.length}
                    </div>

                    <h1 className="exercise-title">{exercise.name}</h1>

                    <div className="exercise-target">
                        {exercise.isTime ? (
                            <span>{exercise.reps} SECONDS</span>
                        ) : (
                            <>
                                <span className="target-reps">{exercise.reps}</span>
                                <span className="target-label">REPS</span>
                            </>
                        )}
                        {exercise.weightLbs && (
                            <span className="target-weight">@ {exercise.weightLbs} lbs</span>
                        )}
                    </div>

                    {/* Set Bubbles */}
                    <div className="set-bubbles">
                        {Array.from({ length: exercise.sets }).map((_, idx) => {
                            const setNum = idx + 1
                            const key = `${currentExerciseIndex}-${setNum}`
                            const isCompleted = completedSets[key]
                            const isActive = setNum === currentSet && !isCompleted

                            return (
                                <div
                                    key={idx}
                                    className={`set-bubble ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                                >
                                    {isCompleted ? '✓' : setNum}
                                </div>
                            )
                        })}
                    </div>

                    {/* Form Cues */}
                    <div className="form-cues">
                        {exercise.formCues?.map((cue, idx) => (
                            <div key={idx} className="form-cue">✓ {cue}</div>
                        ))}
                    </div>

                    {/* Complete Set Button */}
                    <button
                        className="btn btn-primary btn-large btn-block complete-set-btn"
                        onClick={completeSet}
                        disabled={isResting}
                    >
                        COMPLETE SET {currentSet} →
                    </button>
                </div>
            </div>
        )
    }

    // Workout Complete View
    if (view === 'complete') {
        return (
            <div className="page complete-page">
                <div className="complete-content">
                    <div className="complete-icon">🎖️</div>
                    <h1>WORKOUT COMPLETE</h1>
                    <p>Time: {formatTime(sessionTime)}</p>
                    <p>Sets Completed: {getCompletedSetsCount()} / {getTotalSets()}</p>

                    <div className="feedback-section">
                        <h3>HOW DID THAT FEEL?</h3>
                        <div className="feedback-options">
                            {['Too Easy', 'Just Right', 'Too Hard'].map(option => (
                                <button
                                    key={option}
                                    className={`feedback-btn ${feedback === option ? 'selected' : ''}`}
                                    onClick={() => setFeedback(option)}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        className="btn btn-primary btn-large btn-block"
                        onClick={finishWorkout}
                    >
                        FINISH →
                    </button>
                </div>
            </div>
        )
    }

    return null
}

export default Train
