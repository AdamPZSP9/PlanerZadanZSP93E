import { useState } from 'react'
import TopBar from './navigation/TopBar/TopBar'
import Calendar from './components/Calendar/Calendar'
import DayModal from './components/Modal/DayModal'
import UpcomingView from './components/Upcoming/UpcomingView'
import { useCalendar } from './hooks/useCalendar'
import { useEvents } from './hooks/useEvents'

export default function App() {
  const { year, month, grid, prevMonth, nextMonth, isToday, dateKey } = useCalendar()
  const { addEvent, removeEvent, updateEvent, eventsForDate, upcomingEvents } = useEvents()

  const [modal, setModal] = useState(null)
  const [view, setView] = useState('calendar')

  function handleDayClick(key, date) {
    setModal({ key, date })
  }

  function handleClose() {
    setModal(null)
  }

  return (
    <div>
      <TopBar
        year={year}
        month={month}
        onPrev={prevMonth}
        onNext={nextMonth}
        view={view}
        onViewChange={setView}
      />
      <main>
        {view === 'calendar' && (
          <Calendar
            grid={grid}
            isToday={isToday}
            dateKey={dateKey}
            eventsForDate={eventsForDate}
            onDayClick={handleDayClick}
          />
        )}
        {view === 'upcoming' && (
          <UpcomingView
            events={upcomingEvents()}
            onDelete={removeEvent}
          />
        )}
      </main>

      {modal && (
        <DayModal
          date={modal.date}
          dateKey={modal.key}
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
