import { useState, useEffect } from 'react'
import './modal.css'

export const CATEGORIES = {
  praca:    { label: 'Praca',    color: '#4a7c6b' },
  prywatne: { label: 'Prywatne', color: '#7b5ea7' },
  deadline: { label: 'Deadline', color: '#b85c4a' },
}

const EMPTY_FORM = { title: '', time: '', duration: '', category: 'praca' }

export default function DayModal({ date, dateKey, initialTime = '', events, onAdd, onDelete, onUpdate, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    if (!editing) {
      setForm({ ...EMPTY_FORM, time: initialTime || '' })
    }
  }, [dateKey, initialTime, editing])

  const label = new Intl.DateTimeFormat('pl-PL', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(date)

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  function handleField(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    const payload = {
      title: form.title.trim(),
      date: dateKey,
      time: form.time,
      duration: form.duration,
      category: form.category,
    }
    if (editing) {
      onUpdate(editing, payload)
      setEditing(null)
    } else {
      onAdd(payload)
    }
    setForm(EMPTY_FORM)
  }

  function startEdit(ev) {
    setEditing(ev.id)
    setForm({
      title: ev.title,
      time: ev.time || '',
      duration: ev.duration || '',
      category: ev.category || 'praca',
    })
  }

  function cancelEdit() {
    setEditing(null)
    setForm(EMPTY_FORM)
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal__header">
          <span className="modal__title">{label}</span>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="modal__events">
          {events.length === 0
            ? <div className="modal__empty">Brak wydarzeń</div>
            : events.map(ev => (
              <div key={ev.id} className="modal__event-row">
                <span
                  className="modal__event-dot"
                  style={{ background: CATEGORIES[ev.category]?.color ?? '#4a7c6b' }}
                />
                <div className="modal__event-info">
                  <span className="modal__event-title">{ev.title}</span>
                  {(ev.time || ev.duration) && (
                    <span className="modal__event-meta">
                      {ev.time && ev.time}
                      {ev.time && ev.duration && ' · '}
                      {ev.duration && `${ev.duration} min`}
                    </span>
                  )}
                </div>
                <div className="modal__event-actions">
                  <button className="modal__event-edit" onClick={() => startEdit(ev)}>✎</button>
                  <button className="modal__event-delete" onClick={() => onDelete(ev.id)}>✕</button>
                </div>
              </div>
            ))
          }
        </div>

        <form className="modal__form" onSubmit={handleSubmit}>
          <div className="modal__form-row">
            <label className="modal__form-label">
              {editing ? 'Edytuj wydarzenie' : 'Nowe wydarzenie'}
            </label>
            <input
              className="modal__input"
              type="text"
              name="title"
              placeholder="Tytuł..."
              value={form.title}
              onChange={handleField}
              autoFocus
              maxLength={80}
            />
          </div>

          <div className="modal__form-cols">
            <div>
              <label className="modal__form-label">Godzina (HH:MM)</label>
              <input
                className="modal__input"
                type="text"
                name="time"
                value={form.time}
                placeholder="08:00"
                pattern="^([01]\d|2[0-3]):[0-5]\d$"
                inputMode="numeric"
                maxLength={5}
                onChange={handleField}
                title="Wprowadź godzinę w formacie 24-godzinnym, np. 08:30"
              />
            </div>
            <div>
              <label className="modal__form-label">Czas (min)</label>
              <input
                className="modal__input"
                type="number"
                name="duration"
                placeholder="60"
                min="1"
                max="1440"
                value={form.duration}
                onChange={handleField}
              />
            </div>
          </div>

          <div>
            <label className="modal__form-label">Kategoria</label>
            <div className="modal__cats">
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <button
                  key={key}
                  type="button"
                  className={`modal__cat${form.category === key ? ' modal__cat--active' : ''}`}
                  style={{ '--cat-color': cat.color }}
                  onClick={() => setForm(f => ({ ...f, category: key }))}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="modal__form-btns">
            <button className="modal__submit" type="submit">
              {editing ? 'Zapisz' : 'Dodaj'}
            </button>
            {editing && (
              <button className="modal__cancel" type="button" onClick={cancelEdit}>
                Anuluj
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
