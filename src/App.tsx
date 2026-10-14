import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

type Mode = 'focus' | 'short' | 'long'

type Session = {
  id: string
  mode: Mode
  seconds: number
  note: string
  endedAt: string
}

const DURATIONS: Record<Mode, number> = {
  focus: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
}

const MODE_LABEL: Record<Mode, string> = {
  focus: 'Focus',
  short: 'Short break',
  long: 'Long break',
}

const STORAGE_KEY = 'lumen-sessions'

function loadSessions(): Session[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Session[]) : []
  } catch {
    return []
  }
}

function formatTime(total: number) {
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function todayKey(iso: string) {
  return new Date(iso).toDateString()
}

export default function App() {
  const [mode, setMode] = useState<Mode>('focus')
  const [remaining, setRemaining] = useState(DURATIONS.focus)
  const [running, setRunning] = useState(false)
  const [note, setNote] = useState('')
  const [sessions, setSessions] = useState<Session[]>(() => loadSessions())
  const noteRef = useRef(note)
  const modeRef = useRef(mode)
  const finishedRef = useRef(false)

  useEffect(() => {
    noteRef.current = note
  }, [note])

  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  const total = DURATIONS[mode]
  const progress = total === 0 ? 0 : 1 - remaining / total

  /* eslint-disable react/purity -- Date() is intentionally impure; we need the current date to count today's sessions */
  const todayCount = useMemo(() => {
    return sessions.filter((session) => todayKey(session.endedAt) === new Date().toDateString()).length
  }, [sessions])
  /* eslint-enable react/purity */

  function chime() {
    const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = 528
    gain.gain.setValueAtTime(0.08, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.8)
  }

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
  }, [sessions])

  useEffect(() => {
    if (!running) return

    const id = window.setInterval(() => {
      setRemaining((current) => {
        if (current <= 1) {
          setRunning(false)
          return 0
        }
        return current - 1
      })
    }, 1000)

    return () => window.clearInterval(id)
  }, [running])

  useEffect(() => {
    if (remaining !== 0 || finishedRef.current) return
    finishedRef.current = true
    const activeMode = modeRef.current
    const session: Session = {
      id: crypto.randomUUID(),
      mode: activeMode,
      seconds: DURATIONS[activeMode],
      note: noteRef.current.trim(),
      endedAt: new Date().toISOString(),
    }
    setSessions((current) => [session, ...current].slice(0, 40))
    setNote('')
    chime()
  }, [remaining])

  function switchMode(next: Mode) {
    finishedRef.current = false
    setMode(next)
    setRemaining(DURATIONS[next])
    setRunning(false)
  }

  function reset() {
    finishedRef.current = false
    setRemaining(DURATIONS[mode])
    setRunning(false)
  }

  function toggleRun() {
    if (remaining === 0) {
      finishedRef.current = false
      setRemaining(DURATIONS[mode])
    }
    setRunning((value) => (remaining === 0 ? true : !value))
  }

  const radius = 108
  const circ = 2 * Math.PI * radius
  const dash = circ * progress

  return (
    <main className="shell">
      <header className="mast">
        <p className="eyebrow">Study timer</p>
        <h1>Lumen</h1>
        <p className="lede">One orbit per session. Keep the lamp on until the ring closes.</p>
      </header>

      <section className="stage" aria-live="polite">
        <div className="modes" role="tablist" aria-label="Session type">
          {(Object.keys(DURATIONS) as Mode[]).map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              className={item === mode ? 'mode on' : 'mode'}
              aria-selected={item === mode}
              onClick={() => switchMode(item)}
            >
              {MODE_LABEL[item]}
            </button>
          ))}
        </div>

        <div className="orbit">
          <svg viewBox="0 0 240 240" aria-hidden="true">
            <circle className="track" cx="120" cy="120" r={radius} />
            <circle
              className="fill"
              cx="120"
              cy="120"
              r={radius}
              strokeDasharray={`${dash} ${circ}`}
              transform="rotate(-90 120 120)"
            />
          </svg>
          <div className="face">
            <strong>{formatTime(remaining)}</strong>
            <span>{running ? 'In orbit' : remaining === 0 ? 'Ring closed' : 'Ready'}</span>
          </div>
        </div>

        <div className="actions">
          <button type="button" className="primary" onClick={toggleRun}>
            {running ? 'Pause' : remaining === 0 ? 'Start next' : 'Start'}
          </button>
          <button type="button" className="ghost" onClick={reset}>
            Reset
          </button>
        </div>

        <label className="note">
          <span>What are you studying?</span>
          <input
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="React hooks, chapter 4…"
          />
        </label>
      </section>

      <aside className="log">
        <div className="stat">
          <strong>{todayCount}</strong>
          <span>sessions today</span>
        </div>
        <h2>Recent orbits</h2>
        {sessions.length === 0 ? (
          <p className="empty">Start a focus block. Finished sessions land here.</p>
        ) : (
          <ul>
            {sessions.slice(0, 8).map((session) => (
              <li key={session.id}>
                <span className="when">
                  {new Date(session.endedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="what">
                  {MODE_LABEL[session.mode]} · {formatTime(session.seconds)}
                  {session.note ? ` · ${session.note}` : ''}
                </span>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </main>
  )
}
