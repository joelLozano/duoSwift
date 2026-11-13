import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useProgress } from '../context/ProgressContext.jsx'
import { currentStreak, levelInfo } from '../lib/game.js'
import { dueQuestions, todayXp, useCourse } from '../lib/selectors.js'
import { courseById } from '../data/index.js'
import ErrorBoundary from './ErrorBoundary.jsx'

const NAV = [
  { to: '/', label: 'Aprender', icon: '🏠', end: true },
  { to: '/review', label: 'Repaso', icon: '🔁', badge: 'due' },
  { to: '/readings', label: 'Lecturas', icon: '📖' },
  { to: '/exams', label: 'Exámenes', icon: '📝' },
  { to: '/interview', label: 'Entrevista', icon: '💼' },
  { to: '/progress', label: 'Progreso', icon: '📊' },
]

// Selector de curso (estilo bandera de idioma en Duolingo)
function CourseSwitcher({ compact = false }) {
  const { progress, setActiveCourse } = useProgress()
  const course = useCourse()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false)
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [open])

  return (
    <div className="switcher" ref={ref}>
      <button className={`switcher-btn ${compact ? 'compact' : ''}`} onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open} title="Cambiar de curso">
        <span className="sw-icon" style={{ '--unit': course.color }}>{course.icon}</span>
        {!compact && <span className="sw-title">{course.title}</span>}
        <span className="sw-caret">▾</span>
      </button>
      {open && (
        <div className="switcher-menu card" role="menu">
          <div className="unit-label muted">Mis cursos</div>
          {progress.enrolled.map((id) => {
            const c = courseById[id]
            return (
              <button
                key={id}
                role="menuitem"
                className={`sw-item ${id === course.id ? 'active' : ''}`}
                onClick={() => { setActiveCourse(id); setOpen(false); navigate('/') }}
              >
                <span className="sw-icon" style={{ '--unit': c.color }}>{c.icon}</span>
                <span className="grow">{c.title}</span>
                {id === course.id && <span>✓</span>}
              </button>
            )
          })}
          <button role="menuitem" className="sw-item add" onClick={() => { setOpen(false); navigate('/courses') }}>
            <span className="sw-icon">＋</span>
            <span className="grow">Explorar cursos</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default function Layout() {
  const { user } = useAuth()
  const { progress } = useProgress()
  const course = useCourse()
  const location = useLocation()
  const due = dueQuestions(progress, [course.id]).length
  const streak = currentStreak(progress)
  const lvl = levelInfo(progress.xp)
  const goalPct = Math.min(1, todayXp(progress) / progress.dailyGoal)
  const hasCourse = progress.enrolled.length > 0

  // Cada pantalla nueva empieza arriba (con llaves: el efecto no debe devolver nada)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/" className="brand">
          <img src="/favicon.svg" alt="" width="36" height="36" />
          <span>duo<b>swift</b></span>
        </Link>
        {hasCourse && <CourseSwitcher />}
        <nav>
          {hasCourse && NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className="nav-item">
              <span className="nav-icon">{n.icon}</span>
              <span>{n.label}</span>
              {n.badge && due > 0 && <span className="badge">{due}</span>}
            </NavLink>
          ))}
          <NavLink to="/courses" className="nav-item">
            <span className="nav-icon">📚</span>
            <span>Cursos</span>
          </NavLink>
          <NavLink to="/profile" className="nav-item">
            <span className="nav-icon">👤</span>
            <span>Perfil</span>
          </NavLink>
        </nav>
      </aside>

      <div className="main-col">
        <header className="topbar">
          {hasCourse ? (
            <div className="topbar-switcher"><CourseSwitcher compact /></div>
          ) : (
            <Link to="/" className="brand brand-sm"><img src="/favicon.svg" alt="" width="30" height="30" /></Link>
          )}
          <div className="stats">
            <span className={`stat ${streak ? 'fire' : 'off'}`} title="Racha de días">🔥 {streak}</span>
            <span className="stat gem" title={`Nivel ${lvl.level}`}>⚡ {progress.xp}</span>
            <span className="stat heart" title="Vidas">❤️ {progress.hearts}</span>
            <span className="stat goal" title="Meta diaria">
              <svg viewBox="0 0 36 36" width="22" height="22" aria-hidden>
                <circle cx="18" cy="18" r="15" fill="none" stroke="var(--line)" strokeWidth="5" />
                <circle cx="18" cy="18" r="15" fill="none" stroke="var(--gold)" strokeWidth="5" strokeDasharray={`${goalPct * 94.2} 94.2`} transform="rotate(-90 18 18)" strokeLinecap="round" />
              </svg>
            </span>
          </div>
          <Link to="/profile" className="avatar" title={user?.name}>{(user?.name || '?').slice(0, 1).toUpperCase()}</Link>
        </header>

        <main className="content" key={course.id + location.pathname.split('/')[1]}>
          {/* key por ruta: al navegar a otra pantalla se reinicia el boundary */}
          <ErrorBoundary key={location.pathname}>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>

      {hasCourse && (
        <nav className="bottom-nav">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className="bnav-item">
              <span className="nav-icon">{n.icon}</span>
              <span className="bnav-label">{n.label}</span>
              {n.badge && due > 0 && <span className="badge">{due}</span>}
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  )
}
