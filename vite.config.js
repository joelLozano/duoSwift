import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // En GitHub Pages la app vive en /<repo>/; el workflow define BASE_PATH. En local es '/'.
  base: process.env.BASE_PATH || '/',
  // Firebase se carga bajo demanda (import dinámico) solo si está configurado
  build: { chunkSizeWarningLimit: 800 },
})
