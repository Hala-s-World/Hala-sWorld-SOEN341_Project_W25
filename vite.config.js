import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    open: true,
    port: 5173
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js'
  },
  resolve: {
    alias: {
      '../assets/styles/Authentication.css': path.resolve(__dirname, './tests/__mocks__/empty-style.js')
    }
  }
})
