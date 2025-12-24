/**
 * Chavez Bootcamp - Camera Page
 * Progress photos and weight logging
 */

import { useState, useRef, useEffect } from 'react'
import { saveProgressPhoto, getProgressPhotos, logWeight, getWeightLogs, getLatestWeight } from '../utils/storage.js'
import './Camera.css'

function Camera() {
    const [view, setView] = useState('main') // main | capture | gallery | log
    const [photos, setPhotos] = useState([])
    const [weightLogs, setWeightLogs] = useState([])
    const [stream, setStream] = useState(null)
    const [capturedPhoto, setCapturedPhoto] = useState(null)
    const [weightInput, setWeightInput] = useState('')
    const [facingMode, setFacingMode] = useState('user')

    const videoRef = useRef(null)
    const canvasRef = useRef(null)

    useEffect(() => {
        setPhotos(getProgressPhotos())
        setWeightLogs(getWeightLogs())
        setWeightInput(getLatestWeight()?.toString() || '')

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop())
            }
        }
    }, [])

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode, width: { ideal: 1080 }, height: { ideal: 1920 } },
                audio: false
            })

            setStream(mediaStream)
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream
            }
            setView('capture')
        } catch (err) {
            console.error('Camera error:', err)
            alert('Unable to access camera. Please check permissions.')
        }
    }

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop())
            setStream(null)
        }
        setView('main')
        setCapturedPhoto(null)
    }

    const flipCamera = async () => {
        const newMode = facingMode === 'user' ? 'environment' : 'user'
        setFacingMode(newMode)

        if (stream) {
            stream.getTracks().forEach(track => track.stop())

            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: newMode, width: { ideal: 1080 }, height: { ideal: 1920 } },
                audio: false
            })

            setStream(mediaStream)
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream
            }
        }
    }

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return

        const video = videoRef.current
        const canvas = canvasRef.current
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        const ctx = canvas.getContext('2d')
        ctx.drawImage(video, 0, 0)

        const photoData = canvas.toDataURL('image/jpeg', 0.9)
        setCapturedPhoto(photoData)
    }

    const savePhoto = () => {
        if (!capturedPhoto) return

        saveProgressPhoto(capturedPhoto, 'progress')
        setPhotos(getProgressPhotos())
        stopCamera()
    }

    const retakePhoto = () => {
        setCapturedPhoto(null)
    }

    const handleLogWeight = () => {
        if (!weightInput) return

        logWeight(parseFloat(weightInput))
        setWeightLogs(getWeightLogs())
        setView('main')
    }

    // Main View
    if (view === 'main') {
        return (
            <div className="page camera-page">
                <h1 className="page-title">PROGRESS</h1>

                <div className="camera-actions">
                    <button className="camera-action-card" onClick={startCamera}>
                        <span className="action-icon">📷</span>
                        <span className="action-label">TAKE PROGRESS PHOTO</span>
                        <span className="action-desc">Front, side, or back view</span>
                    </button>

                    <button className="camera-action-card" onClick={() => setView('log')}>
                        <span className="action-icon">⚖️</span>
                        <span className="action-label">LOG WEIGHT</span>
                        <span className="action-desc">Current: {getLatestWeight() || '--'} lbs</span>
                    </button>
                </div>

                {/* Recent Photos */}
                {photos.length > 0 && (
                    <div className="recent-photos">
                        <div className="section-header">
                            <h3>RECENT PHOTOS</h3>
                            <button className="btn btn-ghost" onClick={() => setView('gallery')}>
                                View All →
                            </button>
                        </div>

                        <div className="photo-grid">
                            {photos.slice(-4).reverse().map((photo, idx) => (
                                <div key={idx} className="photo-thumb">
                                    <img src={photo.data} alt={`Progress ${idx + 1}`} />
                                    <span className="photo-date">
                                        {new Date(photo.takenAt).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Weight History */}
                {weightLogs.length > 0 && (
                    <div className="weight-history">
                        <h3>RECENT WEIGH-INS</h3>
                        <div className="weight-list">
                            {weightLogs.slice(-5).reverse().map((log, idx) => (
                                <div key={idx} className="weight-item">
                                    <span className="weight-value">{log.weight} lbs</span>
                                    <span className="weight-date">
                                        {new Date(log.loggedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    // Capture View
    if (view === 'capture') {
        return (
            <div className="camera-capture">
                <canvas ref={canvasRef} style={{ display: 'none' }} />

                {!capturedPhoto ? (
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="camera-preview"
                        />

                        {/* Guide Overlay */}
                        <div className="camera-guide">
                            <div className="guide-silhouette" />
                        </div>

                        {/* Camera Controls */}
                        <div className="camera-controls">
                            <button className="control-btn" onClick={stopCamera}>
                                ✕
                            </button>
                            <button className="capture-btn" onClick={capturePhoto}>
                                <span className="capture-inner" />
                            </button>
                            <button className="control-btn" onClick={flipCamera}>
                                🔄
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <img src={capturedPhoto} alt="Captured" className="captured-preview" />

                        <div className="capture-actions">
                            <button className="btn btn-secondary" onClick={retakePhoto}>
                                RETAKE
                            </button>
                            <button className="btn btn-primary" onClick={savePhoto}>
                                SAVE PHOTO
                            </button>
                        </div>
                    </>
                )}
            </div>
        )
    }

    // Gallery View
    if (view === 'gallery') {
        return (
            <div className="page camera-page">
                <div className="gallery-header">
                    <button className="btn btn-ghost" onClick={() => setView('main')}>
                        ← Back
                    </button>
                    <h2>PROGRESS PHOTOS</h2>
                </div>

                <div className="gallery-grid">
                    {photos.map((photo, idx) => (
                        <div key={idx} className="gallery-item">
                            <img src={photo.data} alt={`Progress ${idx + 1}`} />
                            <div className="gallery-item-info">
                                <span>{new Date(photo.takenAt).toLocaleDateString()}</span>
                                {photo.streakDay > 0 && <span>Day {photo.streakDay}</span>}
                            </div>
                        </div>
                    ))}
                </div>

                {photos.length === 0 && (
                    <div className="empty-state">
                        <p>No progress photos yet.</p>
                        <button className="btn btn-primary" onClick={startCamera}>
                            Take Your First Photo
                        </button>
                    </div>
                )}
            </div>
        )
    }

    // Log Weight View
    if (view === 'log') {
        return (
            <div className="page camera-page">
                <div className="log-header">
                    <button className="btn btn-ghost" onClick={() => setView('main')}>
                        ← Back
                    </button>
                    <h2>LOG WEIGHT</h2>
                </div>

                <div className="weight-log-form">
                    <div className="form-group">
                        <label className="form-label">Current Weight (lbs)</label>
                        <input
                            type="number"
                            step="0.1"
                            className="form-input weight-input"
                            value={weightInput}
                            onChange={e => setWeightInput(e.target.value)}
                            placeholder="Enter weight"
                            autoFocus
                        />
                    </div>

                    <p className="text-muted text-center">
                        Track your weight regularly for best results. Aim for mornings after waking up.
                    </p>

                    <button
                        className="btn btn-primary btn-large btn-block"
                        onClick={handleLogWeight}
                        disabled={!weightInput}
                    >
                        LOG WEIGHT
                    </button>
                </div>
            </div>
        )
    }

    return null
}

export default Camera
