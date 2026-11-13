import { useMemo } from 'react'
import { CodeBlock, Rich } from './Code.jsx'

// Barajado estable por pregunta durante la sesión de la página (no cambia al volver a ella)
const SALT = Math.floor(Math.random() * 1e9)
function seededShuffle(arr, key) {
  let h = SALT
  for (const ch of key) h = Math.imul(h ^ ch.charCodeAt(0), 2654435761) >>> 0
  const rnd = () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0), (h ^= h >>> 13), (h >>> 0) / 4294967296)
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const TYPE_LABEL = {
  mc: 'Elige la respuesta correcta',
  tf: '¿Verdadero o falso?',
  fill: 'Completa el código',
  order: 'Ordena las líneas',
}

export function isAnswered(q, value) {
  if (q.t === 'order') return Array.isArray(value) && value.length === q.lines.length
  return value !== undefined && value !== null
}

export function isCorrect(q, value) {
  switch (q.t) {
    case 'mc':
      return value === q.a
    case 'tf':
      return value === q.a
    case 'fill':
      return value === q.a
    case 'order':
      return Array.isArray(value) && value.map((i) => q.lines[i]).join('\n') === q.lines.join('\n')
    default:
      return false
  }
}

export function correctAnswerText(q) {
  switch (q.t) {
    case 'mc':
      return q.opts[q.a]
    case 'tf':
      return q.a ? 'Verdadero' : 'Falso'
    case 'fill':
      return q.a
    case 'order':
      return q.lines.join('\n')
    default:
      return ''
  }
}

export default function Question({ q, value, onChange, locked, status }) {
  // Orden aleatorio estable por pregunta
  const order = useMemo(() => {
    if (q.t === 'mc') return seededShuffle(q.opts.map((_, i) => i), q.id)
    if (q.t === 'fill') return seededShuffle(q.opts, q.id)
    if (q.t === 'order') {
      const o = seededShuffle(q.lines.map((_, i) => i), q.id)
      // evita que salga ya ordenado
      return o.every((v, i) => v === i) ? [...o.slice(1), o[0]] : o
    }
    return []
  }, [q])

  const optClass = (selected, isRight) => {
    let c = 'option'
    if (selected) c += ' selected'
    if (locked && status) {
      if (isRight) c += ' right'
      else if (selected) c += ' wrong'
    }
    return c
  }

  return (
    <div className="question">
      <div className="q-type">{TYPE_LABEL[q.t]}</div>
      <h2 className="q-prompt"><Rich text={q.q} /></h2>

      {q.t === 'fill' ? (
        <CodeBlock
          code={q.code}
          blank={
            <button
              type="button"
              className={`blank ${value ? 'filled' : ''} ${locked && status ? (status === 'correct' ? 'right' : 'wrong') : ''}`}
              onClick={() => !locked && onChange(undefined)}
              aria-label="Espacio en blanco"
            >
              {value || '    '}
            </button>
          }
        />
      ) : (
        q.code && <CodeBlock code={q.code} />
      )}

      {q.t === 'mc' && (
        <div className="options">
          {order.map((i, n) => (
            <button key={i} type="button" disabled={locked} className={optClass(value === i, i === q.a)} onClick={() => onChange(i)}>
              <span className="opt-key">{n + 1}</span>
              <span className="opt-text"><Rich text={q.opts[i]} /></span>
            </button>
          ))}
        </div>
      )}

      {q.t === 'tf' && (
        <div className="options two">
          {[true, false].map((v) => (
            <button key={String(v)} type="button" disabled={locked} className={optClass(value === v, v === q.a)} onClick={() => onChange(v)}>
              <span className="opt-key">{v ? '✓' : '✗'}</span>
              <span className="opt-text">{v ? 'Verdadero' : 'Falso'}</span>
            </button>
          ))}
        </div>
      )}

      {q.t === 'fill' && (
        <div className="chips">
          {order.map((w) => (
            <button key={w} type="button" disabled={locked} className={`chip ${value === w ? 'used' : ''}`} onClick={() => onChange(w)}>
              {w}
            </button>
          ))}
        </div>
      )}

      {q.t === 'order' && (
        <OrderExercise q={q} order={order} value={value || []} onChange={onChange} locked={locked} />
      )}
    </div>
  )
}

function OrderExercise({ q, order, value, onChange, locked }) {
  const remaining = order.filter((i) => !value.includes(i))
  return (
    <div className="order">
      <div className={`order-target ${value.length ? '' : 'empty'}`}>
        {value.length === 0 && <span className="muted">Toca las líneas en el orden correcto</span>}
        {value.map((i, pos) => (
          <button key={i} type="button" disabled={locked} className="code-line placed" onClick={() => onChange(value.filter((_, p) => p !== pos))}>
            <span className="ln">{pos + 1}</span>
            <code>{q.lines[i]}</code>
          </button>
        ))}
      </div>
      <div className="order-bank">
        {remaining.map((i) => (
          <button key={i} type="button" disabled={locked} className="code-line" onClick={() => onChange([...value, i])}>
            <code>{q.lines[i].trim()}</code>
          </button>
        ))}
      </div>
    </div>
  )
}
