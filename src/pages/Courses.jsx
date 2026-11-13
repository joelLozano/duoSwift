import { useNavigate } from 'react-router-dom'
import { courses } from '../data/index.js'
import { useProgress } from '../context/ProgressContext.jsx'
import { courseLessonsDone, courseMastery } from '../lib/selectors.js'

export default function Courses() {
  const { progress, enroll, setActiveCourse, leaveCourse } = useProgress()
  const navigate = useNavigate()
  const first = progress.enrolled.length === 0

  const start = (id) => {
    enroll(id)
    navigate('/')
  }
  const switchTo = (id) => {
    setActiveCourse(id)
    navigate('/')
  }

  return (
    <div className="page">
      <h1 className="page-title">{first ? '¿Qué quieres aprender?' : '📚 Mis cursos'}</h1>
      <p className="muted">
        {first
          ? 'Elige un curso para empezar. Puedes inscribirte en varios y cambiar entre ellos cuando quieras: tu XP, racha y vidas son compartidos; las lecciones, lecturas, exámenes y repasos son de cada curso.'
          : 'Inscríbete en varios cursos y cambia entre ellos. Tu XP, racha y vidas son compartidos.'}
      </p>

      <div className="course-grid">
        {courses.map((c) => {
          const enrolled = progress.enrolled.includes(c.id)
          const active = progress.activeCourse === c.id
          const done = courseLessonsDone(progress, c)
          const pct = done / c.lessons.length
          const modules = [...new Set(c.units.map((u) => u.module).filter(Boolean))]
          return (
            <article key={c.id} className={`card course-card ${active ? 'active' : ''}`} style={{ '--unit': c.color }}>
              <header className="cc-head">
                <div className="cc-icon">{c.icon}</div>
                <div className="grow">
                  <h2>{c.title}</h2>
                  <div className="muted small">{c.tagline}</div>
                </div>
                {active && <span className="pill done">Actual</span>}
              </header>
              <p>{c.description}</p>
              <div className="cc-meta">
                <span className="pill ghost">🎚️ {c.level}</span>
                <span className="pill ghost">🧱 {c.units.length} unidades</span>
                <span className="pill ghost">❓ {c.questions.length} preguntas</span>
                <span className="pill ghost">💼 {c.interview.length} de entrevista</span>
              </div>
              {modules.length > 0 && (
                <ol className="cc-modules">
                  {modules.map((m) => <li key={m}>{m.replace(/^Módulo \d+ · /, '')}</li>)}
                </ol>
              )}
              <div className="muted small">📚 Fuentes: {c.sourcesNote}</div>
              {enrolled && (
                <div className="cc-progress">
                  <div className="progressbar slim"><div className="progressbar-fill" style={{ width: `${pct * 100}%`, background: c.color }} /></div>
                  <span className="muted small">{done}/{c.lessons.length} lecciones · dominio {Math.round(courseMastery(progress, c) * 100)}%</span>
                </div>
              )}
              <div className="cc-actions">
                {!enrolled && <button className="btn btn-primary" onClick={() => start(c.id)}>{first ? 'Empezar este curso' : 'Inscribirme'}</button>}
                {enrolled && !active && <button className="btn btn-secondary" onClick={() => switchTo(c.id)}>Cambiar a este curso</button>}
                {enrolled && active && <button className="btn btn-primary" onClick={() => navigate('/')}>Continuar</button>}
                {enrolled && progress.enrolled.length > 1 && (
                  <button className="btn btn-ghost" onClick={() => leaveCourse(c.id)} title="Tu progreso se conserva">Quitar de mis cursos</button>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
