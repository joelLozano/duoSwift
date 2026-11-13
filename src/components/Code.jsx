import { Fragment } from 'react'

const KEYWORDS = new Set(
  ('let var func return if else guard switch case default for in while repeat break continue fallthrough ' +
    'struct class enum protocol extension init deinit self Self super import throws throw try catch do defer ' +
    'async await actor some any where inout static mutating override final lazy weak unowned private public ' +
    'internal fileprivate open package convenience required indirect associatedtype typealias is as nil true false ' +
    'get set willSet didSet subscript rethrows nonisolated consuming borrowing ' +
    // Kotlin
    'val fun when object companion sealed inline reified noinline crossinline out vararg suspend null this ' +
    'lateinit const abstract interface by constructor tailrec operator infix inner it ' +
    // Python (para ejemplos de coremltools)
    'def from with None True False elif lambda pass').split(' '),
)
const TOKEN = /(\/\/.*$|\/\*[\s\S]*?\*\/|"""[\s\S]*?"""|"(?:\\.|[^"\\])*"|@\w+|#\w+|\b\d[\d_.]*\b|\b[A-Za-z_]\w*\b|\$\d+|___)/gm

export function highlight(code) {
  const out = []
  let last = 0
  let m
  TOKEN.lastIndex = 0
  while ((m = TOKEN.exec(code))) {
    if (m.index > last) out.push(code.slice(last, m.index))
    const t = m[0]
    let cls
    if (t === '___') cls = 'tk-blank'
    else if (t.startsWith('//') || t.startsWith('/*')) cls = 'tk-com'
    else if (t.startsWith('"')) cls = 'tk-str'
    else if (t.startsWith('@') || t.startsWith('#')) cls = 'tk-attr'
    else if (/^\d/.test(t) || t.startsWith('$')) cls = 'tk-num'
    else if (KEYWORDS.has(t)) cls = 'tk-kw'
    else if (/^[A-Z]/.test(t)) cls = 'tk-type'
    out.push(cls ? <span key={m.index} className={cls}>{t}</span> : t)
    last = m.index + t.length
  }
  if (last < code.length) out.push(code.slice(last))
  return out
}

export function CodeBlock({ code, blank }) {
  // `blank` reemplaza ___ por un nodo (para ejercicios de completar)
  if (blank !== undefined && code.includes('___')) {
    const [a, b] = code.split('___')
    return (
      <pre className="code">
        <code>
          {highlight(a)}
          {blank}
          {highlight(b)}
        </code>
      </pre>
    )
  }
  return (
    <pre className="code">
      <code>{highlight(code)}</code>
    </pre>
  )
}

// Convierte `código` en línea y **negritas** en elementos
export function Rich({ text }) {
  const parts = String(text).split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
  return parts.map((p, i) => {
    if (p.startsWith('`') && p.endsWith('`') && p.length > 1) return <code key={i} className="inline-code">{p.slice(1, -1)}</code>
    if (p.startsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>
    return <Fragment key={i}>{p}</Fragment>
  })
}
