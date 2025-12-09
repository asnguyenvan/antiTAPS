import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Use '.' instead of process.cwd() to avoid TypeScript errors if Node types are missing
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // Safely expose the API_KEY to the client-side code
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})