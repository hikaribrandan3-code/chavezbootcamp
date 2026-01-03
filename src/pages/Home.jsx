/**
 * Chavez Bootcamp - Home Dashboard
 * Final Pre-Ship: Casio-style digital clock + Military Rank System
 */

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getUserProfile, getWorkoutPlan, getTodaysWorkout, getCurrentStreak, getLatestWeight, getWeightProgress, getDaysUntilGoal, getWorkoutsCompletedThisWeek, unlockBadge, hasBadge, getTotalWorkoutsCompleted, setRestDayOverride } from '../utils/storage.js'
import { getDailyQuote } from '../data/quotes.js'
import { Icons } from '../components/Icons.jsx'
import './Home.css'

// Military Rank Calculator
function calculateRank(totalWorkouts) {
    if (totalWorkouts >= 100) return 'WARLORD'
    if (totalWorkouts >= 50) return 'COMMANDER'
    if (totalWorkouts >= 25) return 'SOLDIER'
    return 'RECRUIT'
}

// Commander Badge SVG Icon
const CommanderBadgeIcon = () => (
    <svg width={20} height={20} fill="#9FE870" viewBox="0 0 256 256">
        <path d="M207,40H49A17,17,0,0,0,32,57v49.21a17,17,0,0,0,10,15.47l62.6,28.45a48,48,0,1,0,46.88,0L214,121.68a17,17,0,0,0,10-15.47V57A17,17,0,0,0,207,40ZM160,56v72.67l-32,14.54L96,128.67V56ZM48,106.21V57a1,1,0,0,1,1-1H80v65.39L48.59,107.12A1,1,0,0,1,48,106.21ZM128,224a32,32,0,1,1,32-32A32,32,0,0,1,128,224Zm80-117.79a1,1,0,0,1-.59.91L176,121.39V56h31a1,1,0,0,1,1,1Z" />
    </svg>
)



function Home() {
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null)
    const [todaysWorkout, setTodaysWorkout] = useState(null)
    const [streak, setStreak] = useState(0)
    const [quote, setQuote] = useState('')
    const [stats, setStats] = useState({})
    const [overrideRestDay, setOverrideRestDay] = useState(false)
    const [militaryTime, setMilitaryTime] = useState({ hours: '00', minutes: '00', seconds: '00' })
    const [totalWorkouts, setTotalWorkouts] = useState(0)

    useEffect(() => {
        const userProfile = getUserProfile()
        setProfile(userProfile)
        setTodaysWorkout(getTodaysWorkout())
        setStreak(getCurrentStreak())
        setQuote(getDailyQuote())
        setTotalWorkouts(getTotalWorkoutsCompleted())

        setStats({
            currentWeight: getLatestWeight() || userProfile?.currentWeight,
            goalWeight: userProfile?.goalWeight,
            progress: getWeightProgress(),
            daysRemaining: getDaysUntilGoal(),
            workoutsThisWeek: getWorkoutsCompletedThisWeek()
        })

        // Check for Iron Clad badge (0 pain in assessment)
        if (userProfile && userProfile.injuries?.length === 0 && !hasBadge('iron_clad')) {
            unlockBadge('iron_clad')
        }

        // Update military time every second
        const updateTime = () => {
            const now = new Date()
            setMilitaryTime({
                hours: now.getHours().toString().padStart(2, '0'),
                minutes: now.getMinutes().toString().padStart(2, '0'),
                seconds: now.getSeconds().toString().padStart(2, '0')
            })
        }
        updateTime()
        const interval = setInterval(updateTime, 1000)
        return () => clearInterval(interval)
    }, [])

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'GOOD MORNING'
        if (hour < 17) return 'GOOD AFTERNOON'
        return 'GOOD EVENING'
    }

    const formatDate = () => {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
        }).toUpperCase()
    }

    const handleRestDayOverride = () => {
        setOverrideRestDay(true)
        setRestDayOverride(true) // Persist for Train.jsx navigation
        // Award No Excuses badge
        if (!hasBadge('no_excuses')) {
            unlockBadge('no_excuses')
        }
    }

    const isRestDay = !todaysWorkout || todaysWorkout.type === 'rest'
    const showWorkout = !isRestDay || overrideRestDay

    return (
        <div className="page home-page">
            {/* Casio-Style Digital Clock - No Label */}
            <div className="casio-clock">
                <span className="casio-hours">{militaryTime.hours}</span>
                <span className="casio-sep">:</span>
                <span className="casio-minutes">{militaryTime.minutes}</span>
                <span className="casio-sep casio-sep-sm">:</span>
                <span className="casio-seconds">{militaryTime.seconds}</span>
            </div>

            {/* Rank Badge */}
            <div className="rank-badge">
                <CommanderBadgeIcon />
                <span className="rank-label">RANK:</span>
                <span className="rank-value">{calculateRank(totalWorkouts)}</span>
            </div>

            {/* Header */}
            <div className="home-header">
                <div>
                    <h1 className="greeting">{getGreeting()}</h1>
                    <p className="date">{formatDate()}</p>
                </div>
                <Link to="/settings" className="settings-btn">
                    {Icons.settings}
                </Link>
            </div>

            {/* Quote */}
            <div className="quote-card">
                <span className="quote-icon">"</span>
                <p className="quote-text">{quote}</p>
            </div>

            {/* Streak Badge */}
            {streak > 0 && (
                <div className="streak-badge">
                    <span className="streak-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M143.38,17.85a8,8,0,0,0-12.63,3.41l-22,60.41L84.59,58.26a8,8,0,0,0-11.93.89C51,86.29,40,116.63,40,144a88,88,0,0,0,176,0C216,84.55,168.49,42.56,143.38,17.85ZM128,216a72.08,72.08,0,0,1-72-72c0-22.92,8.76-47.45,26-72.84L111.5,96a8,8,0,0,0,5.76,3.84,8.49,8.49,0,0,0,1.18.09,8,8,0,0,0,6.94-4L151,39.21c28.91,27.54,49,60.89,49,104.79A72.08,72.08,0,0,1,128,216Zm40-72a40,40,0,1,1-64-32,8,8,0,1,1,9.6,12.8A24,24,0,1,0,152,144a8,8,0,0,1,16,0Z"></path>
                        </svg>
                    </span>
                    <span className="streak-count">{streak}</span>
                    <span>DAY STREAK</span>
                </div>
            )}

            {/* Today's Workout or Rest Day */}
            {showWorkout && todaysWorkout ? (
                <div className="card-hero workout-preview">
                    <div className="workout-preview-content">
                        <div className="workout-status-row">
                            <span className="badge badge-accent">
                                {isRestDay && overrideRestDay ? 'OVERRIDE MODE' : "TODAY'S SESSION"}
                            </span>
                            <span className="sync-indicator">{Icons.sync}</span>
                        </div>
                        <h2 className="workout-title">
                            {todaysWorkout.type?.toUpperCase() || 'FULL BODY'} DAY
                        </h2>
                        <div className="workout-meta">
                            <span>{todaysWorkout.estimatedMinutes} MIN</span>
                            <span>{todaysWorkout.exercises?.length || 0} EXERCISES</span>
                        </div>
                    </div>
                    <Link to="/train" className="btn btn-primary btn-large btn-block">
                        START SESSION
                    </Link>
                </div>
            ) : (
                <div className="card-hero rest-day-card">
                    <div className="rest-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M152,108a12,12,0,1,1-12-12A12,12,0,0,1,152,108Zm76-44A104,104,0,1,1,124,20,104.11,104.11,0,0,1,228,64ZM212,64a88.11,88.11,0,0,0-88-88A87.39,87.39,0,0,0,70.29,197.27,88,88,0,0,0,212,64ZM128,184a7.59,7.59,0,0,0-.78-.06c-18.49-.14-32.94-11.93-39.94-26a8,8,0,1,1,14.44-6.78c4.14,8.33,13.57,16.6,26.28,16.78,12.71-.18,22.14-8.45,26.28-16.78a8,8,0,1,1,14.44,6.78c-7,14.06-21.45,25.85-39.94,26A7.59,7.59,0,0,0,128,184Zm-20-76a12,12,0,1,0,12,12A12,12,0,0,0,108,108Z"></path>
                        </svg>
                    </div>
                    <h2>REST DAY</h2>
                    <p>Recovery is how you grow. Use today to stretch, hydrate, and eat right.</p>
                    <p className="text-accent">You've earned it.</p>

                    <button
                        className="btn btn-secondary btn-block override-btn"
                        onClick={handleRestDayOverride}
                    >
                        OVERRIDE: I WANT TO TRAIN
                    </button>
                </div>
            )}

            {/* Quick Stats */}
            <h3 className="section-title">YOUR PROGRESS</h3>
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M239.28,175.65c-13-23.4-29.38-45.39-48.72-65.34A153.18,153.18,0,0,0,64.53,40.8a8,8,0,0,0-6,5.73L32.82,138.83A16,16,0,0,0,43.36,158l48.13,14.62a8.06,8.06,0,0,0,4.62,0l24.68-7.45a8,8,0,0,0,5.68-8.37l-2.8-35.84a8,8,0,0,1,6.53-8.56l29.13-5.36a8,8,0,0,1,7.32,2.12l17.78,17.78a8,8,0,0,1,0,11.32,8,8,0,0,0,0,11.31,8,8,0,0,0,11.31,0l17.78-17.78a24,24,0,0,0,0-33.94L196.78,80.87a24,24,0,0,0-21.95-6.36l-29.13,5.36a24,24,0,0,0-19.58,25.68l2.8,35.84-13.84,4.18L71.19,134.82l21.88-79a137.21,137.21,0,0,1,106.39,62.93c17.62,18.28,32.31,38.46,43.76,60.09a8,8,0,1,0,14.06-7.62Z"></path>
                        </svg>
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">CURRENT</span>
                        <span className="stat-value">{stats.currentWeight || '--'} <span className="stat-unit">lbs</span></span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M232,120v80a8,8,0,0,1-16,0V152H144v56a8,8,0,0,1-16,0V173.28a96,96,0,0,1-112.95-3,8,8,0,0,1,9.9-12.56A80,80,0,0,0,128,152V120a8,8,0,0,1,16,0v16h72V120a8,8,0,0,1,16,0Z"></path>
                        </svg>
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">GOAL</span>
                        <span className="stat-value">{stats.goalWeight || '--'} <span className="stat-unit">lbs</span></span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0V156.69l50.34-50.35a8,8,0,0,1,11.32,0L128,132.69,212.69,48H160a8,8,0,0,1,0-16h72a8,8,0,0,1,8,8v72a8,8,0,0,1-16,0V59.31l-90.34,90.35a8,8,0,0,1-11.32,0L96,123.31,40,179.31V200H224A8,8,0,0,1,232,208Z"></path>
                        </svg>
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">PROGRESS</span>
                        <span className="stat-value">{stats.progress || 0}<span className="stat-unit">%</span></span>
                    </div>
                </div>

                <div className="stat-card stat-days">
                    <div className="stat-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-68-76a12,12,0,1,1-12-12A12,12,0,0,1,140,132Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,184,132Zm-88,40a12,12,0,1,1-12-12A12,12,0,0,1,96,172Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,140,172Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,184,172Z"></path>
                        </svg>
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">DAYS LEFT</span>
                        <span className="stat-value">{stats.daysRemaining ?? '--'}</span>
                    </div>
                </div>
            </div>

            {/* Weekly Summary */}
            <div className="weekly-summary">
                <h4>THIS WEEK</h4>
                <div className="weekly-progress">
                    <span className="weekly-count">{stats.workoutsThisWeek || 0}</span>
                    <span className="weekly-label">/ {profile?.daysPerWeek || 3} WORKOUTS COMPLETED</span>
                </div>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${Math.min(100, ((stats.workoutsThisWeek || 0) / (profile?.daysPerWeek || 3)) * 100)}%` }}
                    />
                </div>
            </div>

            {/* Why Statement (motivation) */}
            {profile?.whyStatement && (
                <div className="why-reminder">
                    <h4>REMEMBER YOUR WHY</h4>
                    <p>"{profile.whyStatement}"</p>
                </div>
            )}
        </div>
    )
}

export default Home
