import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/frontline-lxp-prototype/',
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'frontline-app.js',
        chunkFileNames: 'frontline-[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'frontline-app.css'
          }
          return 'assets/[name]-[hash][extname]'
        },
      },
    },
  },
})
