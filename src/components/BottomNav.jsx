/**
 * Chavez Bootcamp - Bottom Navigation
 * Camera icon hardcoded directly - no imports
 */

import { NavLink } from 'react-router-dom'
import './BottomNav.css'

// Hardcoded SVG icons - no external imports
const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
        <path d="M240,208H224V136l2.34,2.34A8,8,0,0,0,237.66,127L139.31,28.68a16,16,0,0,0-22.62,0L18.34,127a8,8,0,0,0,11.32,11.31L32,136v72H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM48,120l80-80,80,80v88H160V152a8,8,0,0,0-8-8H104a8,8,0,0,0-8,8v56H48Zm96,88H112V160h32Z"></path>
    </svg>
)

const TrainIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
        <path d="M248,120h-8V88a16,16,0,0,0-16-16H208V64a16,16,0,0,0-16-16H168a16,16,0,0,0-16,16v56H104V64A16,16,0,0,0,88,48H64A16,16,0,0,0,48,64v8H32A16,16,0,0,0,16,88v32H8a8,8,0,0,0,0,16h8v32a16,16,0,0,0,16,16H48v8a16,16,0,0,0,16,16H88a16,16,0,0,0,16-16V136h48v56a16,16,0,0,0,16,16h24a16,16,0,0,0,16-16v-8h16a16,16,0,0,0,16-16V136h8a8,8,0,0,0,0-16ZM32,168V88H48v80Zm56,24H64V64H88V192Zm104,0H168V64h24V175.82c0,.06,0,.12,0,.18s0,.12,0,.18V192Zm32-24H208V88h16Z"></path>
    </svg>
)

// HARDCODED CAMERA ICON - WHITE FILL FOR GREEN BUTTON
const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#FFFFFF" viewBox="0 0 256 256">
        <path fill="#FFFFFF" d="M201.54,54.46A104,104,0,0,0,54.46,201.54,104,104,0,0,0,201.54,54.46ZM190.23,65.78a88.18,88.18,0,0,1,11,13.48L167.55,119,139.63,40.78A87.34,87.34,0,0,1,190.23,65.78ZM155.59,133l-18.16,21.37-27.59-5L100.41,123l18.16-21.37,27.59,5ZM65.77,65.78a87.34,87.34,0,0,1,56.66-25.59l17.51,49L58.3,74.32A88,88,0,0,1,65.77,65.78ZM46.65,161.54a88.41,88.41,0,0,1,2.53-72.62l51.21,9.35Zm19.12,28.68a88.18,88.18,0,0,1-11-13.48L88.45,137l27.92,78.18A87.34,87.34,0,0,1,65.77,190.22Zm124.46,0a87.34,87.34,0,0,1-56.66,25.59l-17.51-49,81.64,14.91A88,88,0,0,1,190.23,190.22Zm-34.62-32.49,53.74-63.27a88.41,88.41,0,0,1-2.53,72.62Z"></path>
    </svg>
)

const NutritionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
        <path d="M88,48V16a8,8,0,0,1,16,0V48a8,8,0,0,1-16,0Zm40,8a8,8,0,0,0,8-8V16a8,8,0,0,0-16,0V48A8,8,0,0,0,128,56Zm32,0a8,8,0,0,0,8-8V16a8,8,0,0,0-16,0V48A8,8,0,0,0,160,56Zm92.8,46.4L224,124v60a32,32,0,0,1-32,32H64a32,32,0,0,1-32-32V124L3.2,102.4a8,8,0,0,1,9.6-12.8L32,104V80a8,8,0,0,1,8-8H216a8,8,0,0,1,8,8v24l19.2-14.4a8,8,0,0,1,9.6,12.8ZM208,88H48v96a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16Z"></path>
    </svg>
)

const ProgressIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
        <path d="M224,200h-8V40a8,8,0,0,0-8-8H152a8,8,0,0,0-8,8V80H96a8,8,0,0,0-8,8v40H48a8,8,0,0,0-8,8v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16ZM160,48h40V200H160ZM104,96h40V200H104ZM56,144H88v56H56Z"></path>
    </svg>
)

function BottomNav() {
    return (
        <nav className="bottom-nav">
            {/* Home */}
            <NavLink
                to="/home"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
                <span className="nav-icon"><HomeIcon /></span>
                <span className="nav-label">Home</span>
            </NavLink>

            {/* Train */}
            <NavLink
                to="/train"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
                <span className="nav-icon"><TrainIcon /></span>
                <span className="nav-label">Train</span>
            </NavLink>

            {/* Camera - CENTER BUTTON WITH HARDCODED WHITE ICON */}
            <NavLink
                to="/camera"
                className={({ isActive }) => `nav-item nav-item-camera ${isActive ? 'active' : ''}`}
            >
                <span className="nav-icon"><CameraIcon /></span>
            </NavLink>

            {/* Fuel/Nutrition */}
            <NavLink
                to="/nutrition"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
                <span className="nav-icon"><NutritionIcon /></span>
                <span className="nav-label">Fuel</span>
            </NavLink>

            {/* Progress */}
            <NavLink
                to="/progress"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
                <span className="nav-icon"><ProgressIcon /></span>
                <span className="nav-label">Progress</span>
            </NavLink>
        </nav>
    )
}

export default BottomNav
