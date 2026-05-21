import './calendar.css'

const WEEKDAYS = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd']
const HOURS = Array.from({ length: 24 }, (_, index) => index)
const CAT_COLORS = {
  praca:    '#4a7c6b',
  prywatne: '#7b5ea7',
  deadline: '#b85c4a',
}

export default function WeekView({ weekDates, dateKey, eventsForDate, onDayClick, onMoveEvent, isToday }) {
  const dayEvents = weekDates.map(date => ({
    key: dateKey(date),
    date,
    events: eventsForDate(dateKey(date)),
  }))

  function handleDrop(event, key) {
    event.preventDefault()
    const id = event.dataTransfer.getData('text/plain')
    if (id) onMoveEvent(id, key)
  }

  function formatHeader(date) {
    return `${WEEKDAYS[date.getDay() === 0 ? 6 : date.getDay() - 1]} ${date.getDate()}`
  }

  return (
    <div className="week-view">
      <div className="week-view__headline">
        <div className="week-view__hour-label">Godz.</div>
        {dayEvents.map(day => {
          const noTimeEvents = day.events.filter(ev => !ev.time)
          return (
            <button
              type="button"
              key={day.key}
              className={`week-view__day${isToday(day.date) ? ' week-view__day--today' : ''}`}
              onClick={() => onDayClick(day.key, day.date)}
              onDragOver={event => event.preventDefault()}
              onDrop={event => handleDrop(event, day.key)}
            >
              <span className="week-view__day-name">{formatHeader(day.date)}</span>
              <span className="week-view__day-count">{day.events.length} wydarzeń</span>
              {noTimeEvents.length > 0 && (
                <div className="week-view__day-notime">
                  {noTimeEvents.map(ev => (
                    <span key={ev.id} className="week-view__day-notime-item">
                      {ev.title}
                    </span>
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>

      <div className="week-view__grid">
        {HOURS.map(hour => (
          <div key={hour} className="week-view__row">
            <div className="week-view__hour-label">{`${hour}:00`}</div>
            {dayEvents.map(day => {
              const cellEvents = day.events.filter(ev => {
                if (!ev.time) return false
                const eventHour = Number(ev.time.split(':')[0])
                if (Number.isNaN(eventHour)) return false
                return eventHour === hour
              })

              return (
                <div
                  key={`${day.key}-${hour}`}
                  className="week-view__cell"
                  onClick={() => onDayClick(day.key, day.date, `${String(hour).padStart(2, '0')}:00`)}
                  onDragOver={event => event.preventDefault()}
                  onDrop={event => handleDrop(event, day.key)}
                >
                  {cellEvents.map(ev => (
                    <div
                      key={ev.id}
                      className="week-view__event"
                      draggable
                      onDragStart={event => {
                        event.dataTransfer.setData('text/plain', ev.id)
                        event.dataTransfer.effectAllowed = 'move'
                      }}
                      style={{ background: CAT_COLORS[ev.category] ?? CAT_COLORS.praca }}
                    >
                      <span className="week-view__event-time">{ev.time}</span>
                      <span className="week-view__event-title">{ev.title}</span>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
