/**
 * Chavez Bootcamp - Progress Page
 * Analytics dashboard with charts, badges, and Field Analysis calculators
 */

import { useState, useEffect } from 'react'
import { getUserProfile, getWeightLogs, getWorkoutHistory, getBadges, getAllBadgeDefinitions, getCurrentStreak, getWeightProgress, getTotalWorkoutsCompleted } from '../utils/storage.js'
import './Progress.css'

// Field Analysis Calculator Component
function FieldAnalysisCard() {
    const [mode, setMode] = useState('fuel') // fuel | scan
    const [result, setResult] = useState(null)

    // FUEL (TDEE) inputs
    const [age, setAge] = useState('')
    const [weight, setWeight] = useState('')
    const [heightFt, setHeightFt] = useState('')
    const [heightIn, setHeightIn] = useState('')
    const [gender, setGender] = useState('male')
    const [activity, setActivity] = useState('1.55')

    // SCAN (Body Fat) inputs
    const [neck, setNeck] = useState('')
    const [waist, setWaist] = useState('')
    const [hip, setHip] = useState('') // For females

    // Calculate TDEE (Mifflin-St Jeor)
    const calculateTDEE = () => {
        const heightCm = ((parseInt(heightFt) * 12) + parseInt(heightIn || 0)) * 2.54
        const weightKg = parseFloat(weight) * 0.453592

        let bmr
        if (gender === 'male') {
            bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * parseInt(age)) + 5
        } else {
            bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * parseInt(age)) - 161
        }

        const tdee = Math.round(bmr * parseFloat(activity))
        setResult(tdee)
    }

    // Calculate Body Fat (US Navy Method)
    const calculateBodyFat = () => {
        const heightInches = (parseInt(heightFt) * 12) + parseInt(heightIn || 0)
        const neckCm = parseFloat(neck) * 2.54
        const waistCm = parseFloat(waist) * 2.54
        const heightCm = heightInches * 2.54

        let bf
        if (gender === 'male') {
            bf = 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450
        } else {
            const hipCm = parseFloat(hip) * 2.54
            bf = 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.22100 * Math.log10(heightCm)) - 450
        }

        setResult(Math.max(0, Math.min(50, bf.toFixed(1))))
    }

    const handleCalculate = () => {
        if (mode === 'fuel') {
            calculateTDEE()
        } else {
            calculateBodyFat()
        }
    }

    const isValid = () => {
        if (mode === 'fuel') {
            return age && weight && heightFt && gender && activity
        } else {
            return neck && waist && heightFt && (gender === 'male' || hip)
        }
    }

    return (
        <div className="field-analysis-card">
            <h3 className="field-analysis-title">FIELD ANALYSIS</h3>

            {/* Mode Toggle */}
            <div className="analysis-toggle">
                <button
                    className={`toggle-btn ${mode === 'fuel' ? 'active' : ''}`}
                    onClick={() => { setMode('fuel'); setResult(null) }}
                >
                    FUEL
                </button>
                <button
                    className={`toggle-btn ${mode === 'scan' ? 'active' : ''}`}
                    onClick={() => { setMode('scan'); setResult(null) }}
                >
                    SCAN
                </button>
            </div>

            <p className="analysis-desc">
                {mode === 'fuel' ? 'Calculate daily calorie needs (TDEE)' : 'Estimate body fat % (US Navy Method)'}
            </p>

            {/* Shared Inputs */}
            <div className="analysis-inputs">
                <div className="input-row">
                    <label>Gender</label>
                    <select value={gender} onChange={e => setGender(e.target.value)}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>

                <div className="input-row">
                    <label>Height</label>
                    <div className="height-inputs">
                        <input type="number" placeholder="ft" value={heightFt} onChange={e => setHeightFt(e.target.value)} />
                        <input type="number" placeholder="in" value={heightIn} onChange={e => setHeightIn(e.target.value)} />
                    </div>
                </div>

                {mode === 'fuel' ? (
                    <>
                        <div className="input-row">
                            <label>Age</label>
                            <input type="number" placeholder="years" value={age} onChange={e => setAge(e.target.value)} />
                        </div>
                        <div className="input-row">
                            <label>Weight</label>
                            <input type="number" placeholder="lbs" value={weight} onChange={e => setWeight(e.target.value)} />
                        </div>
                        <div className="input-row">
                            <label>Activity</label>
                            <select value={activity} onChange={e => setActivity(e.target.value)}>
                                <option value="1.2">Sedentary</option>
                                <option value="1.375">Light (1-3x/wk)</option>
                                <option value="1.55">Moderate (3-5x/wk)</option>
                                <option value="1.725">Active (6-7x/wk)</option>
                                <option value="1.9">Very Active</option>
                            </select>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="input-row">
                            <label>Neck</label>
                            <input type="number" placeholder="inches" value={neck} onChange={e => setNeck(e.target.value)} />
                        </div>
                        <div className="input-row">
                            <label>Waist</label>
                            <input type="number" placeholder="inches" value={waist} onChange={e => setWaist(e.target.value)} />
                        </div>
                        {gender === 'female' && (
                            <div className="input-row">
                                <label>Hip</label>
                                <input type="number" placeholder="inches" value={hip} onChange={e => setHip(e.target.value)} />
                            </div>
                        )}
                    </>
                )}
            </div>

            <button
                className="calculate-btn"
                onClick={handleCalculate}
                disabled={!isValid()}
            >
                CALCULATE
            </button>

            {/* Digital Result Display */}
            {result !== null && (
                <div className="analysis-result">
                    <span className="result-value">{result}</span>
                    <span className="result-unit">{mode === 'fuel' ? 'KCAL/DAY' : '% BODY FAT'}</span>
                </div>
            )}
        </div>
    )
}

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

            {/* Field Analysis Calculators */}
            <FieldAnalysisCard />

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
