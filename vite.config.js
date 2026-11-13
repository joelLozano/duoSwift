import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Firebase se carga bajo demanda (import dinámico) solo si está configurado
  build: { chunkSizeWarningLimit: 800 },
})
