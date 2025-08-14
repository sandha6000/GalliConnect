import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/static/', // All assets served from Django's STATIC_URL
  build: {
    outDir: resolve(__dirname, '../templates'),
    emptyOutDir: true,
    manifest: true,
    sourcemap: true, // ✅ Source maps in dev builds only
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
    },
  },
})
