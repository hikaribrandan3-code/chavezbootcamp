/**
 * Chavez Bootcamp - Day Selector Component
 * 7-day toggle for specific workout day selection
 */

import './DaySelector.css'

const DAYS = [
    { id: 'Mon', label: 'M', full: 'Monday' },
    { id: 'Tue', label: 'T', full: 'Tuesday' },
    { id: 'Wed', label: 'W', full: 'Wednesday' },
    { id: 'Thu', label: 'T', full: 'Thursday' },
    { id: 'Fri', label: 'F', full: 'Friday' },
    { id: 'Sat', label: 'S', full: 'Saturday' },
    { id: 'Sun', label: 'S', full: 'Sunday' },
]

function DaySelector({ selectedDays = [], onChange, minDays = 1 }) {
    const toggleDay = (dayId) => {
        const isSelected = selectedDays.includes(dayId)
        let newSelection

        if (isSelected) {
            // Prevent deselecting if at minimum
            if (selectedDays.length <= minDays) return
            newSelection = selectedDays.filter(d => d !== dayId)
        } else {
            newSelection = [...selectedDays, dayId]
        }

        // Sort by week order (Mon-Sun)
        const dayOrder = DAYS.map(d => d.id)
        newSelection.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b))

        onChange(newSelection)
    }

    return (
        <div className="day-selector">
            <div className="day-selector-grid">
                {DAYS.map((day) => {
                    const active = selectedDays.includes(day.id)
                    return (
                        <button
                            key={day.id}
                            type="button"
                            onClick={() => toggleDay(day.id)}
                            className={`day-btn ${active ? 'selected' : ''}`}
                            title={day.full}
                            aria-pressed={active}
                        >
                            {day.label}
                        </button>
                    )
                })}
            </div>
            <p className="day-selector-count">
                {selectedDays.length} day{selectedDays.length !== 1 ? 's' : ''} selected
            </p>
        </div>
    )
}

export default DaySelector
