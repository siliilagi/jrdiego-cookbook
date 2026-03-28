import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path applies only in production (GitHub Pages).
// In dev mode, the app runs at localhost:5173/ as normal.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/jrdiego-cookbook/' : '/',
}))
