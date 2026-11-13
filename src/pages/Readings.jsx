import { Link } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext.jsx'
import { useCourse } from '../lib/selectors.js'

export default function Readings() {
  const { progress } = useProgress()
  const course = useCourse()
  const { units } = course
  const read = units.filter((u) => progress.readings[u.id]).length

  // Agrupar por módulo (los cursos sin módulos quedan en un solo grupo)
  const groups = []
  for (const u of units) {
    const last = groups[groups.length - 1]
    if (last && last.module === (u.module || null)) last.units.push(u)
    else groups.push({ module: u.module || null, units: [u] })
  }

  return (
    <div className="page">
      <h1 className="page-title">📖 Lecturas · {course.title}</h1>
      <p className="muted">
        Resúmenes en español basados en fuentes oficiales ({course.sourcesNote}). Cada lectura enlaza a sus fuentes originales. Leídas: {read}/{units.length}.
      </p>
      {groups.map((g) => (
        <section key={g.module || 'all'}>
          {g.module && <h2 className="module-title small-gap">{g.module}</h2>}
          <div className="reading-grid">
            {g.units.map((u) => (
              <Link key={u.id} to={`/readings/${u.id}`} className="card reading-card" style={{ '--unit': u.color }}>
                <div className="rc-icon">{u.icon}</div>
                <div className="rc-body">
                  <div className="unit-label">Unidad {u.index + 1}</div>
                  <h3>{u.title}</h3>
                  <p className="muted small">{u.reading.map((s) => s.h).join(' · ')}</p>
                </div>
                {progress.readings[u.id] && <span className="check">✓</span>}
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
