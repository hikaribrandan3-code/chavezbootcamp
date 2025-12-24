/**
 * Chavez Bootcamp - Onboarding Page
 * Rev 3: CHAVEZ BOOTCAMP header, injury pain ratings, fixed icons
 */

import { useState } from 'react'
import { setUserProfile, setWorkoutPlan } from '../utils/storage.js'
import { generateWorkoutPlan } from '../utils/workoutGenerator.js'
import { Icons } from '../components/Icons.jsx'
import './Onboarding.css'

const STEPS = [
    'basics',
    'goals',
    'health',
    'location',
    'schedule',
    'why'
]

function Onboarding({ onComplete }) {
    const [currentStep, setCurrentStep] = useState(0)
    const [formData, setFormData] = useState({
        // Basics
        age: '',
        heightFeet: '',
        heightInches: '',
        currentWeight: '',

        // Goals
        goalWeight: '',
        goal: 'weight_loss',
        timeframe: '3',

        // Health
        allergies: '',
        medicalConditions: '',
        injuries: [],
        injuryRatings: {}, // { shoulder: 5, knee: 3 }

        // Location
        workoutLocation: 'home',
        equipment: [],
        budget: 'medium',

        // Schedule
        daysPerWeek: 3,
        preferredTime: 'morning',

        // Why
        whyStatement: ''
    })

    const updateForm = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const updateInjuryRating = (injury, rating) => {
        setFormData(prev => ({
            ...prev,
            injuryRatings: { ...prev.injuryRatings, [injury]: rating }
        }))
    }

    const nextStep = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1)
        }
    }

    const handleComplete = () => {
        const goalDate = new Date()
        goalDate.setMonth(goalDate.getMonth() + parseInt(formData.timeframe))

        const totalInches = (parseInt(formData.heightFeet) * 12) + parseInt(formData.heightInches || 0)

        const profile = {
            ...formData,
            height: totalInches,
            currentWeight: parseFloat(formData.currentWeight),
            goalWeight: parseFloat(formData.goalWeight),
            age: parseInt(formData.age),
            daysPerWeek: parseInt(formData.daysPerWeek),
            goalDate: goalDate.toISOString(),
            onboardingComplete: true
        }

        setUserProfile(profile)

        const plan = generateWorkoutPlan()
        if (plan) setWorkoutPlan(plan)

        onComplete()
    }

    const renderStep = () => {
        switch (STEPS[currentStep]) {
            case 'basics':
                return (
                    <div className="onboard-step">
                        <h1 className="bootcamp-title">CHAVEZ BOOTCAMP</h1>
                        <h2 className="step-title">THE BASICS</h2>
                        <p className="step-subtitle">Let's get your stats, soldier.</p>

                        <div className="form-group">
                            <label className="form-label">Age</label>
                            <input
                                type="number"
                                className="form-input"
                                placeholder="Your age"
                                value={formData.age}
                                onChange={e => updateForm('age', e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Height</label>
                            <div className="height-inputs">
                                <div className="height-field">
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder="5"
                                        min="3"
                                        max="8"
                                        value={formData.heightFeet}
                                        onChange={e => updateForm('heightFeet', e.target.value)}
                                    />
                                    <span className="height-unit">ft</span>
                                </div>
                                <div className="height-field">
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder="10"
                                        min="0"
                                        max="11"
                                        value={formData.heightInches}
                                        onChange={e => updateForm('heightInches', e.target.value)}
                                    />
                                    <span className="height-unit">in</span>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Current Weight (lbs)</label>
                            <input
                                type="number"
                                className="form-input"
                                placeholder="Your current weight"
                                value={formData.currentWeight}
                                onChange={e => updateForm('currentWeight', e.target.value)}
                            />
                        </div>
                    </div>
                )

            case 'goals':
                return (
                    <div className="onboard-step">
                        <h1 className="bootcamp-title">CHAVEZ BOOTCAMP</h1>
                        <h2 className="step-title">YOUR MISSION</h2>
                        <p className="step-subtitle">What are we fighting for?</p>

                        <div className="form-group">
                            <label className="form-label">Goal</label>
                            <select
                                className="form-input form-select"
                                value={formData.goal}
                                onChange={e => updateForm('goal', e.target.value)}
                            >
                                <option value="weight_loss">Weight Loss</option>
                                <option value="muscle_gain">Build Muscle</option>
                                <option value="general_fitness">General Fitness</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Goal Weight (lbs)</label>
                            <input
                                type="number"
                                className="form-input"
                                placeholder="Target weight"
                                value={formData.goalWeight}
                                onChange={e => updateForm('goalWeight', e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Timeframe</label>
                            <select
                                className="form-input form-select"
                                value={formData.timeframe}
                                onChange={e => updateForm('timeframe', e.target.value)}
                            >
                                <option value="3">3 Months</option>
                                <option value="6">6 Months</option>
                                <option value="9">9 Months</option>
                                <option value="12">1 Year</option>
                            </select>
                        </div>
                    </div>
                )

            case 'health':
                return (
                    <div className="onboard-step">
                        <h1 className="bootcamp-title">CHAVEZ BOOTCAMP</h1>
                        <h2 className="step-title">HEALTH CHECK</h2>
                        <p className="step-subtitle">Any limitations I should know about?</p>

                        <div className="form-group">
                            <label className="form-label">Allergies (optional)</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g., nuts, dairy"
                                value={formData.allergies}
                                onChange={e => updateForm('allergies', e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Medical Conditions (optional)</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g., diabetes, high blood pressure"
                                value={formData.medicalConditions}
                                onChange={e => updateForm('medicalConditions', e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Injuries / Pain Areas</label>
                            <div className="injury-list">
                                {['shoulder', 'back', 'knee', 'hip', 'wrist', 'ankle'].map(injury => (
                                    <div key={injury} className="injury-item">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={formData.injuries.includes(injury)}
                                                onChange={e => {
                                                    if (e.target.checked) {
                                                        updateForm('injuries', [...formData.injuries, injury])
                                                    } else {
                                                        updateForm('injuries', formData.injuries.filter(i => i !== injury))
                                                        // Clear rating when unchecked
                                                        const newRatings = { ...formData.injuryRatings }
                                                        delete newRatings[injury]
                                                        setFormData(prev => ({ ...prev, injuryRatings: newRatings }))
                                                    }
                                                }}
                                            />
                                            <span>{injury.charAt(0).toUpperCase() + injury.slice(1)}</span>
                                        </label>

                                        {/* Pain Rating - show only when injury is selected */}
                                        {formData.injuries.includes(injury) && (
                                            <div className="pain-rating">
                                                <span className="pain-label">Pain Level:</span>
                                                <div className="pain-buttons">
                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                                        <button
                                                            key={num}
                                                            type="button"
                                                            className={`pain-btn ${formData.injuryRatings[injury] === num ? 'selected' : ''}`}
                                                            onClick={() => updateInjuryRating(injury, num)}
                                                        >
                                                            {num}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )

            case 'location':
                return (
                    <div className="onboard-step">
                        <h1 className="bootcamp-title">CHAVEZ BOOTCAMP</h1>
                        <h2 className="step-title">YOUR BATTLEFIELD</h2>
                        <p className="step-subtitle">Where will you train?</p>

                        <div className="form-group">
                            <label className="form-label">Workout Location</label>
                            <div className="option-cards">
                                {[
                                    { value: 'home', icon: Icons.battleHome, label: 'Home' },
                                    { value: 'gym', icon: Icons.battleGym, label: 'Gym' },
                                    { value: 'both', icon: Icons.battleBoth, label: 'Both' }
                                ].map(opt => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        className={`option-card ${formData.workoutLocation === opt.value ? 'selected' : ''}`}
                                        onClick={() => updateForm('workoutLocation', opt.value)}
                                    >
                                        <span className="option-icon">{opt.icon}</span>
                                        <span className="option-label">{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {(formData.workoutLocation === 'home' || formData.workoutLocation === 'both') && (
                            <div className="form-group">
                                <label className="form-label">Available Equipment</label>
                                <div className="checkbox-group">
                                    {['dumbbells', 'resistance_bands', 'pullup_bar', 'bench', 'barbell', 'kettlebell'].map(equip => (
                                        <label key={equip} className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={formData.equipment.includes(equip)}
                                                onChange={e => {
                                                    if (e.target.checked) {
                                                        updateForm('equipment', [...formData.equipment, equip])
                                                    } else {
                                                        updateForm('equipment', formData.equipment.filter(i => i !== equip))
                                                    }
                                                }}
                                            />
                                            <span>{equip.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label">Budget Level</label>
                            <select
                                className="form-input form-select"
                                value={formData.budget}
                                onChange={e => updateForm('budget', e.target.value)}
                            >
                                <option value="low">Low - Minimal spending</option>
                                <option value="medium">Medium - Some investment</option>
                                <option value="high">High - Willing to invest</option>
                            </select>
                        </div>
                    </div>
                )

            case 'schedule':
                return (
                    <div className="onboard-step">
                        <h1 className="bootcamp-title">CHAVEZ BOOTCAMP</h1>
                        <h2 className="step-title">COMMIT TO THE MISSION</h2>
                        <p className="step-subtitle">How many days can you show up?</p>

                        <div className="form-group">
                            <label className="form-label">Days Per Week</label>
                            <div className="days-selector">
                                {[3, 4, 5, 6].map(num => (
                                    <button
                                        key={num}
                                        type="button"
                                        className={`day-btn ${formData.daysPerWeek === num ? 'selected' : ''}`}
                                        onClick={() => updateForm('daysPerWeek', num)}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                            <p className="text-muted text-center mt-sm">
                                {formData.daysPerWeek} days per week is solid. Consistency beats intensity.
                            </p>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Preferred Time</label>
                            <select
                                className="form-input form-select"
                                value={formData.preferredTime}
                                onChange={e => updateForm('preferredTime', e.target.value)}
                            >
                                <option value="morning">Morning (0500 - 0900)</option>
                                <option value="midday">Midday (1100 - 1400)</option>
                                <option value="afternoon">Afternoon (1500 - 1800)</option>
                                <option value="evening">Evening (1900 - 2200)</option>
                            </select>
                        </div>
                    </div>
                )

            case 'why':
                return (
                    <div className="onboard-step">
                        <h1 className="bootcamp-title">CHAVEZ BOOTCAMP</h1>
                        <h2 className="step-title">YOUR WHY</h2>
                        <p className="step-subtitle">Why are you doing this? Be honest. This will keep you going when it gets hard.</p>

                        <div className="form-group">
                            <textarea
                                className="form-input why-textarea"
                                placeholder="I'm doing this because..."
                                value={formData.whyStatement}
                                onChange={e => updateForm('whyStatement', e.target.value)}
                                rows={5}
                            />
                        </div>

                        <p className="text-muted text-center">
                            Write this for yourself. No one else will see it. Be real.
                        </p>
                    </div>
                )

            default:
                return null
        }
    }

    const canProceed = () => {
        switch (STEPS[currentStep]) {
            case 'basics':
                return formData.age && formData.heightFeet && formData.currentWeight
            case 'goals':
                return formData.goalWeight && formData.goal && formData.timeframe
            case 'health':
                return true
            case 'location':
                return formData.workoutLocation && formData.budget
            case 'schedule':
                return formData.daysPerWeek
            case 'why':
                return formData.whyStatement.length >= 10
            default:
                return false
        }
    }

    const isLastStep = currentStep === STEPS.length - 1
    const progress = ((currentStep + 1) / STEPS.length) * 100

    return (
        <div className="onboarding-container">
            <div className="onboarding-progress">
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <span className="progress-text">{currentStep + 1} / {STEPS.length}</span>
            </div>

            <div className="onboarding-content">
                {renderStep()}
            </div>

            <div className="onboarding-nav">
                {currentStep > 0 && (
                    <button className="btn btn-ghost" onClick={prevStep}>
                        Back
                    </button>
                )}

                <button
                    className="btn btn-primary btn-large"
                    onClick={isLastStep ? handleComplete : nextStep}
                    disabled={!canProceed()}
                    style={{ marginLeft: 'auto' }}
                >
                    {isLastStep ? 'BEGIN TRAINING' : 'Continue'}
                </button>
            </div>
        </div>
    )
}

export default Onboarding
