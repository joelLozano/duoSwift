import { CodeTabs, Rich, useCodeLang } from './Code.jsx'
import { Diagram } from './Illustration.jsx'

/**
 * "Explicado fácil": resumen de la lectura sin tecnicismos.
 * Recibe `simple` = { analogy, visual, points, example, code, oneLiner } (ver src/data/simple/).
 * `code` = { title, src, notes }: el ejemplo de la vida real en código, con marcas ①②③ explicadas en `notes`.
 */
export default function SimpleExplain({ simple }) {
  const [lang] = useCodeLang()
  if (!simple) return null
  const { analogy, visual, points, example, code, oneLiner } = simple
  // Las notas pueden ser una lista común o una por lenguaje ({ swift, kotlin })
  const shownLang = code && typeof code.src === 'object' && code.src[lang] ? lang : 'swift'
  const notes = !code?.notes ? [] : Array.isArray(code.notes) ? code.notes : code.notes[shownLang] || code.notes.swift
  return (
    <section id="facil" className="reading-section simple card">
      <header className="simple-head">
        <span className="simple-badge" aria-hidden="true">🧒</span>
        <div>
          <h2>Explicado fácil</h2>
          <p className="muted">La misma lectura, sin tecnicismos: analogías, ejemplos de la vida diaria y su código.</p>
        </div>
      </header>

      {analogy && (
        <div className="simple-analogy">
          <span className="simple-analogy-icon" aria-hidden="true">{analogy.icon}</span>
          <div>
            <b>Imagínalo así</b>
            <p><Rich text={analogy.text} /></p>
          </div>
        </div>
      )}

      {visual && <Diagram diagram={visual} />}

      {points?.length > 0 && (
        <>
          <h3 className="simple-sub">Lo importante, en pocas palabras</h3>
          <ul className="simple-points">
            {points.map((p, i) => (
              <li key={i}><Rich text={p} /></li>
            ))}
          </ul>
        </>
      )}

      {example && (
        <div className="simple-example">
          <b>{example.icon || '🌎'} Ejemplo de la vida real</b>
          <p><Rich text={example.text} /></p>
        </div>
      )}

      {code && (
        <div className="simple-code">
          <h3 className="simple-sub">🧑‍💻 El ejemplo, en código</h3>
          <p className="simple-code-title">{code.title}</p>
          <CodeTabs code={code.src} />
          <p className="simple-code-hint" aria-hidden="true">Desliza → para ver todo el código</p>
          {notes.length > 0 && (
            <div className="simple-code-notes">
              <b>Cómo funciona, paso a paso</b>
              <ul>
                {notes.map((n, i) => (
                  <li key={i}><Rich text={n} /></li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {oneLiner && (
        <p className="simple-oneliner">
          <span aria-hidden="true">💡</span> <Rich text={oneLiner} />
        </p>
      )}
    </section>
  )
}
