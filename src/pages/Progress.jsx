import { Link } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext.jsx'
import { EXAM_PASS, courseById, courseForExam, isFinalExam, unitById } from '../data/index.js'
import { currentStreak, levelInfo, titleFor, dayKey, addDays } from '../lib/game.js'
import { unitMastery, courseMastery, learnedCount, courseLessonsDone, useCourse } from '../lib/selectors.js'

const WEEKDAYS = ['D', 'L', 'M', 'M', 'J', 'V', 'S']

export default function ProgressPage() {
  const { progress: p, setActiveCourse } = useProgress()
  const course = useCourse()
  const { units, interview } = course
  const lvl = levelInfo(p.xp)
  const today = dayKey()
  const last14 = Array.from({ length: 14 }, (_, i) => addDays(today, i - 13))
  const max14 = Math.max(p.dailyGoal, ...last14.map((d) => p.xpByDay[d] || 0))
  const heat = Array.from({ length: 84 }, (_, i) => addDays(today, i - 83))
  const lessonsDone = courseLessonsDone(p, course)
  const accuracy = p.stats.answered ? p.stats.correct / p.stats.answered : 0
  const courseExamIds = [...units.map((u) => u.id), course.finalExamId]
  const examsPassed = courseExamIds.filter((id) => (p.exams[id] || []).some((r) => r.score / r.total >= EXAM_PASS)).length
  const examHistory = Object.entries(p.exams)
    .flatMap(([id, rs]) => rs.map((r) => ({ id, ...r })))
    .sort((a, b) => b.date - a.date)
    .slice(0, 8)
  const examName = (id) => `${courseForExam(id)?.icon || ''} ${isFinalExam(id) ? 'Examen final' : unitById[id]?.title || id}`

  return (
    <div className="page">
      <h1 className="page-title">📊 Tu progreso</h1>

      <section className="card level-card">
        <div className="level-badge">{lvl.level}</div>
        <div className="grow">
          <div className="unit-label">Nivel {lvl.level} · {titleFor(lvl.level)}</div>
          <div className="progressbar"><div className="progressbar-fill gold" style={{ width: `${lvl.pct * 100}%` }} /></div>
          <div className="muted small">{p.xp - lvl.cur} / {lvl.next - lvl.cur} XP para el nivel {lvl.level + 1}</div>
        </div>
      </section>

      {p.enrolled.length > 1 && (
        <section className="card">
          <h3>Mis cursos</h3>
          <div className="mastery">
            {p.enrolled.map((id) => {
              const c = courseById[id]
              const done = courseLessonsDone(p, c)
              return (
                <button key={id} className={`mastery-row course-row ${id === course.id ? 'active' : ''}`} onClick={() => setActiveCourse(id)} title="Ver el progreso de este curso">
                  <span className="m-name">{c.icon} {c.title}</span>
                  <div className="progressbar slim grow"><div className="progressbar-fill" style={{ width: `${(done / c.lessons.length) * 100}%`, background: c.color }} /></div>
                  <span className="m-val">{Math.round((done / c.lessons.length) * 100)}%</span>
                  <span className="muted small hide-xs">{done}/{c.lessons.length}</span>
                </button>
              )
            })}
          </div>
          <p className="muted small">Toca un curso para ver su detalle. La XP, la racha y la precisión son globales.</p>
        </section>
      )}

      <div className="grid-4">
        <Stat c="var(--orange)" v={`🔥 ${currentStreak(p)}`} l={`Racha (récord ${p.bestStreak || 0})`} />
        <Stat c="var(--gold)" v={`⚡ ${p.xp}`} l="XP total" />
        <Stat c="var(--green)" v={`${Math.round(accuracy * 100)}%`} l={`Precisión (${p.stats.answered} resp.)`} />
        <Stat c="var(--blue)" v={`${lessonsDone}/${course.lessons.length}`} l={`Lecciones · ${course.title}`} />
        <Stat c="var(--purple)" v={`${learnedCount(p, course)}/${course.questions.length}`} l="Conceptos consolidados" />
        <Stat c="var(--red)" v={`${examsPassed}/${courseExamIds.length}`} l="Exámenes aprobados" />
        <Stat c="var(--teal)" v={`${units.filter((u) => p.readings[u.id]).length}/${units.length}`} l="Lecturas" />
        <Stat c="var(--pink)" v={`${interview.filter((i) => p.interview[i.id]?.reps >= 2).length}/${interview.length}`} l="Entrevista dominadas" />
      </div>

      <section className="card">
        <h3>XP de los últimos 14 días</h3>
        <div className="bars">
          {last14.map((d) => {
            const v = p.xpByDay[d] || 0
            const [, m, dd] = d.split('-')
            const wd = new Date(d + 'T12:00').getDay()
            return (
              <div key={d} className="bar-col" title={`${d}: ${v} XP`}>
                <div className="bar-val">{v || ''}</div>
                <div className="bar-track">
                  <div className={`bar ${v >= p.dailyGoal ? 'met' : ''}`} style={{ height: `${(v / max14) * 100}%` }} />
                </div>
                <div className="bar-label">{WEEKDAYS[wd]}<span className="hide-xs">{Number(dd)}/{Number(m)}</span></div>
              </div>
            )
          })}
        </div>
        <div className="muted small">Barras doradas: cumpliste tu meta diaria de {p.dailyGoal} XP.</div>
      </section>

      <section className="card">
        <h3>Actividad (12 semanas)</h3>
        <div className="heatmap">
          {heat.map((d) => {
            const v = p.xpByDay[d] || 0
            const lvlH = v === 0 ? 0 : v < 15 ? 1 : v < 30 ? 2 : v < 60 ? 3 : 4
            return <div key={d} className={`hm h${lvlH}`} title={`${d}: ${v} XP`} />
          })}
        </div>
      </section>

      <section className="card">
        <h3>Dominio por unidad · {course.title} <span className="muted small">· global {Math.round(courseMastery(p, course) * 100)}%</span></h3>
        <p className="muted small">Se calcula con la fuerza de memoria de cada pregunta: sube al acertar en repasos espaciados y baja si dejas pasar el tiempo.</p>
        <div className="mastery">
          {units.map((u) => {
            const m = unitMastery(p, u)
            const done = u.lessons.filter((l) => p.lessons[l.id]).length
            return (
              <div key={u.id} className="mastery-row">
                <span className="m-name">{u.icon} {u.title}</span>
                <div className="progressbar slim grow"><div className="progressbar-fill" style={{ width: `${m * 100}%`, background: u.color }} /></div>
                <span className="m-val">{Math.round(m * 100)}%</span>
                <span className="muted small hide-xs">{done}/{u.lessons.length}</span>
              </div>
            )
          })}
        </div>
      </section>

      <section className="card">
        <h3>Historial de exámenes</h3>
        {examHistory.length ? (
          <table className="table">
            <thead><tr><th>Examen</th><th>Resultado</th><th className="hide-xs">Fecha</th></tr></thead>
            <tbody>
              {examHistory.map((r, i) => (
                <tr key={i}>
                  <td>{examName(r.id)}</td>
                  <td><span className={`pill ${r.score / r.total >= EXAM_PASS ? 'done' : 'bad'}`}>{Math.round((r.score / r.total) * 100)}% ({r.score}/{r.total})</span></td>
                  <td className="hide-xs muted">{new Date(r.date).toLocaleDateString('es')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="muted">Aún no presentas exámenes. <Link to="/exams">Ver exámenes</Link></p>
        )}
      </section>
    </div>
  )
}

function Stat({ c, v, l }) {
  return (
    <div className="stat-card" style={{ '--c': c }}>
      <div className="sc-value">{v}</div>
      <div className="sc-label">{l}</div>
    </div>
  )
}
