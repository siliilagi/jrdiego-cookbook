import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Change '/diego-cookbook/' to match your GitHub repo name
// e.g. if your repo is github.com/yourname/family-recipes → '/family-recipes/'
export default defineConfig({
  plugins: [react()],
  base: '/jrdiego-cookbook/',
})
