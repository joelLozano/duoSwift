export default function ResultScreen({ emoji = '🎉', title, subtitle, stats = [], children }) {
  return (
    <div className="session">
      <div className="session-center result">
        <div className="big-emoji bounce">{emoji}</div>
        <h1>{title}</h1>
        {subtitle && <p className="muted">{subtitle}</p>}
        <div className="result-stats">
          {stats.map((s) => (
            <div key={s.label} className="result-stat" style={{ '--c': s.color || 'var(--gold)' }}>
              <div className="rs-label">{s.label}</div>
              <div className="rs-value">{s.value}</div>
            </div>
          ))}
        </div>
        <div className="stack">{children}</div>
      </div>
    </div>
  )
}

export const fmtTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
