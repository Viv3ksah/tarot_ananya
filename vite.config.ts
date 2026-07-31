import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import netlify from '@netlify/vite-plugin'

export default defineConfig(({ mode }) => {
  // Load all .env keys (including RAZORPAY_*) into process.env for Netlify functions
  const env = loadEnv(mode, process.cwd(), '')
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) {
      process.env[key] = value
    }
  }

  return {
    plugins: [react(), netlify()],
  }
})
