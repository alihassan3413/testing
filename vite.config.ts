import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // Hash router means no special rewrites needed on Netlify/Vercel
})
