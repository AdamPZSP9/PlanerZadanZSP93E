import './calendar.css'

const WEEKDAYS = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd']

const CAT_COLORS = {
  praca:    '#4a7c6b',
  prywatne: '#7b5ea7',
  deadline: '#b85c4a',
}

export default function Calendar({ grid, isToday, dateKey, eventsForDate, onDayClick, onMoveEvent }) {
  function handleDrop(event, key) {
    event.preventDefault()
    const id = event.dataTransfer.getData('text/plain')
    if (id) onMoveEvent(id, key)
  }

  return (
    <div className="calendar">
      <div className="calendar__weekdays">
        {WEEKDAYS.map((weekday, index) => (
          <div
            key={weekday}
            className={`calendar__weekday${index >= 5 ? ' calendar__weekday--weekend' : ''}`}
          >
            {weekday}
          </div>
        ))}
      </div>

      <div className="calendar__grid">
        {grid.map((cell, index) => {
          const key = dateKey(cell.date)
          const dayEvents = eventsForDate(key)
          const visible = dayEvents.slice(0, 2)
          const extra = dayEvents.length - visible.length

          return (
            <div
              key={index}
              className={['calendar__cell', !cell.currentMonth ? 'calendar__cell--outside' : '', cell.currentMonth && isToday(cell.date) ? 'calendar__cell--today' : ''].join(' ')}
              onClick={() => onDayClick(key, cell.date)}
              onDragOver={event => event.preventDefault()}
              onDrop={event => handleDrop(event, key)}
            >
              <div className="cell__day">{cell.day}</div>
              <div className="cell__events">
                {visible.map(ev => (
                  <div
                    key={ev.id}
                    className="cell__event"
                    title={ev.title}
                    draggable
                    onDragStart={event => {
                      event.dataTransfer.setData('text/plain', ev.id)
                      event.dataTransfer.effectAllowed = 'move'
                    }}
                    style={{ background: CAT_COLORS[ev.category] ?? CAT_COLORS.praca }}
                  >
                    {ev.time && <span className="cell__event-time">{ev.time}</span>}
                    {ev.title}
                  </div>
                ))}
                {extra > 0 && (
                  <div className="cell__more">+{extra} więcej</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
