import { Link, useNavigate } from 'react-router-dom'
import { isLessonUnlocked, isReadingDone, isUnitComplete, EXAM_PASS } from '../data/index.js'
import { useProgress } from '../context/ProgressContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { dueQuestions, todayXp, unitMastery, useCourse } from '../lib/selectors.js'

const OFFSETS = [0, 46, 70, 46, 0, -46, -70, -46]

export default function Learn() {
  const { progress } = useProgress()
  const { user } = useAuth()
  const navigate = useNavigate()
  const course = useCourse()
  const { units } = course
  const lp = progress.lessons
  const nextLesson = course.lessons.find((l) => !lp[l.id])
  const due = dueQuestions(progress, [course.id]).length
  const xpToday = todayXp(progress)
  const goalDone = xpToday >= progress.dailyGoal
  const nextNeedsReading = nextLesson && !isReadingDone(nextLesson.unitId, progress.readings)
  const nextUnit = nextLesson && units.find((u) => u.id === nextLesson.unitId)

  return (
    <div className="learn">
      <section className="hello card">
        <div>
          <div className="course-chip" style={{ '--unit': course.color }}>{course.icon} {course.title}</div>
          <h1>¡Hola, {user.name.split(' ')[0]}!</h1>
          <p className="muted">
            {goalDone ? '🎉 Cumpliste tu meta diaria.' : `Meta diaria: ${xpToday}/${progress.dailyGoal} XP`}
          </p>
          <div className="progressbar slim"><div className="progressbar-fill gold" style={{ width: `${Math.min(100, (xpToday / progress.dailyGoal) * 100)}%` }} /></div>
        </div>
        <div className="hello-actions">
          {nextLesson ? (
            nextNeedsReading ? (
              <button className="btn btn-primary" onClick={() => navigate(`/readings/${nextLesson.unitId}`)}>
                📖 Leer · {nextUnit.title}
              </button>
            ) : (
              <button className="btn btn-primary" onClick={() => navigate(`/lesson/${nextLesson.id}`)}>
                {course.lessons.some((l) => lp[l.id]) ? 'Continuar' : 'Empezar'} · {nextLesson.title}
              </button>
            )
          ) : (
            <Link className="btn btn-primary" to={`/exam/${course.finalExamId}`}>🏆 Examen final</Link>
          )}
          {due > 0 && <Link className="btn btn-secondary" to="/review">🔁 Repasar {due}</Link>}
        </div>
      </section>

      {units.map((u, ui) => {
        const showModule = u.module && u.module !== units[ui - 1]?.module
        const unlocked = isLessonUnlocked(u.lessons[0].id, lp)
        const complete = isUnitComplete(u, lp)
        const examBest = Math.max(0, ...(progress.exams[u.id] || []).map((r) => r.score / r.total))
        const mastery = unitMastery(progress, u)
        const read = isReadingDone(u.id, progress.readings)
        return (
          <div key={u.id}>
          {showModule && <h2 className="module-title">{u.module}</h2>}
          <section className={`unit ${unlocked ? '' : 'locked'}`} style={{ '--unit': u.color }}>
            <header className="unit-banner">
              <div>
                <div className="unit-label">Unidad {u.index + 1}</div>
                <h2>{u.icon} {u.title}</h2>
                <p>{u.subtitle}</p>
              </div>
              <div className="unit-actions">
                <Link
                  to={`/readings/${u.id}`}
                  className={`pill ${read ? 'done' : ''} ${unlocked && !read ? 'pulse-pill' : ''}`}
                  title={read ? 'Lectura completada' : 'Lee esta unidad para desbloquear sus lecciones'}
                >
                  {read ? '✓' : '📖'} <span className="hide-xs">Lectura</span>
                </Link>
                <span className="pill ghost" title="Dominio">{Math.round(mastery * 100)}%</span>
              </div>
            </header>

            <div className="path">
              {u.lessons.map((l, i) => {
                const done = Boolean(lp[l.id])
                const open = isLessonUnlocked(l.id, lp)
                const current = open && !done
                const mustRead = current && !read // la lección toca, pero falta la lectura
                const off = OFFSETS[(i + u.index * 2) % OFFSETS.length]
                return (
                  <div key={l.id} className="path-row" style={{ transform: `translateX(${off}px)` }}>
                    {current && <div className="start-bubble">{mustRead ? 'LEE PRIMERO' : 'EMPEZAR'}</div>}
                    <button
                      className={`node ${done ? 'done' : ''} ${current ? 'current' : ''} ${open ? '' : 'locked'}`}
                      disabled={!open}
                      onClick={() => navigate(mustRead ? `/readings/${u.id}` : `/lesson/${l.id}`)}
                      aria-label={`${l.title}${done ? ' (completada)' : mustRead ? ' (primero haz la lectura)' : ''}`}
                    >
                      {done ? (lp[l.id].best === 1 ? '👑' : '✓') : mustRead ? '📖' : open ? '★' : '🔒'}
                    </button>
                    <div className="node-label">{l.title}</div>
                  </div>
                )
              })}
              <div className="path-row" style={{ transform: `translateX(${OFFSETS[(u.lessons.length + u.index * 2) % OFFSETS.length]}px)` }}>
                <button
                  className={`node chest ${complete ? 'open' : 'locked'} ${examBest >= EXAM_PASS ? 'done' : ''}`}
                  disabled={!complete}
                  onClick={() => navigate(`/exam/${u.id}`)}
                  aria-label="Examen de la unidad"
                >
                  {examBest >= EXAM_PASS ? '🏆' : '📝'}
                </button>
                <div className="node-label">Examen {examBest > 0 ? `· ${Math.round(examBest * 100)}%` : ''}</div>
              </div>
            </div>
          </section>
          </div>
        )
      })}

      <section className="unit final" style={{ '--unit': course.color }}>
        <header className="unit-banner">
          <div>
            <div className="unit-label">Meta</div>
            <h2>🏆 Examen final</h2>
            <p>40 preguntas de todo el curso de {course.title}. Disponible cuando quieras practicar.</p>
          </div>
          <Link className="pill" to={`/exam/${course.finalExamId}`}>Empezar</Link>
        </header>
      </section>
    </div>
  )
}
