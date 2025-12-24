/**
 * Chavez Bootcamp - Nutrition Page
 * Rev 3: Full screen meal modal
 */

import { useState } from 'react'
import { foodFixes, allMeals } from '../data/meals.js'
import './Nutrition.css'

function Nutrition() {
    const [activeCategory, setActiveCategory] = useState('all')
    const [selectedMeal, setSelectedMeal] = useState(null)

    const categories = [
        { id: 'all', label: 'All' },
        { id: 'breakfast', label: 'Breakfast' },
        { id: 'lunch', label: 'Lunch' },
        { id: 'dinner', label: 'Dinner' },
        { id: 'snack', label: 'Snacks' }
    ]

    const getFilteredMeals = () => {
        if (activeCategory === 'all') return allMeals
        return allMeals.filter(m => m.category === activeCategory)
    }

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'breakfast': return (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M80,56V24a8,8,0,0,1,16,0V56a8,8,0,0,1-16,0Zm40,8a8,8,0,0,0,8-8V24a8,8,0,0,0-16,0V56A8,8,0,0,0,120,64Zm32,0a8,8,0,0,0,8-8V24a8,8,0,0,0-16,0V56A8,8,0,0,0,152,64Zm96,56v8a40,40,0,0,1-37.51,39.91,96.59,96.59,0,0,1-27,40.09H208a8,8,0,0,1,0,16H40a8,8,0,0,1,0-16H64.54A96.3,96.3,0,0,1,32,136V88a8,8,0,0,1,8-8H208A40,40,0,0,1,248,120ZM200,96H48v40a80.27,80.27,0,0,0,45.12,72h69.76A80.27,80.27,0,0,0,208,136v-8a8,8,0,0,1,0-16A24,24,0,0,0,232,96Z"></path>
                </svg>
            )
            case 'lunch': return (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M224,104h-8.37a88,88,0,0,0-175.26,0H32a8,8,0,0,0-8,8,104.35,104.35,0,0,0,56,92.28V216a16,16,0,0,0,16,16h64a16,16,0,0,0,16-16v-11.72A104.35,104.35,0,0,0,232,112,8,8,0,0,0,224,104Zm-96-80a72.08,72.08,0,0,1,71.54,64H56.46A72.08,72.08,0,0,1,128,24Zm32,192H96V208h64Zm-2.45-24H98.45A88.33,88.33,0,0,1,40.32,120H215.68A88.33,88.33,0,0,1,157.55,192Z"></path>
                </svg>
            )
            case 'dinner': return (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M88,48V16a8,8,0,0,1,16,0V48a8,8,0,0,1-16,0Zm40,8a8,8,0,0,0,8-8V16a8,8,0,0,0-16,0V48A8,8,0,0,0,128,56Zm32,0a8,8,0,0,0,8-8V16a8,8,0,0,0-16,0V48A8,8,0,0,0,160,56Zm92.8,46.4L224,124v60a32,32,0,0,1-32,32H64a32,32,0,0,1-32-32V124L3.2,102.4a8,8,0,0,1,9.6-12.8L32,104V80a8,8,0,0,1,8-8H216a8,8,0,0,1,8,8v24l19.2-14.4a8,8,0,0,1,9.6,12.8ZM208,88H48v96a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16Z"></path>
                </svg>
            )
            case 'snack': return (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M164.38,181.1a52,52,0,1,1-72.76,0,75.89,75.89,0,0,1-8.07-19.1H64a32,32,0,0,1-32-32V88a8,8,0,0,1,8-8H56V72a8,8,0,0,1,16,0v8h24V72a8,8,0,0,1,16,0v8h24V72a8,8,0,0,1,16,0v8h24V72a8,8,0,0,1,16,0v8h24a8,8,0,0,1,8,8v42a32,32,0,0,1-32,32h-19.55A75.89,75.89,0,0,1,164.38,181.1ZM128,224a36,36,0,1,0-36-36A36,36,0,0,0,128,224Zm64-78V96H64v34a16,16,0,0,0,16,16H176A16,16,0,0,0,192,130Z"></path>
                </svg>
            )
            default: return null
        }
    }

    return (
        <div className="page nutrition-page">
            <h1 className="page-title">FUEL</h1>
            <p className="page-subtitle">10-minute meals. No excuses.</p>

            {/* Category Filter */}
            <div className="category-filter">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat.id)}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Meal Count */}
            <p className="meal-count">{getFilteredMeals().length} meals</p>

            {/* Meals Grid */}
            <div className="meals-grid">
                {getFilteredMeals().map((meal, idx) => (
                    <div
                        key={idx}
                        className="meal-card"
                        onClick={() => setSelectedMeal(meal)}
                    >
                        <div className="meal-header">
                            <span className="meal-category-icon">{getCategoryIcon(meal.category)}</span>
                            <span className="meal-cal">{meal.cal} cal</span>
                        </div>
                        <h3 className="meal-name">{meal.name}</h3>
                        <p className="meal-desc">{meal.desc}</p>
                    </div>
                ))}
            </div>

            {/* Full Screen Meal Detail Modal */}
            {selectedMeal && (
                <div className="fullscreen-modal" onClick={() => setSelectedMeal(null)}>
                    <div className="fullscreen-modal-content" onClick={e => e.stopPropagation()}>
                        {/* Close Button */}
                        <button className="fullscreen-close" onClick={() => setSelectedMeal(null)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                            </svg>
                        </button>

                        <div className="fullscreen-modal-body">
                            <div className="meal-detail-category">{selectedMeal.category.toUpperCase()}</div>
                            <h1 className="meal-detail-title">{selectedMeal.name}</h1>
                            <div className="meal-detail-cal">{selectedMeal.cal} CALORIES</div>

                            <div className="meal-detail-section">
                                <h4>HOW TO MAKE IT</h4>
                                <p>{selectedMeal.desc}</p>
                            </div>

                            <div className="meal-detail-time">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                                    <path d="M128,40a96,96,0,1,0,96,96A96.11,96.11,0,0,0,128,40Zm0,176a80,80,0,1,1,80-80A80.09,80.09,0,0,1,128,216ZM173.66,90.34a8,8,0,0,1,0,11.32l-40,40a8,8,0,0,1-11.32-11.32l40-40A8,8,0,0,1,173.66,90.34ZM96,16a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,16Z"></path>
                                </svg>
                                <span>Ready in under 10 minutes</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Nutrition
