import { useState, useMemo } from 'react'

function buildGrid(year, month) {
  const firstDay = new Date(year, month, 1).getDay()
  const offset = (firstDay + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev = new Date(year, month, 0).getDate()

  const cells = []

  for (let i = offset - 1; i >= 0; i--) {
    cells.push({ day: daysInPrev - i, currentMonth: false, date: new Date(year, month - 1, daysInPrev - i) })
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

export function useCalendar() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const grid = useMemo(() => buildGrid(year, month), [year, month])

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }

  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  function isToday(date) {
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    )
  }

  function dateKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }

  return { year, month, grid, prevMonth, nextMonth, isToday, dateKey }
}
