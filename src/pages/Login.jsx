import { useState } from 'react'
import { signIn, signUp, signInWithGoogle, resetPassword, firebaseEnabled } from '../lib/backend.js'

export default function Login() {
  const [mode, setMode] = useState('login') // login | signup
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')
    setBusy(true)
    try {
      if (mode === 'signup') await signUp(name.trim() || email.split('@')[0], email, password)
      else await signIn(email, password)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const google = async () => {
    setError('')
    try { await signInWithGoogle() } catch (err) { setError(err.message) }
  }

  const forgot = async () => {
    setError('')
    if (!email) return setError('Escribe tu correo primero.')
    try {
      await resetPassword(email)
      setInfo('Te enviamos un correo para restablecer tu contraseña.')
    } catch (err) { setError(err.message) }
  }

  return (
    <div className="auth">
      <section className="auth-hero">
        <div className="hero-bird">
          <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" width="96" height="96" />
        </div>
        <h1>duo<b>swift</b></h1>
        <p>Aprende Swift, IA para iOS, Clean Architecture y algoritmos con lecciones cortas, repetición espaciada, exámenes y preguntas de entrevista.</p>
        <ul className="hero-points">
          <li>🐦 Swift · 🤖 IA para iOS · 🏛️ Clean Architecture · 🧮 Algoritmos: elige uno o varios</li>
          <li>🧱 Contenido basado en documentación oficial</li>
          <li>🔁 Repaso inteligente con el algoritmo SM-2</li>
          <li>📝 Exámenes cronometrados por unidad</li>
          <li>💼 Preguntas reales de entrevista</li>
        </ul>
      </section>

      <section className="auth-card card">
        <div className="tabs">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Iniciar sesión</button>
          <button className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')}>Crear cuenta</button>
        </div>
        <form onSubmit={submit} className="form">
          {mode === 'signup' && (
            <label>
              Nombre
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" autoComplete="name" />
            </label>
          )}
          <label>
            Correo
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" autoComplete="email" />
          </label>
          <label>
            Contraseña
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} />
          </label>
          {error && <div className="alert error">{error}</div>}
          {info && <div className="alert ok">{info}</div>}
          <button className="btn btn-primary btn-lg full" disabled={busy}>{busy ? 'Un momento…' : mode === 'signup' ? 'Empezar a aprender' : 'Entrar'}</button>
          {firebaseEnabled && (
            <>
              <div className="divider"><span>o</span></div>
              <button type="button" className="btn btn-ghost full" onClick={google}>Continuar con Google</button>
              {mode === 'login' && <button type="button" className="link-btn" onClick={forgot}>¿Olvidaste tu contraseña?</button>}
            </>
          )}
        </form>
        {!firebaseEnabled && (
          <p className="muted small center">
            Modo local: tu cuenta y progreso se guardan en este navegador. Configura Firebase en <code className="inline-code">.env.local</code> para sincronizar en la nube.
          </p>
        )}
      </section>
    </div>
  )
}
