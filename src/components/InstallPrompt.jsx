import { useEffect, useState } from 'react'

// Aviso para instalar DuoSwift en la pantalla de inicio.
// - Android/Chrome/Edge: usa el diálogo nativo de instalación (evento beforeinstallprompt).
// - iPhone/iPad: Safari no permite instalar con un botón, así que se muestran los pasos.
// Si el usuario lo cierra, se vuelve a ofrecer pasados unos días.

const DISMISS_KEY = 'duoswift-install-dismissed'
const ASK_AGAIN_DAYS = 7

const isStandalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true

const isIOS = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) // iPad con iPadOS

function recentlyDismissed() {
  try {
    const at = Number(localStorage.getItem(DISMISS_KEY))
    return at && Date.now() - at < ASK_AGAIN_DAYS * 24 * 60 * 60 * 1000
  } catch {
    return false
  }
}

// El evento puede llegar antes de que React monte el componente: se captura en cuanto carga el módulo.
let deferredPrompt = null
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    window.dispatchEvent(new Event('duoswift-installable'))
  })
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="install-share-icon">
      <path d="M12 3v12M12 3l-4 4M12 3l4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 10H6a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1h-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default function InstallPrompt() {
  const [mode, setMode] = useState(null) // null | 'native' | 'ios'

  useEffect(() => {
    if (isStandalone() || recentlyDismissed()) return

    const showNative = () => setMode('native')
    if (deferredPrompt) showNative()
    window.addEventListener('duoswift-installable', showNative)

    const onInstalled = () => setMode(null)
    window.addEventListener('appinstalled', onInstalled)

    let timer
    if (isIOS()) timer = setTimeout(() => setMode('ios'), 1200)

    return () => {
      window.removeEventListener('duoswift-installable', showNative)
      window.removeEventListener('appinstalled', onInstalled)
      clearTimeout(timer)
    }
  }, [])

  if (!mode) return null

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()))
    } catch {
      /* sin almacenamiento: solo se oculta esta vez */
    }
    setMode(null)
  }

  const install = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    deferredPrompt = null
    if (outcome === 'accepted') setMode(null)
    else dismiss()
  }

  return (
    <div className="install-prompt" role="dialog" aria-label="Instalar DuoSwift">
      <img src={`${import.meta.env.BASE_URL}icons/icon-192.png`} alt="" width="48" height="48" className="install-icon" />
      <div className="install-body">
        <strong>Instala DuoSwift</strong>
        {mode === 'native' ? (
          <p>Agrégala a tu pantalla de inicio y ábrela como una app, incluso sin conexión.</p>
        ) : (
          <p>
            Toca <ShareIcon /> <b>Compartir</b> y luego <b>“Agregar a pantalla de inicio”</b>.
          </p>
        )}
        <div className="install-actions">
          {mode === 'native' && (
            <button type="button" className="btn btn-primary" onClick={install}>
              Instalar
            </button>
          )}
          <button type="button" className="btn btn-ghost" onClick={dismiss}>
            {mode === 'native' ? 'Ahora no' : 'Entendido'}
          </button>
        </div>
      </div>
      <button type="button" className="install-close" onClick={dismiss} aria-label="Cerrar">
        ×
      </button>
    </div>
  )
}
