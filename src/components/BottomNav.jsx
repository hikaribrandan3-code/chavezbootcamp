/**
 * Chavez Bootcamp - Bottom Navigation
 * Using SVG icons instead of emojis
 */

import { NavLink } from 'react-router-dom'
import { Icons } from './Icons.jsx'
import './BottomNav.css'

function BottomNav() {
    const navItems = [
        { path: '/home', icon: Icons.navHome, label: 'Home' },
        { path: '/train', icon: Icons.navTrain, label: 'Train' },
        { path: '/camera', icon: Icons.navCamera, label: 'Camera', isCenter: true },
        { path: '/nutrition', icon: Icons.navNutrition, label: 'Fuel' },
        { path: '/progress', icon: Icons.navProgress, label: 'Progress' }
    ]

    return (
        <nav className="bottom-nav">
            {navItems.map(item => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                        `nav-item ${item.isCenter ? 'nav-item-camera' : ''} ${isActive ? 'active' : ''}`
                    }
                >
                    <span className="nav-icon">{item.icon}</span>
                    {!item.isCenter && <span className="nav-label">{item.label}</span>}
                </NavLink>
            ))}
        </nav>
    )
}

export default BottomNav
