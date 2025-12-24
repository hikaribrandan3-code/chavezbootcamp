/**
 * Chavez Bootcamp - Onboarding Page
 * Perfect Loop: Name input, battlefield selection, persist & lock
 */

import { useState } from 'react'
import { setUserProfile, setWorkoutPlan } from '../utils/storage.js'
import { generateWorkoutPlan } from '../utils/workoutGenerator.js'
import { Icons } from '../components/Icons.jsx'
import './Onboarding.css'

const STEPS = [
    'name',      // NEW: Ask for name first
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
        // Name (NEW)
        name: '',

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
        injuryRatings: {},

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
            onboardingComplete: true,
            hasLaunched: true  // Perfect Loop flag
        }

        setUserProfile(profile)

        const plan = generateWorkoutPlan()
        if (plan) setWorkoutPlan(plan)

        onComplete()
    }

    const renderStep = () => {
        switch (STEPS[currentStep]) {
            // NEW: Name Step
            case 'name':
                return (
                    <div className="onboard-step name-step">
                        <h1 className="bootcamp-title">CHAVEZ BOOTCAMP</h1>
                        <div className="name-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M248,120h-8V88a16,16,0,0,0-16-16H208V64a16,16,0,0,0-16-16H168a16,16,0,0,0-16,16v56H104V64A16,16,0,0,0,88,48H64A16,16,0,0,0,48,64v8H32A16,16,0,0,0,16,88v32H8a8,8,0,0,0,0,16h8v32a16,16,0,0,0,16,16H48v8a16,16,0,0,0,16,16H88a16,16,0,0,0,16-16V136h48v56a16,16,0,0,0,16,16h24a16,16,0,0,0,16-16v-8h16a16,16,0,0,0,16-16V136h8a8,8,0,0,0,0-16ZM32,168V88H48v80Zm56,24H64V64H88V192Zm104,0H168V64h24V175.82c0,.06,0,.12,0,.18s0,.12,0,.18V192Zm32-24H208V88h16Z"></path>
                            </svg>
                        </div>
                        <h2 className="step-title">WHAT SHOULD I CALL YOU, SOLDIER?</h2>
                        <p className="step-subtitle">This is how I'll address you. Make it count.</p>

                        <div className="form-group name-input-group">
                            <input
                                type="text"
                                className="form-input name-input"
                                placeholder="Your name or callsign"
                                value={formData.name}
                                onChange={e => updateForm('name', e.target.value)}
                                autoFocus
                                autoComplete="off"
                            />
                        </div>
                    </div>
                )

            case 'basics':
                return (
                    <div className="onboard-step">
                        <h1 className="bootcamp-title">CHAVEZ BOOTCAMP</h1>
                        <h2 className="step-title">THE BASICS</h2>
                        <p className="step-subtitle">Let's get your stats, {formData.name || 'soldier'}.</p>

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
                        <p className="step-subtitle">What are we fighting for, {formData.name || 'soldier'}?</p>

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
                                                        const newRatings = { ...formData.injuryRatings }
                                                        delete newRatings[injury]
                                                        setFormData(prev => ({ ...prev, injuryRatings: newRatings }))
                                                    }
                                                }}
                                            />
                                            <span>{injury.charAt(0).toUpperCase() + injury.slice(1)}</span>
                                        </label>

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
                        <p className="step-subtitle">Where will you train, {formData.name || 'soldier'}?</p>

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
                        <p className="step-subtitle">Why are you doing this, {formData.name || 'soldier'}? Be honest.</p>

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
                            This will keep you going when it gets hard. Be real.
                        </p>
                    </div>
                )

            default:
                return null
        }
    }

    const canProceed = () => {
        switch (STEPS[currentStep]) {
            case 'name':
                return formData.name.length >= 2
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
                return formData.whyStatement.length >= 3
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
