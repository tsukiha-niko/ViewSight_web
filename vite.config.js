import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react() ],
  exclude: [
    '@ffmpeg/ffmpeg',
    '@ffmpeg/util'
  ],
  ssr: {
    noExternal: ['@ffmpeg/ffmpeg']
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: ['sy1.efrp.eu.org'],
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
})
