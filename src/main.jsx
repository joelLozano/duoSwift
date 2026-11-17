import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import InstallPrompt from './components/InstallPrompt.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ProgressProvider } from './context/ProgressContext.jsx'
import './styles/app.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <ProgressProvider>
          <App />
          <InstallPrompt />
        </ProgressProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)

// PWA: registra el service worker solo en producción (en dev interferiría con el hot reload de Vite).
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, { scope: import.meta.env.BASE_URL })
  })
}
