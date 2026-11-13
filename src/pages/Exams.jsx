import { Link } from 'react-router-dom'
import { isUnitComplete, EXAM_PASS, courseForExam, isFinalExam, unitById } from '../data/index.js'
import { useProgress } from '../context/ProgressContext.jsx'
import { useCourse } from '../lib/selectors.js'

export function examConfig(examId) {
  const course = courseForExam(examId)
  if (!course) return null
  if (isFinalExam(examId)) return { title: `Examen final · ${course.title}`, count: 40, minutes: 30, icon: '🏆', course }
  const u = unitById[examId]
  const n = u.lessons.reduce((a, l) => a + l.questions.length, 0)
  return { title: `Examen: ${u.title}`, count: Math.min(10, n), minutes: 8, icon: u.icon, unit: u, course }
}

function Best({ results }) {
  if (!results?.length) return <span className="muted small">Sin intentos</span>
  const best = Math.max(...results.map((r) => r.score / r.total))
  return (
    <span className={`pill ${best >= EXAM_PASS ? 'done' : 'ghost'}`}>
      Mejor: {Math.round(best * 100)}% · {results.length} intento{results.length > 1 ? 's' : ''}
    </span>
  )
}

export default function Exams() {
  const { progress } = useProgress()
  const course = useCourse()
  return (
    <div className="page">
      <h1 className="page-title">📝 Exámenes · {course.title}</h1>
      <p className="muted">
        Exámenes cronometrados sin pistas: verás tus resultados y explicaciones al final. Necesitas {Math.round(EXAM_PASS * 100)}% para aprobar. Los exámenes de unidad se desbloquean al completar sus lecciones.
      </p>

      <Link to={`/exam/${course.finalExamId}`} className="card exam-card featured" style={{ '--swift': course.color }}>
        <div className="ec-icon">🏆</div>
        <div className="ec-body">
          <h3>Examen final</h3>
          <p className="muted small">40 preguntas de las {course.units.length} unidades ({course.questions.length} en el banco) · 30 min</p>
          <Best results={progress.exams[course.finalExamId]} />
        </div>
      </Link>

      <div className="exam-list">
        {course.units.map((u) => {
          const open = isUnitComplete(u, progress.lessons)
          const cfg = examConfig(u.id)
          const Comp = open ? Link : 'div'
          return (
            <Comp key={u.id} to={open ? `/exam/${u.id}` : undefined} className={`card exam-card ${open ? '' : 'locked'}`} style={{ '--unit': u.color }}>
              <div className="ec-icon">{open ? u.icon : '🔒'}</div>
              <div className="ec-body">
                <h3>{u.title}</h3>
                <p className="muted small">{cfg.count} preguntas · {cfg.minutes} min</p>
                {open ? <Best results={progress.exams[u.id]} /> : <span className="muted small">Completa las lecciones de la unidad</span>}
              </div>
            </Comp>
          )
        })}
      </div>
    </div>
  )
}
