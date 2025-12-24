/**
 * Chavez Bootcamp - Camera Page
 * Rev 3: In-app live camera preview with upgraded UI
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
    const [cameraError, setCameraError] = useState(null)

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
        setCameraError(null)
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode,
                    width: { ideal: 1080 },
                    height: { ideal: 1920 }
                },
                audio: false
            })

            setStream(mediaStream)
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream
            }
            setView('capture')
        } catch (err) {
            console.error('Camera error:', err)
            setCameraError('Unable to access camera. Please check permissions.')
        }
    }

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop())
            setStream(null)
        }
        setView('main')
        setCapturedPhoto(null)
        setCameraError(null)
    }

    const flipCamera = async () => {
        const newMode = facingMode === 'user' ? 'environment' : 'user'
        setFacingMode(newMode)

        if (stream) {
            stream.getTracks().forEach(track => track.stop())

            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: newMode,
                        width: { ideal: 1080 },
                        height: { ideal: 1920 }
                    },
                    audio: false
                })

                setStream(mediaStream)
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream
                }
            } catch (err) {
                console.error('Flip camera error:', err)
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

        // Mirror the image if using front camera
        if (facingMode === 'user') {
            ctx.translate(canvas.width, 0)
            ctx.scale(-1, 1)
        }

        ctx.drawImage(video, 0, 0)

        const photoData = canvas.toDataURL('image/jpeg', 0.9)
        setCapturedPhoto(photoData)
    }

    const savePhoto = () => {
        if (!capturedPhoto) return

        // Use existing save logic (UNTOUCHED)
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
                        <span className="action-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M208,56H180.28L166.65,35.56A8,8,0,0,0,160,32H96a8,8,0,0,0-6.65,3.56L75.71,56H48A24,24,0,0,0,24,80V192a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V80A24,24,0,0,0,208,56Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8H80a8,8,0,0,0,6.66-3.56L100.28,48h55.43l13.63,20.44A8,8,0,0,0,176,72h32a8,8,0,0,1,8,8ZM128,88a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,88Zm0,72a28,28,0,1,1,28-28A28,28,0,0,1,128,160Z"></path>
                            </svg>
                        </span>
                        <span className="action-label">TAKE PROGRESS PHOTO</span>
                        <span className="action-desc">Front, side, or back view</span>
                    </button>

                    <button className="camera-action-card" onClick={() => setView('log')}>
                        <span className="action-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M239.28,175.65c-13-23.4-29.38-45.39-48.72-65.34A153.18,153.18,0,0,0,64.53,40.8a8,8,0,0,0-6,5.73L32.82,138.83A16,16,0,0,0,43.36,158l48.13,14.62a8.06,8.06,0,0,0,4.62,0l24.68-7.45a8,8,0,0,0,5.68-8.37l-2.8-35.84a8,8,0,0,1,6.53-8.56l29.13-5.36a8,8,0,0,1,7.32,2.12l17.78,17.78a8,8,0,0,1,0,11.32,8,8,0,0,0,0,11.31,8,8,0,0,0,11.31,0l17.78-17.78a24,24,0,0,0,0-33.94L196.78,80.87a24,24,0,0,0-21.95-6.36l-29.13,5.36a24,24,0,0,0-19.58,25.68l2.8,35.84-13.84,4.18L71.19,134.82l21.88-79a137.21,137.21,0,0,1,106.39,62.93c17.62,18.28,32.31,38.46,43.76,60.09a8,8,0,1,0,14.06-7.62Z"></path>
                            </svg>
                        </span>
                        <span className="action-label">LOG WEIGHT</span>
                        <span className="action-desc">Current: {getLatestWeight() || '--'} lbs</span>
                    </button>
                </div>

                {/* Camera Error */}
                {cameraError && (
                    <div className="camera-error">
                        <p>{cameraError}</p>
                    </div>
                )}

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

    // Capture View - In-App Live Camera
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
                            style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
                        />

                        {/* Guide Overlay */}
                        <div className="camera-guide">
                            <div className="guide-silhouette" />
                            <p className="guide-text">Position yourself in frame</p>
                        </div>

                        {/* Camera Controls */}
                        <div className="camera-controls">
                            <button className="control-btn close-btn" onClick={stopCamera}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                                    <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                                </svg>
                            </button>

                            <button className="capture-btn" onClick={capturePhoto}>
                                <span className="capture-ring" />
                                <span className="capture-inner" />
                            </button>

                            <button className="control-btn flip-btn" onClick={flipCamera}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                                    <path d="M224,48V96a8,8,0,0,1-8,8H168a8,8,0,0,1,0-16h28.69L168,59.31A80,80,0,0,0,88.57,58.37a8,8,0,1,1-9.18-13.1A96,96,0,0,1,177.91,48H179.3L168,36.69,192.69,12,229.66,48.97ZM176.61,210.73a80,80,0,0,1-98-3.42L59.31,188H88a8,8,0,0,0,0-16H40a8,8,0,0,0-8,8v48a8,8,0,0,0,16,0V204.69l29.66,29.65a96,96,0,0,0,108.22,3.28,8,8,0,1,0-9.18-13.1Z"></path>
                                </svg>
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <img src={capturedPhoto} alt="Captured" className="captured-preview" />

                        <div className="capture-actions">
                            <button className="btn btn-secondary btn-large" onClick={retakePhoto}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                                    <path d="M224,128a96,96,0,0,1-94.71,96H128a95.38,95.38,0,0,1-66.24-26.3,8,8,0,1,1,11.06-11.56A80,80,0,1,0,128,48a79.28,79.28,0,0,0-57.61,24.61L82.82,84.69A8,8,0,0,1,77.17,98H32a8,8,0,0,1-8-8V45.17a8,8,0,0,1,13.66-5.66L50.82,52.68A96,96,0,0,1,224,128Z"></path>
                                </svg>
                                RETAKE
                            </button>
                            <button className="btn btn-primary btn-large" onClick={savePhoto}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                                    <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
                                </svg>
                                SAVE
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
