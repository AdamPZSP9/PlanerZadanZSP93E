import { useState, useEffect } from 'react'

const STORAGE_KEY = 'planer_events'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function save(events) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
}

export function useEvents() {
  const [events, setEvents] = useState(load)

  useEffect(() => { save(events) }, [events])

  function addEvent(event) {
    const newEvent = { ...event, id: crypto.randomUUID() }
    setEvents(prev => [...prev, newEvent])
  }

  function removeEvent(id) {
    setEvents(prev => prev.filter(e => e.id !== id))
  }

  function updateEvent(id, changes) {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...changes } : e))
  }

  function eventsForDate(dateKey) {
    return events
      .filter(e => e.date === dateKey)
      .sort((a, b) => (a.time || '').localeCompare(b.time || ''))
  }

  function upcomingEvents() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return events
      .filter(e => new Date(e.date) >= today)
      .sort((a, b) => {
        const dateCmp = a.date.localeCompare(b.date)
        return dateCmp !== 0 ? dateCmp : (a.time || '').localeCompare(b.time || '')
      })
  }

  return { events, addEvent, removeEvent, updateEvent, eventsForDate, upcomingEvents }
}
