import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    watch: {
      // Vite crashes from time to time with iOS running without these ignored.
      ignored: [
        '**/ios/**', // whole iOS project folder
      ],
    },
  },
})
