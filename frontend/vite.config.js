import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Tambahkan base path untuk GitHub Pages (URL repository name)
  base: '/Personal-AuDHD-Task-Engine/',
})
