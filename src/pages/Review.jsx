import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext.jsx'
import { dueQuestions, weakQuestions, dueInterview, learnedCount, seenQuestions, useCourse } from '../lib/selectors.js'
import { courseById } from '../data/index.js'
import QuizSession from '../components/QuizSession.jsx'
import ResultScreen, { fmtTime } from '../components/ResultScreen.jsx'
import { shuffle } from '../lib/game.js'

const DAY = 86400000

export default function Review() {
  const { progress, completeReview } = useProgress()
  const [session, setSession] = useState(null) // { questions, kind }
  const [result, setResult] = useState(null)
  const course = useCourse()
  const [scope, setScope] = useState('course') // course | all
  const ids = scope === 'all' ? progress.enrolled : [course.id]
  const scopeQuestions = ids.flatMap((id) => courseById[id].questions)

  const due = dueQuestions(progress, ids)
  const weak = weakQuestions(progress, ids, 10)
  const seenList = seenQuestions(progress, ids)
  const seen = seenList.length
  const now = Date.now()
  const cards = seenList.map((q) => progress.srs[q.id])
  const in24h = cards.filter((c) => c.due > now && c.due <= now + DAY).length
  const in7d = cards.filter((c) => c.due > now + DAY && c.due <= now + 7 * DAY).length
  const interviewDue = dueInterview(progress, course).length

  if (result) {
    return (
      <div className="overlay-page">
        <ResultScreen
          emoji="🧠"
          title="¡Repaso completado!"
          subtitle="Tu memoria se fortalece cada vez que recuerdas algo justo antes de olvidarlo. +1 ❤️"
          stats={[
            { label: 'XP', value: `+${result.xp}` },
            { label: 'Aciertos', value: `${result.correctFirstTry}/${result.total}`, color: 'var(--green)' },
            { label: 'Tiempo', value: fmtTime(result.seconds), color: 'var(--blue)' },
          ]}
        >
          <button className="btn btn-primary btn-lg" onClick={() => setResult(null)}>Listo</button>
        </ResultScreen>
      </div>
    )
  }

  if (session) {
    return (
      <div className="overlay-page">
        <QuizSession
          questions={session.questions}
          title={session.kind}
          onExit={() => setSession(null)}
          onComplete={(r) => {
            const xp = Math.max(5, r.correctFirstTry * 2)
            completeReview(xp)
            setSession(null)
            setResult({ ...r, xp })
          }}
        />
      </div>
    )
  }

  return (
    <div className="page">
      <h1 className="page-title">🔁 Repaso espaciado</h1>
      {progress.enrolled.length > 1 && (
        <div className="seg" style={{ display: 'inline-flex', margin: '6px 0 12px' }}>
          <button className={scope === 'course' ? 'active' : ''} onClick={() => setScope('course')}>{course.icon} {course.title}</button>
          <button className={scope === 'all' ? 'active' : ''} onClick={() => setScope('all')}>Todos mis cursos</button>
        </div>
      )}
      <p className="muted">
        Cada pregunta que respondes se programa con el algoritmo SM-2: si la aciertas, vuelve a aparecer en intervalos cada vez más largos (1 día, 3 días, 1 semana…); si fallas, vuelve pronto.
      </p>

      <div className="grid-3">
        <div className="stat-card" style={{ '--c': 'var(--red)' }}><div className="sc-value">{due.length}</div><div className="sc-label">Pendientes ahora</div></div>
        <div className="stat-card" style={{ '--c': 'var(--blue)' }}><div className="sc-value">{in24h}</div><div className="sc-label">En las próximas 24 h</div></div>
        <div className="stat-card" style={{ '--c': 'var(--green)' }}><div className="sc-value">{scope === 'all' ? progress.enrolled.reduce((a, id) => a + learnedCount(progress, courseById[id]), 0) : learnedCount(progress, course)}<small>/{scopeQuestions.length}</small></div><div className="sc-label">Conceptos consolidados</div></div>
      </div>

      {seen === 0 ? (
        <div className="card empty">
          <div className="big-emoji">🌱</div>
          <h3>Aún no hay nada que repasar</h3>
          <p className="muted">Completa tu primera lección y sus preguntas entrarán al sistema de repaso.</p>
          <Link className="btn btn-primary" to="/">Ir a aprender</Link>
        </div>
      ) : (
        <div className="review-actions">
          <button className="card action-card" disabled={!due.length} onClick={() => setSession({ questions: due.slice(0, 15), kind: 'Repaso' })}>
            <span className="ac-icon">⏰</span>
            <span>
              <b>Repasar pendientes</b>
              <span className="muted">{due.length ? `${Math.min(15, due.length)} preguntas · recupera 1 vida` : 'Nada pendiente. ¡Vas al día!'}</span>
            </span>
          </button>
          <button className="card action-card" onClick={() => setSession({ questions: shuffle(weak), kind: 'Puntos débiles' })}>
            <span className="ac-icon">🎯</span>
            <span>
              <b>Practicar puntos débiles</b>
              <span className="muted">Las {weak.length} preguntas que menos dominas</span>
            </span>
          </button>
          <button
            className="card action-card"
            onClick={() => setSession({ questions: shuffle(seenList).slice(0, 12), kind: 'Mezcla' })}
          >
            <span className="ac-icon">🎲</span>
            <span>
              <b>Práctica aleatoria</b>
              <span className="muted">12 preguntas de todo lo que has visto</span>
            </span>
          </button>
          <Link className="card action-card" to="/interview">
            <span className="ac-icon">💼</span>
            <span>
              <b>Tarjetas de entrevista</b>
              <span className="muted">{interviewDue ? `${interviewDue} pendientes` : 'Repasa respuestas clave'}</span>
            </span>
          </Link>
        </div>
      )}
      {seen > 0 && <p className="muted small">Próxima semana: {in7d} preguntas programadas.</p>}
    </div>
  )
}
