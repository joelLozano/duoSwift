import { useMemo, useState } from 'react'
import { useProgress } from '../context/ProgressContext.jsx'
import { CodeBlock, Rich } from '../components/Code.jsx'
import { formatInterval, isDue } from '../lib/srs.js'
import { useCourse } from '../lib/selectors.js'

const LEVELS = ['Todos', 'Junior', 'Mid', 'Senior']
const RATINGS = [
  { q: 1, label: 'Otra vez', cls: 'btn-danger', hint: '10 min' },
  { q: 3, label: 'Difícil', cls: 'btn-warn', hint: 'pronto' },
  { q: 4, label: 'Bien', cls: 'btn-secondary', hint: 'días' },
  { q: 5, label: 'Fácil', cls: 'btn-primary', hint: 'más días' },
]

export default function Interview() {
  const { progress, rateInterview } = useProgress()
  const course = useCourse()
  const { interview, interviewCategories: INTERVIEW_CATEGORIES } = course
  const [cat, setCat] = useState('Todas')
  const [level, setLevel] = useState('Todos')
  const [mode, setMode] = useState('cards') // cards | list
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [sessionDone, setSessionDone] = useState(0)

  const filtered = useMemo(
    () =>
      interview.filter(
        (i) =>
          (cat === 'Todas' || i.cat === cat) &&
          (level === 'Todos' || i.level === level) &&
          (!search || (i.q + i.a).toLowerCase().includes(search.toLowerCase())),
      ),
    [cat, level, search, interview],
  )

  // Cola de tarjetas: primero las pendientes, luego las nuevas
  const deck = useMemo(() => {
    const now = Date.now()
    const due = filtered.filter((i) => progress.interview[i.id] && isDue(progress.interview[i.id], now))
    const fresh = filtered.filter((i) => !progress.interview[i.id])
    return [...due, ...fresh]
  }, [filtered, progress.interview])

  const card = deck[0]
  const known = interview.filter((i) => progress.interview[i.id]?.reps >= 2).length

  const rate = (q) => {
    rateInterview(card.id, q)
    setRevealed(false)
    setSessionDone((n) => n + 1)
  }

  return (
    <div className="page">
      <h1 className="page-title">💼 Entrevista · {course.title}</h1>
      <p className="muted">
        {interview.length} preguntas frecuentes para puestos de {course.id === 'ai' ? 'Mobile AI Engineer (iOS)' : 'Swift/iOS'}. Practica en modo tarjetas: intenta responder en voz alta, revela la respuesta y califica qué tan bien la sabías. Dominadas: {known}/{interview.length}.
      </p>

      <div className="filters">
        <div className="seg">
          <button className={mode === 'cards' ? 'active' : ''} onClick={() => setMode('cards')}>🃏 Tarjetas</button>
          <button className={mode === 'list' ? 'active' : ''} onClick={() => setMode('list')}>📋 Lista</button>
        </div>
        <select value={level} onChange={(e) => setLevel(e.target.value)} aria-label="Nivel">
          {LEVELS.map((l) => <option key={l}>{l}</option>)}
        </select>
      </div>
      <div className="chips scroll">
        {['Todas', ...INTERVIEW_CATEGORIES].map((c) => (
          <button key={c} className={`chip ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>

      {mode === 'cards' ? (
        card ? (
          <div className="flash-wrap">
            <div className="muted small center">{deck.length} en cola · {sessionDone} repasadas en esta sesión</div>
            <div className={`flashcard card ${revealed ? 'revealed' : ''}`}>
              <div className="fc-meta">
                <span className="pill ghost">{card.cat}</span>
                <span className={`pill lvl-${card.level.toLowerCase()}`}>{card.level}</span>
              </div>
              <h2 className="fc-q">{card.q}</h2>
              {revealed ? (
                <div className="fc-a">
                  <p><Rich text={card.a} /></p>
                  {card.code && <CodeBlock code={card.code} />}
                  {card.src && <a className="src-link" href={card.src.url} target="_blank" rel="noreferrer">{card.src.label} ↗</a>}
                </div>
              ) : (
                <button className="btn btn-secondary btn-lg full" onClick={() => setRevealed(true)}>Mostrar respuesta</button>
              )}
            </div>
            {revealed && (
              <div className="ratings">
                {RATINGS.map((r) => (
                  <button key={r.q} className={`btn ${r.cls}`} onClick={() => rate(r.q)}>
                    {r.label}
                    <small>{r.hint}</small>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="card empty">
            <div className="big-emoji">✅</div>
            <h3>¡Al día!</h3>
            <p className="muted">No hay tarjetas pendientes con estos filtros. Vuelve más tarde o revisa la lista completa.</p>
            <button className="btn btn-secondary" onClick={() => setMode('list')}>Ver lista</button>
          </div>
        )
      ) : (
        <>
          <input className="search" placeholder="Buscar pregunta o concepto…" value={search} onChange={(e) => setSearch(e.target.value)} />
          <div className="accordion">
            {filtered.map((i) => {
              const c = progress.interview[i.id]
              return (
                <div key={i.id} className={`card acc-item ${open === i.id ? 'open' : ''}`}>
                  <button className="acc-head" onClick={() => setOpen(open === i.id ? null : i.id)}>
                    <span className={`dot lvl-${i.level.toLowerCase()}`} />
                    <span className="acc-q">{i.q}</span>
                    <span className="muted small hide-xs">{c ? formatInterval(c) : 'nueva'}</span>
                    <span className="chev">{open === i.id ? '−' : '+'}</span>
                  </button>
                  {open === i.id && (
                    <div className="acc-body">
                      <p><Rich text={i.a} /></p>
                      {i.code && <CodeBlock code={i.code} />}
                      <div className="acc-foot">
                        <span className="pill ghost">{i.cat} · {i.level}</span>
                        {i.src && <a className="src-link" href={i.src.url} target="_blank" rel="noreferrer">{i.src.label} ↗</a>}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
            {!filtered.length && <p className="muted center">Sin resultados.</p>}
          </div>
        </>
      )}
    </div>
  )
}
