import { useState } from 'react'
import TopBar from './navigation/TopBar/topbar'
import Calendar from './components/Calendar/Calendar'
import WeekView from './components/Calendar/WeekView'
import DayModal from './components/Modal/DayModal'
import UpcomingView from './components/Upcoming/UpcomingView'
import { useCalendar } from './hooks/useCalendar'
import { useEvents } from './hooks/useEvents'

export default function App() {
  const [view, setView] = useState('calendar')
  const [modal, setModal] = useState(null)
  const [selectedDay, setSelectedDay] = useState(new Date())

  const {
    year,
    month,
    monthLabel,
    grid,
    weekDates,
    prevMonth,
    nextMonth,
    prevWeek,
    nextWeek,
    isToday,
    dateKey,
    setActiveDate,
  } = useCalendar()

  const {
    events,
    addEvent,
    removeEvent,
    updateEvent,
    moveEvent,
    eventsForDate,
    upcomingEvents,
    exportToICS,
  } = useEvents()

  function handleDayClick(key, date, time = '') {
    setSelectedDay(date)
    setModal({ key, date, time })
  }

  function handleClose() {
    setModal(null)
  }

  function handleExport() {
    const ics = exportToICS(events)
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'planer-wydarzen.ics'
    link.click()
    URL.revokeObjectURL(link.href)
  }

  function handleNavigateBack() {
    if (view === 'week') prevWeek()
    else prevMonth()
  }

  function handleNavigateNext() {
    if (view === 'week') nextWeek()
    else nextMonth()
  }

  function formatShortDate(date) {
    return new Intl.DateTimeFormat('pl-PL', {
      day: '2-digit',
      month: '2-digit',
    }).format(date)
  }

  const viewTitle = view === 'week'
    ? `Tydzień ${weekDates.length ? `${formatShortDate(weekDates[0])} – ${formatShortDate(weekDates[6])}` : ''}`
    : `${monthLabel} ${year}`

  return (
    <div className="app">
      <TopBar />
      <div className="app__controls">
        <div className="app__nav">
          <button type="button" onClick={handleNavigateBack}>◀</button>
          <span className="app__title">{viewTitle}</span>
          <button type="button" onClick={handleNavigateNext}>▶</button>
        </div>
        <div className="app__actions">
          <button
            type="button"
            className={view === 'calendar' ? 'app__action--active' : ''}
            onClick={() => setView('calendar')}
          >
            Miesiąc
          </button>
          <button
            type="button"
            className={view === 'week' ? 'app__action--active' : ''}
            onClick={() => {
              setActiveDate(selectedDay)
              setView('week')
            }}
          >
            Tydzień
          </button>
          <button
            type="button"
            className={view === 'upcoming' ? 'app__action--active' : ''}
            onClick={() => setView('upcoming')}
          >
            Nadchodzące
          </button>
          <button type="button" className="app__export" onClick={handleExport}>
            Eksport ICS
          </button>
        </div>
      </div>

      <main className="app__main">
        {view === 'calendar' && (
          <Calendar
            grid={grid}
            isToday={isToday}
            dateKey={dateKey}
            eventsForDate={eventsForDate}
            onDayClick={handleDayClick}
            onMoveEvent={moveEvent}
          />
        )}

        {view === 'week' && (
          <WeekView
            weekDates={weekDates}
            dateKey={dateKey}
            eventsForDate={eventsForDate}
            onDayClick={handleDayClick}
            onMoveEvent={moveEvent}
            isToday={isToday}
          />
        )}

        {view === 'upcoming' && (
          <UpcomingView events={upcomingEvents()} onDelete={removeEvent} />
        )}
      </main>

      {modal && (
        <DayModal
          date={modal.date}
          dateKey={modal.key}
          initialTime={modal.time}
          events={eventsForDate(modal.key)}
          onAdd={addEvent}
          onDelete={removeEvent}
          onUpdate={updateEvent}
          onClose={handleClose}
        />
      )}
    </div>
  )
}
