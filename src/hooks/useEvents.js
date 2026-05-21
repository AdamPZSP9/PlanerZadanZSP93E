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

function pad(value) {
  return String(value).padStart(2, '0')
}

function formatDateTime(date, time) {
  const ymd = date.replace(/-/g, '')
  if (!time) return `DTSTART;VALUE=DATE:${ymd}`
  const [hours, minutes] = time.split(':')
  return `DTSTART;TZID=Europe/Warsaw:${ymd}T${pad(hours)}${pad(minutes)}00`
}

function escapeText(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

function buildICS(events) {
  const now = new Date()
  const stamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PlanerZadan//PL',
    'CALSCALE:GREGORIAN',
  ]

  events.forEach(event => {
    lines.push('BEGIN:VEVENT')
    lines.push(`UID:${escapeText(event.id)}`)
    lines.push(`DTSTAMP:${stamp}`)
    lines.push(formatDateTime(event.date, event.time))
    if (event.duration) {
      lines.push(`DURATION:PT${parseInt(event.duration, 10)}M`)
    }
    lines.push(`SUMMARY:${escapeText(event.title)}`)
    lines.push(`CATEGORIES:${escapeText(event.category || 'Praca')}`)
    lines.push('END:VEVENT')
  })

  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
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

  function moveEvent(id, date) {
    updateEvent(id, { date })
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

  return {
    events,
    addEvent,
    removeEvent,
    updateEvent,
    moveEvent,
    eventsForDate,
    upcomingEvents,
    exportToICS: buildICS,
  }
}
