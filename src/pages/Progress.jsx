/**
 * Chavez Bootcamp - Progress Page
 * Analytics dashboard with charts and badges
 */

import { useState, useEffect } from 'react'
import { getUserProfile, getWeightLogs, getWorkoutHistory, getBadges, getAllBadgeDefinitions, getCurrentStreak, getWeightProgress, getTotalWorkoutsCompleted } from '../utils/storage.js'
import './Progress.css'

function Progress() {
    const [profile, setProfile] = useState(null)
    const [weightLogs, setWeightLogs] = useState([])
    const [workoutHistory, setWorkoutHistory] = useState([])
    const [badges, setBadges] = useState([])
    const [allBadges, setAllBadges] = useState([])
    const [stats, setStats] = useState({})

    useEffect(() => {
        const userProfile = getUserProfile()
        setProfile(userProfile)
        setWeightLogs(getWeightLogs())
        setWorkoutHistory(getWorkoutHistory())
        setBadges(getBadges())
        setAllBadges(getAllBadgeDefinitions())

        setStats({
            currentStreak: getCurrentStreak(),
            totalWorkouts: getTotalWorkoutsCompleted(),
            weightProgress: getWeightProgress()
        })
    }, [])

    // Simple weight chart visualization
    const renderWeightChart = () => {
        if (weightLogs.length < 2) {
            return (
                <div className="chart-empty">
                    <p>Log more weight entries to see your trend</p>
                </div>
            )
        }

        const logs = weightLogs.slice(-10) // Last 10 entries
        const weights = logs.map(l => l.weight)
        const maxWeight = Math.max(...weights)
        const minWeight = Math.min(...weights)
        const range = maxWeight - minWeight || 1

        return (
            <div className="weight-chart">
                <div className="chart-labels">
                    <span>{maxWeight} lbs</span>
                    <span>{minWeight} lbs</span>
                </div>
                <div className="chart-bars">
                    {logs.map((log, idx) => {
                        const height = ((log.weight - minWeight) / range) * 100
                        return (
                            <div key={idx} className="chart-bar-container">
                                <div
                                    className="chart-bar"
                                    style={{ height: `${Math.max(10, height)}%` }}
                                />
                                <span className="chart-date">
                                    {new Date(log.loggedAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                        )
                    })}
                </div>
                {profile && (
                    <div className="goal-line" style={{
                        bottom: `${((profile.goalWeight - minWeight) / range) * 100}%`
                    }}>
                        <span>Goal: {profile.goalWeight} lbs</span>
                    </div>
                )}
            </div>
        )
    }

    // Workout frequency chart
    const renderWorkoutChart = () => {
        if (workoutHistory.length === 0) {
            return (
                <div className="chart-empty">
                    <p>Complete workouts to see your activity</p>
                </div>
            )
        }

        // Group by week
        const weeks = []
        const now = new Date()
        for (let i = 3; i >= 0; i--) {
            const weekStart = new Date(now)
            weekStart.setDate(weekStart.getDate() - (weekStart.getDay() + 7 * i))
            weekStart.setHours(0, 0, 0, 0)

            const weekEnd = new Date(weekStart)
            weekEnd.setDate(weekEnd.getDate() + 7)

            const count = workoutHistory.filter(w => {
                const date = new Date(w.completedAt)
                return date >= weekStart && date < weekEnd
            }).length

            weeks.push({
                label: `W${4 - i}`,
                count,
                target: profile?.daysPerWeek || 3
            })
        }

        const maxCount = Math.max(...weeks.map(w => Math.max(w.count, w.target)))

        return (
            <div className="workout-chart">
                {weeks.map((week, idx) => (
                    <div key={idx} className="workout-bar-container">
                        <div className="workout-bar-bg" />
                        <div
                            className="workout-bar-fill"
                            style={{ height: `${(week.count / maxCount) * 100}%` }}
                        />
                        <div
                            className="workout-bar-target"
                            style={{ bottom: `${(week.target / maxCount) * 100}%` }}
                        />
                        <span className="workout-count">{week.count}</span>
                        <span className="workout-label">{week.label}</span>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="page progress-page">
            <h1 className="page-title">PROGRESS</h1>

            {/* Summary Stats */}
            <div className="progress-summary">
                <div className="summary-stat">
                    <span className="summary-value">{stats.totalWorkouts || 0}</span>
                    <span className="summary-label">WORKOUTS</span>
                </div>
                <div className="summary-stat">
                    <span className="summary-value">{stats.currentStreak || 0}</span>
                    <span className="summary-label">DAY STREAK</span>
                </div>
                <div className="summary-stat">
                    <span className="summary-value">{stats.weightProgress || 0}%</span>
                    <span className="summary-label">TO GOAL</span>
                </div>
            </div>

            {/* Weight Trend */}
            <div className="chart-section">
                <h3>WEIGHT TREND</h3>
                {renderWeightChart()}
            </div>

            {/* Workout Activity */}
            <div className="chart-section">
                <h3>WEEKLY ACTIVITY</h3>
                {renderWorkoutChart()}
            </div>

            {/* Badges */}
            <div className="badges-section">
                <h3>ACHIEVEMENTS</h3>
                <div className="badges-grid">
                    {allBadges.map(badge => {
                        const isUnlocked = badges.includes(badge.id)
                        return (
                            <div
                                key={badge.id}
                                className={`badge-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                            >
                                <span className="badge-icon">{badge.icon}</span>
                                <span className="badge-name">{badge.name}</span>
                                {isUnlocked ? (
                                    <span className="badge-desc">{badge.description}</span>
                                ) : (
                                    <span className="badge-locked">🔒 Locked</span>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Recent Workouts */}
            {workoutHistory.length > 0 && (
                <div className="history-section">
                    <h3>RECENT SESSIONS</h3>
                    <div className="history-list">
                        {workoutHistory.slice(-5).reverse().map((workout, idx) => (
                            <div key={idx} className="history-item">
                                <div className="history-info">
                                    <span className="history-type">{workout.type?.toUpperCase() || 'WORKOUT'}</span>
                                    <span className="history-date">
                                        {new Date(workout.completedAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <span className="history-duration">
                                    {Math.round((workout.duration || 0) / 60)} min
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Progress
