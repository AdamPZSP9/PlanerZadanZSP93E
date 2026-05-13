import './upcoming.css'

const CAT_COLORS = {
  praca:    '#4a7c6b',
  prywatne: '#7b5ea7',
  deadline: '#b85c4a',
}

const CAT_LABELS = {
  praca: 'Praca', prywatne: 'Prywatne', deadline: 'Deadline',
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return new Intl.DateTimeFormat('pl-PL', {
    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
  }).format(d)
}

export default function UpcomingView({ events, onDelete }) {
  if (events.length === 0) {
    return (
      <div className="upcoming">
        <div className="upcoming__empty">Brak nadchodzących wydarzeń</div>
      </div>
    )
  }

  let lastDate = null

  return (
    <div className="upcoming">
      {events.map(ev => {
        const showDate = ev.date !== lastDate
        lastDate = ev.date
        return (
          <div key={ev.id}>
            {showDate && (
              <div className="upcoming__date-header">{formatDate(ev.date)}</div>
            )}
            <div className="upcoming__row">
              <span
                className="upcoming__dot"
                style={{ background: CAT_COLORS[ev.category] ?? CAT_COLORS.praca }}
              />
              <div className="upcoming__info">
                <span className="upcoming__title">{ev.title}</span>
                <span className="upcoming__meta">
                  {ev.category && <span style={{ color: CAT_COLORS[ev.category] }}>{CAT_LABELS[ev.category]}</span>}
                  {ev.time && ` · ${ev.time}`}
                  {ev.duration && ` · ${ev.duration} min`}
                </span>
              </div>
              <button className="upcoming__delete" onClick={() => onDelete(ev.id)}>✕</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
