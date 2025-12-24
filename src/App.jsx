import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { hasCompletedOnboarding, getUserProfile, getWorkoutPlan, setWorkoutPlan } from './utils/storage.js'
import { generateWorkoutPlan } from './utils/workoutGenerator.js'

// Pages
import Onboarding from './pages/Onboarding.jsx'
import Home from './pages/Home.jsx'
import Train from './pages/Train.jsx'
import Camera from './pages/Camera.jsx'
import Nutrition from './pages/Nutrition.jsx'
import Progress from './pages/Progress.jsx'
import Settings from './pages/Settings.jsx'

// Components
import BottomNav from './components/BottomNav.jsx'
import AIChatbot from './components/AIChatbot.jsx'

import './index.css'

/**
 * Chavez Bootcamp - V1.0
 * Military-style personal fitness training PWA
 */
export const VERSION = 'Chavez Bootcamp v1.0'

function AppContent() {
    const location = useLocation()
    const navigate = useNavigate()
    const [isOnboarded, setIsOnboarded] = useState(false)
    const [showChatbot, setShowChatbot] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check onboarding status
        const onboarded = hasCompletedOnboarding()
        setIsOnboarded(onboarded)

        // If onboarded but no workout plan, generate one
        if (onboarded && !getWorkoutPlan()) {
            const plan = generateWorkoutPlan()
            if (plan) setWorkoutPlan(plan)
        }

        setLoading(false)
    }, [])

    // Refresh onboarding status when navigating
    useEffect(() => {
        const onboarded = hasCompletedOnboarding()
        if (onboarded !== isOnboarded) {
            setIsOnboarded(onboarded)

            // Generate workout plan after onboarding
            if (onboarded && !getWorkoutPlan()) {
                const plan = generateWorkoutPlan()
                if (plan) setWorkoutPlan(plan)
            }
        }
    }, [location.pathname])

    // Show loading state
    if (loading) {
        return (
            <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div className="text-accent text-center">
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>CHAVEZ BOOTCAMP</h2>
                    <p className="text-muted mt-md">Loading...</p>
                </div>
            </div>
        )
    }

    // Routes that should show bottom nav
    const showNav = isOnboarded && !location.pathname.includes('/onboarding')
    const showAIButton = showNav && location.pathname !== '/camera'

    return (
        <div className="app-container">
            <Routes>
                {/* Redirect root to appropriate page */}
                <Route
                    path="/"
                    element={isOnboarded ? <Navigate to="/home" replace /> : <Navigate to="/onboarding" replace />}
                />

                {/* Onboarding - accessible anytime */}
                <Route path="/onboarding" element={<Onboarding onComplete={() => {
                    setIsOnboarded(true)
                    // Reset navigation stack - prevent back button
                    window.history.replaceState(null, '', '/home')
                    navigate('/home', { replace: true })
                }} />} />

                {/* Protected routes - require onboarding */}
                <Route path="/home" element={isOnboarded ? <Home /> : <Navigate to="/onboarding" replace />} />
                <Route path="/train" element={isOnboarded ? <Train /> : <Navigate to="/onboarding" replace />} />
                <Route path="/camera" element={isOnboarded ? <Camera /> : <Navigate to="/onboarding" replace />} />
                <Route path="/nutrition" element={isOnboarded ? <Nutrition /> : <Navigate to="/onboarding" replace />} />
                <Route path="/progress" element={isOnboarded ? <Progress /> : <Navigate to="/onboarding" replace />} />
                <Route path="/settings" element={isOnboarded ? <Settings /> : <Navigate to="/onboarding" replace />} />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* Bottom Navigation */}
            {showNav && <BottomNav />}

            {/* Floating AI Button */}
            {showAIButton && (
                <button
                    className="fab-ai"
                    onClick={() => setShowChatbot(true)}
                    aria-label="Open AI Coach"
                >
                    🎖️
                </button>
            )}

            {/* AI Chatbot Modal */}
            {showChatbot && (
                <AIChatbot onClose={() => setShowChatbot(false)} />
            )}
        </div>
    )
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    )
}

export default App
