/**
 * Chavez Bootcamp - Settings Page
 * Profile editing and app preferences
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserProfile, setUserProfile, getSettings, updateSettings, deleteAllData, getWorkoutPlan, setWorkoutPlan } from '../utils/storage.js'
import { generateWorkoutPlan } from '../utils/workoutGenerator.js'
import './Settings.css'

function Settings() {
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null)
    const [settings, setSettingsState] = useState(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [editingProfile, setEditingProfile] = useState(false)
    const [profileForm, setProfileForm] = useState({})

    useEffect(() => {
        setProfile(getUserProfile())
        setSettingsState(getSettings())
    }, [])

    useEffect(() => {
        if (profile) {
            setProfileForm({
                currentWeight: profile.currentWeight || '',
                goalWeight: profile.goalWeight || '',
                daysPerWeek: profile.daysPerWeek || 3,
                workoutLocation: profile.workoutLocation || 'home'
            })
        }
    }, [profile])

    const handleSettingChange = (key, value) => {
        updateSettings({ [key]: value })
        setSettingsState(prev => ({ ...prev, [key]: value }))
    }

    const handleProfileSave = () => {
        const updatedProfile = {
            ...profile,
            ...profileForm,
            currentWeight: parseFloat(profileForm.currentWeight),
            goalWeight: parseFloat(profileForm.goalWeight),
            daysPerWeek: parseInt(profileForm.daysPerWeek)
        }

        setUserProfile(updatedProfile)
        setProfile(updatedProfile)

        // Regenerate workout plan if relevant fields changed
        if (profile.daysPerWeek !== profileForm.daysPerWeek ||
            profile.workoutLocation !== profileForm.workoutLocation) {
            const newPlan = generateWorkoutPlan()
            if (newPlan) setWorkoutPlan(newPlan)
        }

        setEditingProfile(false)
    }

    const handleDeleteData = () => {
        deleteAllData()
        navigate('/onboarding')
    }

    if (!profile || !settings) {
        return <div className="page">Loading...</div>
    }

    return (
        <div className="page settings-page">
            <h1 className="page-title">SETTINGS</h1>

            {/* Profile Section */}
            <div className="settings-section">
                <h3>PROFILE</h3>

                {!editingProfile ? (
                    <div className="profile-summary">
                        <div className="profile-row">
                            <span className="profile-label">Current Weight</span>
                            <span className="profile-value">{profile.currentWeight} lbs</span>
                        </div>
                        <div className="profile-row">
                            <span className="profile-label">Goal Weight</span>
                            <span className="profile-value">{profile.goalWeight} lbs</span>
                        </div>
                        <div className="profile-row">
                            <span className="profile-label">Days/Week</span>
                            <span className="profile-value">{profile.daysPerWeek}</span>
                        </div>
                        <div className="profile-row">
                            <span className="profile-label">Location</span>
                            <span className="profile-value">{profile.workoutLocation}</span>
                        </div>

                        <button
                            className="btn btn-secondary btn-block mt-lg"
                            onClick={() => setEditingProfile(true)}
                        >
                            Edit Profile
                        </button>
                    </div>
                ) : (
                    <div className="profile-edit">
                        <div className="form-group">
                            <label className="form-label">Current Weight (lbs)</label>
                            <input
                                type="number"
                                className="form-input"
                                value={profileForm.currentWeight}
                                onChange={e => setProfileForm(p => ({ ...p, currentWeight: e.target.value }))}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Goal Weight (lbs)</label>
                            <input
                                type="number"
                                className="form-input"
                                value={profileForm.goalWeight}
                                onChange={e => setProfileForm(p => ({ ...p, goalWeight: e.target.value }))}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Days Per Week</label>
                            <select
                                className="form-input form-select"
                                value={profileForm.daysPerWeek}
                                onChange={e => setProfileForm(p => ({ ...p, daysPerWeek: e.target.value }))}
                            >
                                <option value={3}>3 days</option>
                                <option value={4}>4 days</option>
                                <option value={5}>5 days</option>
                                <option value={6}>6 days</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Workout Location</label>
                            <select
                                className="form-input form-select"
                                value={profileForm.workoutLocation}
                                onChange={e => setProfileForm(p => ({ ...p, workoutLocation: e.target.value }))}
                            >
                                <option value="home">Home</option>
                                <option value="gym">Gym</option>
                                <option value="both">Both</option>
                            </select>
                        </div>

                        <div className="btn-group">
                            <button
                                className="btn btn-ghost"
                                onClick={() => setEditingProfile(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleProfileSave}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Preferences Section */}
            <div className="settings-section">
                <h3>PREFERENCES</h3>

                <div className="setting-row">
                    <div className="setting-info">
                        <span className="setting-label">Units</span>
                    </div>
                    <select
                        className="form-input form-select setting-select"
                        value={settings.units}
                        onChange={e => handleSettingChange('units', e.target.value)}
                    >
                        <option value="lbs">Pounds (lbs)</option>
                        <option value="kg">Kilograms (kg)</option>
                    </select>
                </div>

                <div className="setting-row">
                    <div className="setting-info">
                        <span className="setting-label">Notifications</span>
                    </div>
                    <label className="toggle">
                        <input
                            type="checkbox"
                            checked={settings.notifications}
                            onChange={e => handleSettingChange('notifications', e.target.checked)}
                        />
                        <span className="toggle-slider" />
                    </label>
                </div>

                <div className="setting-row">
                    <div className="setting-info">
                        <span className="setting-label">Coach Messages</span>
                        <span className="setting-desc">Random motivational push notifications</span>
                    </div>
                    <label className="toggle">
                        <input
                            type="checkbox"
                            checked={settings.coachMessages}
                            onChange={e => handleSettingChange('coachMessages', e.target.checked)}
                        />
                        <span className="toggle-slider" />
                    </label>
                </div>
            </div>

            {/* Account Section */}
            <div className="settings-section">
                <h3>ACCOUNT</h3>

                <button
                    className="btn btn-secondary btn-block danger-btn"
                    onClick={() => setShowDeleteConfirm(true)}
                >
                    Delete All Data
                </button>

                <p className="text-muted text-center mt-md text-sm">
                    This will permanently delete all your data including workouts, progress photos, and settings.
                </p>
            </div>

            {/* App Info */}
            <div className="app-info">
                <p>Chavez Bootcamp v1.0</p>
                <p>Built with 💪 for soldiers who don't quit</p>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
                    <div className="modal-content delete-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-body">
                            <h3>Delete All Data?</h3>
                            <p>This action cannot be undone. All your progress, photos, and settings will be permanently deleted.</p>

                            <div className="btn-group">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary danger-btn"
                                    onClick={handleDeleteData}
                                >
                                    Delete Everything
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Settings
