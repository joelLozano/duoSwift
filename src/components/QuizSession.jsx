import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Question, { isAnswered, isCorrect, correctAnswerText } from './Question.jsx'
import { Rich } from './Code.jsx'
import { useProgress } from '../context/ProgressContext.jsx'
import { minutesToNextHeart } from '../lib/game.js'

/**
 * Sesión estilo Duolingo: una pregunta a la vez, botón "Comprobar",
 * retroalimentación inmediata y las preguntas falladas vuelven al final de la cola.
 */
export default function QuizSession({ questions, useHearts = false, onExit, onComplete, title }) {
  const { progress, answer, loseHeart } = useProgress()
  const [queue, setQueue] = useState(questions)
  const [pos, setPos] = useState(0)
  const [value, setValue] = useState(undefined)
  const [phase, setPhase] = useState('answer') // answer | feedback
  const [lastCorrect, setLastCorrect] = useState(null)
  const [combo, setCombo] = useState(0)
  const results = useRef({}) // qid -> correcto al primer intento
  const solved = useRef(new Set())
  const startedAt = useRef(Date.now())

  const q = queue[pos]
  const total = questions.length
  const pct = solved.current.size / total
  const outOfHearts = useHearts && progress.hearts <= 0 && phase === 'answer'

  const check = useCallback(() => {
    if (!q || phase !== 'answer' || !isAnswered(q, value)) return
    const ok = isCorrect(q, value)
    const first = !(q.id in results.current)
    if (first) {
      results.current[q.id] = ok
      answer(q.id, ok)
    }
    if (ok) {
      solved.current.add(q.id)
      setCombo((c) => c + 1)
    } else {
      setCombo(0)
      if (useHearts) loseHeart()
      setQueue((qq) => [...qq, q]) // repetir al final
    }
    setLastCorrect(ok)
    setPhase('feedback')
  }, [q, phase, value, answer, useHearts, loseHeart])

  const next = useCallback(() => {
    if (phase !== 'feedback') return
    if (pos + 1 >= queue.length) {
      const vals = Object.values(results.current)
      onComplete({
        total,
        correctFirstTry: vals.filter(Boolean).length,
        score: vals.filter(Boolean).length / total,
        seconds: Math.round((Date.now() - startedAt.current) / 1000),
        results: { ...results.current },
      })
      return
    }
    setPos((p) => p + 1)
    setValue(undefined)
    setPhase('answer')
    setLastCorrect(null)
  }, [phase, pos, queue.length, onComplete, total])

  // Atajos de teclado: 1-4 para elegir, Enter para comprobar/continuar
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        phase === 'answer' ? check() : next()
        return
      }
      if (phase !== 'answer' || !q) return
      const n = Number(e.key)
      if (q.t === 'tf' && (n === 1 || n === 2)) setValue(n === 1)
      if (q.t === 'mc' && n >= 1 && n <= q.opts.length) {
        const btn = document.querySelectorAll('.options .option')[n - 1]
        btn?.click()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, q, check, next])

  if (outOfHearts) {
    return (
      <div className="session">
        <div className="session-center">
          <div className="big-emoji">💔</div>
          <h2>Te quedaste sin vidas</h2>
          <p className="muted">Recuperas una vida cada 20 minutos (la próxima en {minutesToNextHeart(progress)} min). También ganas una al completar un repaso.</p>
          <div className="stack">
            <Link className="btn btn-primary" to="/review">Hacer un repaso</Link>
            <button className="btn btn-ghost" onClick={onExit}>Salir</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="session">
      <header className="session-top">
        <button className="icon-btn" onClick={onExit} aria-label="Salir">✕</button>
        <div className="progressbar" aria-label={`Progreso ${Math.round(pct * 100)}%`}>
          <div className="progressbar-fill" style={{ width: `${Math.max(4, pct * 100)}%` }} />
        </div>
        {useHearts ? (
          <div className="hearts" title="Vidas">❤️ <b>{progress.hearts}</b></div>
        ) : (
          <div className="hearts muted small">{title}</div>
        )}
      </header>

      {combo >= 3 && phase === 'feedback' && lastCorrect && <div className="combo">🔥 ¡{combo} seguidas!</div>}

      <main className="session-body" key={pos}>
        {pos >= total && phase === 'answer' && <div className="retry-tag">Repite lo que fallaste</div>}
        <Question q={q} value={value} onChange={setValue} locked={phase === 'feedback'} status={lastCorrect === null ? null : lastCorrect ? 'correct' : 'wrong'} />
      </main>

      <footer className={`session-footer ${phase === 'feedback' ? (lastCorrect ? 'ok' : 'bad') : ''}`}>
        <div className="footer-inner">
          {phase === 'feedback' ? (
            <div className="feedback">
              <div className="feedback-title">{lastCorrect ? '¡Excelente!' : 'Respuesta correcta:'}</div>
              {!lastCorrect && <pre className="feedback-answer">{correctAnswerText(q)}</pre>}
              {q.ex && <p className="feedback-ex"><Rich text={q.ex} /></p>}
            </div>
          ) : (
            <button className="btn btn-ghost hide-sm" onClick={() => { setValue(undefined) }} disabled={value === undefined}>Borrar</button>
          )}
          {phase === 'answer' ? (
            <button className="btn btn-primary btn-lg" disabled={!isAnswered(q, value)} onClick={check}>Comprobar</button>
          ) : (
            <button className={`btn btn-lg ${lastCorrect ? 'btn-primary' : 'btn-danger'}`} onClick={next} autoFocus>Continuar</button>
          )}
        </div>
      </footer>
    </div>
  )
}
