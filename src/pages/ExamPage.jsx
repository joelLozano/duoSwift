import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { unitQuestions, isUnitComplete, EXAM_PASS, isFinalExam } from '../data/index.js'
import { useProgress } from '../context/ProgressContext.jsx'
import Question, { isAnswered, isCorrect } from '../components/Question.jsx'
import ResultScreen, { fmtTime } from '../components/ResultScreen.jsx'
import { Rich } from '../components/Code.jsx'
import { examConfig } from './Exams.jsx'
import { shuffle } from '../lib/game.js'

function pickFinal(course, count) {
  // Reparte preguntas equitativamente entre las unidades del curso
  const perUnit = Math.ceil(count / course.units.length)
  return shuffle(course.units.flatMap((u) => shuffle(unitQuestions(u.id)).slice(0, perUnit))).slice(0, count)
}

export default function ExamPage() {
  const { examId } = useParams()
  const navigate = useNavigate()
  const { progress, saveExam, answer } = useProgress()
  const cfg = examConfig(examId)
  const [phase, setPhase] = useState('intro') // intro | running | done
  const [attempt, setAttempt] = useState(0)
  const questions = useMemo(() => {
    if (!cfg) return []
    return isFinalExam(examId) ? pickFinal(cfg.course, cfg.count) : shuffle(unitQuestions(examId)).slice(0, cfg.count)
  }, [examId, attempt]) // eslint-disable-line react-hooks/exhaustive-deps
  const [answers, setAnswers] = useState({})
  const [idx, setIdx] = useState(0)
  const [remaining, setRemaining] = useState(0)
  const [result, setResult] = useState(null)
  const startedAt = useRef(0)

  const finish = useCallback(() => {
    const correct = questions.filter((q) => isCorrect(q, answers[q.id])).length
    const score = correct / questions.length
    const seconds = Math.round((Date.now() - startedAt.current) / 1000)
    const passed = score >= EXAM_PASS
    const xp = passed ? Math.round(score * (isFinalExam(examId) ? 80 : 30)) : 5
    questions.forEach((q) => answer(q.id, isCorrect(q, answers[q.id])))
    saveExam(examId, { score: correct, total: questions.length, date: Date.now(), seconds }, xp)
    setResult({ correct, score, seconds, passed, xp })
    setPhase('done')
  }, [questions, answers, examId, answer, saveExam])

  // Temporizador
  useEffect(() => {
    if (phase !== 'running') return
    const t = setInterval(() => {
      const left = cfg.minutes * 60 - Math.floor((Date.now() - startedAt.current) / 1000)
      setRemaining(left)
      if (left <= 0) {
        clearInterval(t)
        finish()
      }
    }, 500)
    return () => clearInterval(t)
  }, [phase, cfg, finish])

  if (!cfg) return <Navigate to="/exams" replace />
  if (cfg.unit && !isUnitComplete(cfg.unit, progress.lessons)) return <Navigate to="/exams" replace />

  const start = () => {
    setAnswers({})
    setIdx(0)
    startedAt.current = Date.now()
    setRemaining(cfg.minutes * 60)
    setPhase('running')
  }

  if (phase === 'intro') {
    const prev = progress.exams[examId] || []
    return (
      <div className="session">
        <div className="session-center">
          <div className="big-emoji">{cfg.icon}</div>
          <h1>{cfg.title}</h1>
          <ul className="rules">
            <li>📋 {questions.length} preguntas</li>
            <li>⏱️ {cfg.minutes} minutos</li>
            <li>🎯 Apruebas con {Math.round(EXAM_PASS * 100)}%</li>
            <li>🙈 Sin retroalimentación hasta el final; puedes navegar entre preguntas</li>
          </ul>
          {prev.length > 0 && <p className="muted small">Intentos previos: {prev.map((r) => `${Math.round((r.score / r.total) * 100)}%`).join(' · ')}</p>}
          <div className="stack">
            <button className="btn btn-primary btn-lg" onClick={start}>Comenzar examen</button>
            <button className="btn btn-ghost" onClick={() => navigate('/exams')}>Volver</button>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'done') {
    return (
      <div className="exam-results">
        <ResultScreen
          emoji={result.passed ? '🏆' : '📚'}
          title={result.passed ? '¡Aprobaste!' : 'Sigue practicando'}
          subtitle={cfg.title}
          stats={[
            { label: 'Calificación', value: `${Math.round(result.score * 100)}%`, color: result.passed ? 'var(--green)' : 'var(--red)' },
            { label: 'Aciertos', value: `${result.correct}/${questions.length}`, color: 'var(--blue)' },
            { label: 'XP', value: `+${result.xp}` },
            { label: 'Tiempo', value: fmtTime(result.seconds), color: 'var(--purple)' },
          ]}
        >
          <button className="btn btn-primary btn-lg" onClick={() => { setAttempt((a) => a + 1); setPhase('intro') }}>Intentar de nuevo</button>
          <button className="btn btn-ghost" onClick={() => navigate('/exams')}>Volver a exámenes</button>
        </ResultScreen>
        <section className="exam-review">
          <h2>Revisión</h2>
          {questions.map((q, i) => {
            const ok = isCorrect(q, answers[q.id])
            return (
              <div key={q.id} className={`card review-item ${ok ? 'ok' : 'bad'}`}>
                <div className="ri-head">{ok ? '✅' : '❌'} Pregunta {i + 1}{!isAnswered(q, answers[q.id]) && ' · sin responder'}</div>
                <Question q={q} value={answers[q.id]} onChange={() => {}} locked status={ok ? 'correct' : 'wrong'} />
                {q.ex && <p className="feedback-ex"><Rich text={q.ex} /></p>}
              </div>
            )
          })}
        </section>
      </div>
    )
  }

  const q = questions[idx]
  const answeredCount = questions.filter((x) => isAnswered(x, answers[x.id])).length
  const low = remaining <= 60

  return (
    <div className="session">
      <header className="session-top">
        <button className="icon-btn" onClick={() => confirm('¿Salir del examen? Perderás este intento.') && navigate('/exams')} aria-label="Salir">✕</button>
        <div className="progressbar"><div className="progressbar-fill blue" style={{ width: `${(answeredCount / questions.length) * 100}%` }} /></div>
        <div className={`timer ${low ? 'low' : ''}`}>⏱ {fmtTime(Math.max(0, remaining))}</div>
      </header>

      <div className="exam-nav">
        {questions.map((x, i) => (
          <button key={x.id} className={`qdot ${i === idx ? 'active' : ''} ${isAnswered(x, answers[x.id]) ? 'answered' : ''}`} onClick={() => setIdx(i)}>{i + 1}</button>
        ))}
      </div>

      <main className="session-body" key={q.id}>
        <Question q={q} value={answers[q.id]} onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))} />
      </main>

      <footer className="session-footer">
        <div className="footer-inner row">
          <button className="btn btn-ghost keep" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>← Anterior</button>
          {idx < questions.length - 1 ? (
            <button className="btn btn-secondary btn-lg" onClick={() => setIdx(idx + 1)}>Siguiente →</button>
          ) : (
            <button
              className="btn btn-primary btn-lg"
              onClick={() => (answeredCount === questions.length || confirm(`Te faltan ${questions.length - answeredCount} preguntas. ¿Entregar de todos modos?`)) && finish()}
            >
              Entregar
            </button>
          )}
        </div>
      </footer>
    </div>
  )
}
