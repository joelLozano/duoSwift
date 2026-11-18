import { useEffect } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { unitById, courseById, isLessonUnlocked, lessonById } from '../data/index.js'
import { useProgress } from '../context/ProgressContext.jsx'
import { CodeTabs, Rich } from '../components/Code.jsx'
import { PhonePreview, Diagram } from '../components/Illustration.jsx'
import SimpleExplain from '../components/SimpleExplain.jsx'

export default function ReadingPage() {
  const { unitId } = useParams()
  const { progress, markReading } = useProgress()
  const navigate = useNavigate()
  const { state } = useLocation()
  const unit = unitById[unitId]
  // Llaves obligatorias: un efecto solo puede devolver una función de limpieza
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [unitId])
  if (!unit) return <Navigate to="/readings" replace />

  const isRead = Boolean(progress.readings[unitId])
  const course = courseById[unit.courseId]
  const next = course.units[unit.index + 1]
  // Lección a la que volver al terminar: la que intentó abrir o la siguiente pendiente de la unidad
  const pending = lessonById[state?.pendingLesson]?.unitId === unitId ? lessonById[state.pendingLesson] : null
  const nextInUnit = pending || unit.lessons.find((l) => !progress.lessons[l.id] && isLessonUnlocked(l.id, progress.lessons)) || unit.lessons[0]
  const canPractice = isLessonUnlocked(nextInUnit.id, progress.lessons)
  const finish = () => {
    markReading(unitId)
    if (canPractice) navigate(`/lesson/${nextInUnit.id}`)
  }

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

      {!isRead && canPractice && (
        <aside className="callout tip read-gate">
          <b>📖 Primero, la lectura</b>
          <p>Lee esta unidad y toca “Terminé la lectura” al final para desbloquear sus lecciones.</p>
        </aside>
      )}

      {unit.simple && (
        <a href="#facil" className="simple-jump">
          <span aria-hidden="true">🧒</span>
          <span><b>¿Muy técnico?</b> Lee la versión fácil: analogías, gráficos y código explicado paso a paso</span>
          <span aria-hidden="true">↓</span>
        </a>
      )}

      {unit.intro && (
        <div className="reading-intro card">
          <p><Rich text={unit.intro} /></p>
        </div>
      )}

      <nav className="toc card">
        <b>En esta lectura</b>
        <ol>
          {unit.reading.map((s, i) => (
            <li key={i}><a href={`#s${i}`}>{s.h}</a></li>
          ))}
          {unit.summary && <li><a href="#resumen">Resumen</a></li>}
          {unit.simple && <li><a href="#facil">🧒 Explicado fácil</a></li>}
        </ol>
      </nav>

      {unit.reading.map((s, i) => (
        <section key={i} id={`s${i}`} className="reading-section">
          <h2>{s.h}</h2>
          <p><Rich text={s.p} /></p>
          {s.diagramBefore && <Diagram diagram={s.diagramBefore} />}
          {s.code && <CodeTabs code={s.code} />}
          {s.preview && <PhonePreview preview={s.preview} />}
          {s.diagram && <Diagram diagram={s.diagram} />}
          {s.out && (
            <div className="reading-out">
              <span className="reading-out-label">Salida</span>
              <pre>{s.out}</pre>
            </div>
          )}
          {s.after && <p><Rich text={s.after} /></p>}
          {s.tip && (
            <aside className="callout tip"><b>💡 Consejo</b><p><Rich text={s.tip} /></p></aside>
          )}
          {s.warn && (
            <aside className="callout warn"><b>⚠️ Error común</b><p><Rich text={s.warn} /></p></aside>
          )}
        </section>
      ))}

      {unit.summary && (
        <section id="resumen" className="reading-section summary card">
          <h2>Resumen</h2>
          <ul>
            {unit.summary.map((item, i) => <li key={i}><Rich text={item} /></li>)}
          </ul>
        </section>
      )}

      <SimpleExplain simple={unit.simple} />

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
          <>
            <span className="pill done">✓ Leída</span>
            {canPractice && <Link className="btn btn-primary" to={`/lesson/${nextInUnit.id}`}>Practicar esta unidad</Link>}
          </>
        ) : (
          <button className="btn btn-primary" onClick={finish}>
            {canPractice ? 'Terminé la lectura · Empezar lecciones' : 'Terminé la lectura'} (+5 XP)
          </button>
        )}
        {next && <Link className="btn btn-ghost" to={`/readings/${next.id}`}>Siguiente: {next.title} →</Link>}
      </div>
    </article>
  )
}
