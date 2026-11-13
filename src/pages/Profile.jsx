import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useProgress } from '../context/ProgressContext.jsx'
import { signOut, firebaseEnabled } from '../lib/backend.js'
import { levelInfo, titleFor } from '../lib/game.js'
import { Link } from 'react-router-dom'
import { courseById } from '../data/index.js'

const GOALS = [
  { xp: 10, label: 'Casual' },
  { xp: 30, label: 'Normal' },
  { xp: 50, label: 'Serio' },
  { xp: 100, label: 'Intenso' },
]

export default function Profile() {
  const { user } = useAuth()
  const { progress, setDailyGoal, reset } = useProgress()
  const [confirming, setConfirming] = useState(false)
  const lvl = levelInfo(progress.xp)

  return (
    <div className="page">
      <section className="card profile-head">
        <div className="avatar xl">{user.name.slice(0, 1).toUpperCase()}</div>
        <div>
          <h1>{user.name}</h1>
          <p className="muted">{user.email}</p>
          <span className="pill ghost">Nivel {lvl.level} · {titleFor(lvl.level)}</span>
        </div>
      </section>

      <section className="card">
        <h3>Mis cursos</h3>
        <div className="row-actions">
          {progress.enrolled.map((id) => (
            <span key={id} className="pill ghost">{courseById[id].icon} {courseById[id].title}</span>
          ))}
          <Link className="btn btn-ghost" to="/courses">Administrar cursos</Link>
        </div>
      </section>

      <section className="card">
        <h3>Meta diaria</h3>
        <div className="goal-grid">
          {GOALS.map((g) => (
            <button key={g.xp} className={`goal-opt ${progress.dailyGoal === g.xp ? 'active' : ''}`} onClick={() => setDailyGoal(g.xp)}>
              <b>{g.label}</b>
              <span>{g.xp} XP/día</span>
            </button>
          ))}
        </div>
      </section>

      <section className="card">
        <h3>Almacenamiento</h3>
        {firebaseEnabled ? (
          <p>☁️ Tu progreso se sincroniza con <b>Firebase</b> (Firestore) y se guarda también en caché local.</p>
        ) : (
          <p>
            💾 <b>Modo local:</b> tu cuenta y progreso viven en este navegador. Para sincronizar entre dispositivos, configura Firebase en
            <code className="inline-code">.env.local</code> (ver README).
          </p>
        )}
      </section>

      <section className="card">
        <h3>Cuenta</h3>
        <div className="row-actions">
          <button className="btn btn-ghost" onClick={signOut}>Cerrar sesión</button>
          {confirming ? (
            <>
              <button className="btn btn-danger" onClick={() => { reset(); setConfirming(false) }}>Sí, borrar todo mi progreso</button>
              <button className="btn btn-ghost" onClick={() => setConfirming(false)}>Cancelar</button>
            </>
          ) : (
            <button className="btn btn-ghost danger-text" onClick={() => setConfirming(true)}>Reiniciar progreso</button>
          )}
        </div>
      </section>
    </div>
  )
}
