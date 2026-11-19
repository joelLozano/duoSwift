import { Fragment, useEffect, useState } from 'react'

const KEYWORDS = new Set(
  ('let var func return if else guard switch case default for in while repeat break continue fallthrough ' +
    'struct class enum protocol extension init deinit self Self super import throws throw try catch do defer ' +
    'async await actor some any where inout static mutating override final lazy weak unowned private public ' +
    'internal fileprivate open package convenience required indirect associatedtype typealias is as nil true false ' +
    'get set willSet didSet subscript rethrows nonisolated consuming borrowing ' +
    // Kotlin
    'val fun when object companion sealed inline reified noinline crossinline out vararg suspend null this ' +
    'lateinit const abstract interface by constructor tailrec operator infix inner it ' +
    // Python
    'def from with None True False elif lambda pass except finally raise yield and or not del assert ' +
    'global nonlocal match').split(' '),
)
// Comentarios: // y /* */ (Swift, Kotlin) y # seguido de espacio (Python). Cadenas: "…", """…""", '…' y '''…'''.
const TOKEN = /(\/\/.*$|\/\*[\s\S]*?\*\/|#(?=[\s!]|$).*$|"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|@\w+|#\w+|\b\d[\d_.]*\b|\b[A-Za-z_]\w*\b|\$\d+|___)/gm

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
    else if (t.startsWith('//') || t.startsWith('/*') || (t[0] === '#' && (t.length === 1 || /[\s!]/.test(t[1])))) cls = 'tk-com'
    else if (t.startsWith('"') || t.startsWith("'")) cls = 'tk-str'
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
  const parts = String(text).split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*\s][^*]*[^*\s]\*)/g)
  return parts.map((p, i) => {
    if (p.startsWith('`') && p.endsWith('`') && p.length > 1) return <code key={i} className="inline-code">{p.slice(1, -1)}</code>
    if (p.startsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>
    if (p.startsWith('*') && p.endsWith('*') && p.length > 2) return <em key={i}>{p.slice(1, -1)}</em>
    return <Fragment key={i}>{p}</Fragment>
  })
}

/* ---------- Código en varios lenguajes (Swift / Kotlin) ---------- */

const LANGS = { swift: { label: 'Swift', icon: '🐦' }, kotlin: { label: 'Kotlin', icon: '🟣' } }
const LANG_KEY = 'duoswift-code-lang'
const LANG_EVENT = 'duoswift-code-lang'

function readLang() {
  try {
    return localStorage.getItem(LANG_KEY) || 'swift'
  } catch {
    return 'swift'
  }
}

// Lenguaje preferido, compartido por todos los bloques de la página y recordado entre visitas
export function useCodeLang() {
  const [lang, setLangState] = useState(readLang)
  useEffect(() => {
    const sync = () => setLangState(readLang())
    window.addEventListener(LANG_EVENT, sync)
    return () => window.removeEventListener(LANG_EVENT, sync)
  }, [])
  const setLang = (l) => {
    try {
      localStorage.setItem(LANG_KEY, l)
    } catch {
      /* sin almacenamiento: solo cambia en esta vista */
    }
    setLangState(l)
    window.dispatchEvent(new Event(LANG_EVENT))
  }
  return [lang, setLang]
}

/**
 * Muestra `code` como bloque. Acepta un string (un solo lenguaje) o
 * un objeto { swift, kotlin } con pestañas para cambiar de lenguaje.
 */
export function CodeTabs({ code }) {
  const [lang, setLang] = useCodeLang()
  if (typeof code === 'string') return <CodeBlock code={code} />
  const available = Object.keys(LANGS).filter((l) => code?.[l])
  if (available.length === 0) return null
  const current = available.includes(lang) ? lang : available[0]
  return (
    <div className="code-tabs">
      {available.length > 1 && (
        <div className="code-tabs-bar" role="tablist" aria-label="Lenguaje del código">
          {available.map((l) => (
            <button
              key={l}
              type="button"
              role="tab"
              aria-selected={l === current}
              className={`code-tab ${l === current ? 'active' : ''}`}
              onClick={() => setLang(l)}
            >
              <span aria-hidden="true">{LANGS[l].icon}</span> {LANGS[l].label}
            </button>
          ))}
        </div>
      )}
      <CodeBlock code={code[current]} />
    </div>
  )
}
