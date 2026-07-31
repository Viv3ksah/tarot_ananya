import { config as loadDotenv } from 'dotenv'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

let loaded = false

function loadLocalEnv() {
  if (loaded) return
  loaded = true

  const here = dirname(fileURLToPath(import.meta.url))
  const candidates = [
    resolve(process.cwd(), '.env'),
    resolve(here, '../../../.env'),
    resolve(here, '../../.env'),
  ]

  for (const path of candidates) {
    if (existsSync(path)) {
      loadDotenv({ path, override: false })
      break
    }
  }
}

export function getEnv(name: string): string {
  loadLocalEnv()

  try {
    const value = Netlify.env.get(name)
    if (value) return value
  } catch {
    // local / non-Netlify runtime
  }

  return process.env[name] ?? ''
}
