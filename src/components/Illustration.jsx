// Ilustraciones para las lecturas:
// - PhonePreview: maqueta tipo iPhone generada a partir de una descripción de nodos
//   (vstack, hstack, text, button, toggle, list, navbar, tabbar…). Es ilustrativa, no un render real de SwiftUI.
// - Diagram: diagramas de flujo (pasos con flechas) y de árbol (jerarquía de vistas).
import { Fragment } from 'react'

const FONT = {
  largeTitle: { fontSize: 26, fontWeight: 800 },
  title: { fontSize: 21, fontWeight: 800 },
  title2: { fontSize: 18, fontWeight: 800 },
  headline: { fontSize: 15, fontWeight: 800 },
  body: { fontSize: 15, fontWeight: 500 },
  subheadline: { fontSize: 13, fontWeight: 500 },
  caption: { fontSize: 11.5, fontWeight: 600 },
}
const COLORS = {
  blue: '#0A84FF', red: '#FF3B30', green: '#34C759', orange: '#FF9500', yellow: '#FFCC00',
  purple: '#AF52DE', pink: '#FF2D55', teal: '#30B0C7', gray: '#8E8E93', indigo: '#5856D6',
  secondary: 'var(--ph-secondary)', primary: 'var(--ph-text)', white: '#fff', black: '#000',
  bg2: 'var(--ph-bg2)', clear: 'transparent',
}
const col = (c) => (c ? COLORS[c] || c : undefined)
const ALIGN = { leading: 'flex-start', center: 'center', trailing: 'flex-end', top: 'flex-start', bottom: 'flex-end' }

// Estilos comunes que cualquier nodo puede tener (equivalentes a modificadores)
function boxStyle(n) {
  const s = {}
  if (n.pad !== undefined) s.padding = typeof n.pad === 'number' ? n.pad : 12
  if (n.bg) s.background = col(n.bg)
  if (n.radius) s.borderRadius = n.radius
  if (n.border) s.border = `2px solid ${col(n.border)}`
  if (n.w) s.width = n.w
  if (n.h) s.height = n.h
  if (n.fill) s.alignSelf = 'stretch'
  if (n.grow) s.flex = 1
  if (n.opacity !== undefined) s.opacity = n.opacity
  if (n.shadow) s.boxShadow = '0 4px 14px rgba(0,0,0,.18)'
  if (n.fg) s.color = col(n.fg)
  if (n.offset) s.transform = `translate(${n.offset[0]}px, ${n.offset[1]}px)`
  if (n.scale) s.transform = `${s.transform || ''} scale(${n.scale})`
  if (n.rotate) s.transform = `${s.transform || ''} rotate(${n.rotate}deg)`
  if (n.dashed) s.outline = '2px dashed var(--ph-accent)'
  return s
}

function Node({ n }) {
  if (n == null) return null
  if (typeof n === 'string') return <span className="ph-text" style={FONT.body}>{n}</span>
  const s = boxStyle(n)
  const kids = (arr) => arr.map((c, i) => <Node key={i} n={c} />)

  if (n.vstack || n.hstack || n.zstack) {
    const dir = n.vstack ? 'column' : n.hstack ? 'row' : null
    const items = n.vstack || n.hstack || n.zstack
    if (!dir) {
      return (
        <div className="ph-z" style={{ ...s, placeItems: ALIGN[n.align] ? `${ALIGN[n.align]} ${ALIGN[n.align]}` : 'center' }}>
          {items.map((c, i) => <div key={i} className="ph-z-layer"><Node n={c} /></div>)}
        </div>
      )
    }
    return (
      <div
        className="ph-stack"
        style={{
          flexDirection: dir,
          justifyContent: 'center',
          gap: n.spacing ?? 8,
          alignItems: dir === 'column' ? ALIGN[n.align || 'center'] : ALIGN[n.align || 'center'],
          ...s,
        }}
      >
        {kids(items)}
      </div>
    )
  }
  if (n.text !== undefined) {
    return (
      <span className="ph-text" style={{ ...(FONT[n.font] || FONT.body), color: col(n.color), fontWeight: n.bold ? 800 : undefined, fontStyle: n.italic ? 'italic' : undefined, textAlign: n.center ? 'center' : undefined, ...s }}>
        {n.text}
      </span>
    )
  }
  if (n.symbol) return <span className="ph-symbol" style={{ fontSize: n.size || 22, color: col(n.color), ...s }}>{n.symbol}</span>
  if (n.button !== undefined) {
    const st = n.style || 'plain'
    return <span className={`ph-btn ph-btn-${st}`} style={s}>{n.button}</span>
  }
  if (n.toggle !== undefined) {
    return (
      <div className="ph-row ph-toggle" style={s}>
        <span>{n.toggle}</span>
        <span className={`ph-switch ${n.on ? 'on' : ''}`}><i /></span>
      </div>
    )
  }
  if (n.field !== undefined) {
    return <div className={`ph-field ${n.value ? 'has' : ''}`} style={s}>{n.value || n.field}</div>
  }
  if (n.slider !== undefined) {
    return (
      <div className="ph-slider" style={s}>
        <div className="ph-slider-track"><div className="ph-slider-fill" style={{ width: `${n.slider * 100}%` }} /></div>
        <span className="ph-slider-knob" style={{ left: `calc(${n.slider * 100}% - 9px)` }} />
      </div>
    )
  }
  if (n.stepper !== undefined) {
    return (
      <div className="ph-row" style={s}>
        <span>{n.stepper}</span>
        <span className="ph-stepper"><b>−</b><b>+</b></span>
      </div>
    )
  }
  if (n.picker) {
    return (
      <div className="ph-seg" style={s}>
        {n.picker.map((p, i) => <span key={i} className={i === (n.sel || 0) ? 'sel' : ''}>{p}</span>)}
      </div>
    )
  }
  if (n.spacer) return <div className="ph-spacer" style={{ flex: 1, minHeight: n.min || 0 }} />
  if (n.divider) return <div className="ph-divider" />
  if (n.rect) {
    const r = n.rect
    return (
      <div
        className="ph-rect"
        style={{
          width: r.w ?? '100%', height: r.h ?? 40, background: col(r.color) || 'var(--ph-accent)',
          borderRadius: r.circle ? '50%' : r.radius || 0,
          backgroundImage: r.gradient ? `linear-gradient(${r.gradient.map(col).join(',')})` : undefined,
          ...s,
        }}
      >
        {r.label && <span>{r.label}</span>}
      </div>
    )
  }
  if (n.list) {
    const sections = n.sections ? n.list : [{ rows: n.list }]
    return (
      <div className={`ph-list ${n.plain ? 'plain' : ''}`} style={s}>
        {sections.map((sec, si) => (
          <Fragment key={si}>
            {sec.header && <div className="ph-list-header">{sec.header}</div>}
            <div className="ph-list-group">
              {sec.rows.map((r, ri) => {
                const row = typeof r === 'string' ? { title: r } : r
                return (
                  <div key={ri} className={`ph-list-row ${row.swiped ? 'swiped' : ''}`}>
                    {row.icon && <span className="ph-list-icon" style={{ background: col(row.iconBg) }}>{row.icon}</span>}
                    <div className="ph-list-main">
                      <span>{row.title}</span>
                      {row.subtitle && <small>{row.subtitle}</small>}
                    </div>
                    {row.detail && <span className="ph-list-detail">{row.detail}</span>}
                    {row.toggle !== undefined && <span className={`ph-switch ${row.toggle ? 'on' : ''}`}><i /></span>}
                    {row.chevron && <span className="ph-chevron">›</span>}
                    {row.check && <span className="ph-check">✓</span>}
                    {row.swiped && <span className="ph-swipe-btn">{row.swiped}</span>}
                  </div>
                )
              })}
            </div>
          </Fragment>
        ))}
      </div>
    )
  }
  if (n.grid) {
    return (
      <div className="ph-grid" style={{ gridTemplateColumns: `repeat(${n.cols || 3}, 1fr)`, gap: n.spacing ?? 8, ...s }}>
        {kids(n.grid)}
      </div>
    )
  }
  if (n.navbar) {
    const nb = n.navbar
    return (
      <div className={`ph-navbar ${nb.large ? 'large' : ''}`} style={s}>
        <div className="ph-navbar-row">
          <span className="ph-nav-back">{nb.back ? `‹ ${nb.back}` : nb.leading || ''}</span>
          {!nb.large && <span className="ph-nav-title">{nb.title}</span>}
          <span className="ph-nav-trailing">{nb.trailing || ''}</span>
        </div>
        {nb.large && <div className="ph-nav-large">{nb.title}</div>}
        {nb.search && <div className="ph-search">🔍 {nb.search}</div>}
      </div>
    )
  }
  if (n.tabbar) {
    return (
      <div className="ph-tabbar" style={s}>
        {n.tabbar.map((t, i) => (
          <span key={i} className={i === (n.active || 0) ? 'on' : ''}><b>{t.icon}</b>{t.label}</span>
        ))}
      </div>
    )
  }
  if (n.card) return <div className="ph-card" style={s}>{kids(n.card)}</div>
  if (n.badge) return <span className="ph-badge" style={s}>{n.badge}</span>
  if (n.progress !== undefined) {
    return n.progress === 'spin'
      ? <span className="ph-spinner" style={s} />
      : <div className="ph-progress" style={s}><div style={{ width: `${n.progress * 100}%` }} /></div>
  }
  if (n.label) return <span className="ph-labelled" style={s}><b>{n.label[0]}</b>{n.label[1]}</span>
  return null
}

// Superposiciones: hoja (sheet), alerta y diálogo
function Overlay({ o }) {
  if (!o) return null
  if (o.alert) {
    return (
      <div className="ph-dim">
        <div className="ph-alert">
          <b>{o.alert.title}</b>
          {o.alert.message && <p>{o.alert.message}</p>}
          <div className="ph-alert-btns">
            {o.alert.buttons.map((b, i) => <span key={i} className={b.startsWith('!') ? 'destructive' : ''}>{b.replace(/^!/, '')}</span>)}
          </div>
        </div>
      </div>
    )
  }
  if (o.sheet) {
    return (
      <div className="ph-dim sheet">
        <div className="ph-sheet">
          <span className="ph-grabber" />
          <Node n={o.sheet} />
        </div>
      </div>
    )
  }
  if (o.dialog) {
    return (
      <div className="ph-dim sheet">
        <div className="ph-dialog">
          {o.dialog.title && <small>{o.dialog.title}</small>}
          {o.dialog.buttons.map((b, i) => <span key={i} className={b.startsWith('!') ? 'destructive' : ''}>{b.replace(/^!/, '')}</span>)}
          <span className="cancel">Cancelar</span>
        </div>
      </div>
    )
  }
  return null
}

function Phone({ p }) {
  return (
    <figure className="ph-figure">
      <div className={`ph-device ${p.dark ? 'dark' : ''} ${p.small ? 'small' : ''}`}>
        <div className="ph-status"><span>9:41</span><span className="ph-island" /><span>●●● ▮</span></div>
        <div className={`ph-screen ${p.center === false ? 'top' : ''}`} style={{ background: col(p.bg) }}>
          <Node n={p.screen} />
        </div>
        <Overlay o={p.overlay} />
        <div className="ph-home" />
      </div>
      {p.caption && <figcaption>{p.caption}</figcaption>}
    </figure>
  )
}

export function PhonePreview({ preview }) {
  const list = Array.isArray(preview) ? preview : [preview]
  return (
    <div className="ph-wrap">
      <div className="ph-wrap-label">Vista previa ilustrativa</div>
      <div className="ph-row-devices">
        {list.map((p, i) => <Phone key={i} p={p} />)}
      </div>
    </div>
  )
}

function FlowStep({ s }) {
  return (
    <div className="dg-step" style={{ '--dg': s.c || 'var(--unit)' }}>
      {s.icon && <span className="dg-icon">{s.icon}</span>}
      <b>{s.t}</b>
      {s.d && <small>{s.d}</small>}
    </div>
  )
}

function TreeNode({ n }) {
  return (
    <div className="dg-tree-node">
      <div className="dg-tree-box" style={{ '--dg': n.c || 'var(--unit)' }}>
        <b>{n.t}</b>{n.d && <small>{n.d}</small>}
      </div>
      {n.children?.length > 0 && (
        <div className="dg-tree-children">
          {n.children.map((c, i) => <TreeNode key={i} n={c} />)}
        </div>
      )}
    </div>
  )
}

export function Diagram({ diagram: d }) {
  return (
    <figure className="dg-wrap">
      {d.kind === 'tree' ? (
        <div className="dg-tree"><TreeNode n={d.root} /></div>
      ) : (
        <div className={`dg-flow ${d.dir === 'col' ? 'col' : 'row'} ${d.loop ? 'loop' : ''}`}>
          {d.steps.map((s, i) => (
            <Fragment key={i}>
              {i > 0 && <span className="dg-arrow">{d.arrows?.[i - 1] ? <em>{d.arrows[i - 1]}</em> : null}</span>}
              <FlowStep s={s} />
            </Fragment>
          ))}
          {d.loop && <span className="dg-loop">↺ {d.loop}</span>}
        </div>
      )}
      {d.caption && <figcaption>{d.caption}</figcaption>}
    </figure>
  )
}
