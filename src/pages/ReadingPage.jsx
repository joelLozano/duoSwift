import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { unitById, courseById, isLessonUnlocked } from '../data/index.js'
import { useProgress } from '../context/ProgressContext.jsx'
import { CodeBlock, Rich } from '../components/Code.jsx'

export default function ReadingPage() {
  const { unitId } = useParams()
  const { progress, markReading } = useProgress()
  const unit = unitById[unitId]
  // Llaves obligatorias: un efecto solo puede devolver una función de limpieza
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [unitId])
  if (!unit) return <Navigate to="/readings" replace />

  const isRead = Boolean(progress.readings[unitId])
  const course = courseById[unit.courseId]
  const next = course.units[unit.index + 1]
  const firstLesson = unit.lessons[0]
  const canPractice = isLessonUnlocked(firstLesson.id, progress.lessons)

  return (
    <article className="page reading" style={{ '--unit': unit.color }}>
      <Link to="/readings" className="back">← Lecturas</Link>
      <header className="reading-head">
        <div className="rc-icon big">{unit.icon}</div>
        <div>
          <div className="unit-label">{course.icon} {course.title} · {unit.module ? unit.module : `Unidad ${unit.index + 1}`}</div>
          <h1>{unit.title}</h1>
          <p className="muted">{unit.subtitle}</p>
        </div>
      </header>

      <nav className="toc card">
        <b>En esta lectura</b>
        <ol>
          {unit.reading.map((s, i) => (
            <li key={i}><a href={`#s${i}`}>{s.h}</a></li>
          ))}
        </ol>
      </nav>

      {unit.reading.map((s, i) => (
        <section key={i} id={`s${i}`} className="reading-section">
          <h2>{s.h}</h2>
          <p><Rich text={s.p} /></p>
          {s.code && <CodeBlock code={s.code} />}
        </section>
      ))}

      <section className="sources card">
        <b>📚 Fuentes oficiales</b>
        <ul>
          {unit.sources.map((src) => (
            <li key={src.url}><a href={src.url} target="_blank" rel="noreferrer">{src.label} ↗</a></li>
          ))}
        </ul>
      </section>

      <div className="reading-actions">
        {isRead ? (
          <span className="pill done">✓ Leída</span>
        ) : (
          <button className="btn btn-secondary" onClick={() => markReading(unitId)}>Marcar como leída (+5 XP)</button>
        )}
        {canPractice && <Link className="btn btn-primary" to={`/lesson/${firstLesson.id}`}>Practicar esta unidad</Link>}
        {next && <Link className="btn btn-ghost" to={`/readings/${next.id}`}>Siguiente: {next.title} →</Link>}
      </div>
    </article>
  )
}
