import './topbar.css'

const MONTHS = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień',
]

export default function TopBar({ year, month, onPrev, onNext, view, onViewChange }) {
  return (
    <header className="topbar">
      <span className="topbar__title">Planer Wydarzeń</span>

      {view === 'calendar' && (
        <nav className="topbar__nav">
          <button onClick={onPrev}>◀</button>
          <span className="topbar__month">{MONTHS[month]} {year}</span>
          <button onClick={onNext}>▶</button>
        </nav>
      )}

      <div className="topbar__views">
        <button
          className={view === 'calendar' ? 'topbar__view-btn--active' : ''}
          onClick={() => onViewChange('calendar')}
        >
          Kalendarz
        </button>
        <button
          className={view === 'upcoming' ? 'topbar__view-btn--active' : ''}
          onClick={() => onViewChange('upcoming')}
        >
          Nadchodzące
        </button>
      </div>
    </header>
  )
}
