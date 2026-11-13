import { Component } from 'react'

// Evita que un error en una pantalla deje toda la app en blanco
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Error en la pantalla:', error, info?.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="card empty" role="alert">
        <div className="big-emoji">🛠️</div>
        <h3>Algo salió mal en esta pantalla</h3>
        <p className="muted small">{String(this.state.error?.message || this.state.error)}</p>
        <div className="row-actions" style={{ justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={() => this.setState({ error: null })}>Reintentar</button>
          <a className="btn btn-ghost" href="/">Ir al inicio</a>
        </div>
      </div>
    )
  }
}
