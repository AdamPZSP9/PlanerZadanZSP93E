import { useState, useMemo } from 'react'

const MONTHS = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień',
]

function addDays(date, amount) {
  const result = new Date(date)
  result.setDate(result.getDate() + amount)
  return result
}

function buildMonthGrid(activeDate) {
  const year = activeDate.getFullYear()
  const month = activeDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const offset = (firstDay + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev = new Date(year, month, 0).getDate()
  const cells = []

  for (let i = offset - 1; i >= 0; i--) {
    cells.push({
      day: daysInPrev - i,
      currentMonth: false,
      date: new Date(year, month - 1, daysInPrev - i),
    })
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, currentMonth: true, date: new Date(year, month, d) })
  }

  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, currentMonth: false, date: new Date(year, month + 1, d) })
  }

  return cells
}

function getWeekStart(date) {
  const copy = new Date(date)
  const day = (copy.getDay() + 6) % 7
  return addDays(copy, -day)
}

function buildWeekDates(activeDate) {
  const start = getWeekStart(activeDate)
  return Array.from({ length: 7 }, (_, index) => addDays(start, index))
}

function formatDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function useCalendar() {
  const today = new Date()
  const [activeDate, setActiveDate] = useState(today)

  const year = activeDate.getFullYear()
  const month = activeDate.getMonth()
  const monthLabel = MONTHS[month]

  const grid = useMemo(() => buildMonthGrid(activeDate), [activeDate])
  const weekDates = useMemo(() => buildWeekDates(activeDate), [activeDate])

  function prevMonth() {
    setActiveDate(date => new Date(date.getFullYear(), date.getMonth() - 1, 1))
  }

  function nextMonth() {
    setActiveDate(date => new Date(date.getFullYear(), date.getMonth() + 1, 1))
  }

  function prevWeek() {
    setActiveDate(date => addDays(date, -7))
  }

  function nextWeek() {
    setActiveDate(date => addDays(date, 7))
  }

  function isToday(date) {
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    )
  }

  return {
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
    dateKey: formatDateKey,
    setActiveDate,
  }
}
