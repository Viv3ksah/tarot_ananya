import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const cache = new Map<string, string>()
let searched = false
let loadedFrom: string | null = null

function parseEnvFile(content: string): Record<string, string> {
  const text = content.replace(/^\uFEFF/, '')
  const out: Record<string, string> = {}

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq <= 0) continue

    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    out[key] = value
  }

  return out
}

function applyEnv(envPath: string) {
  const parsed = parseEnvFile(readFileSync(envPath, 'utf8'))
  for (const [key, value] of Object.entries(parsed)) {
    cache.set(key, value)
    process.env[key] = value
  }
  loadedFrom = envPath
}

function loadLocalEnv() {
  if (searched) return
  searched = true

  // 1) Prefer .env in the current working directory (project root when using npm run dev)
  const cwdEnv = join(process.cwd(), '.env')
  if (existsSync(cwdEnv)) {
    try {
      applyEnv(cwdEnv)
      return
    } catch {
      // fall through
    }
  }

  // 2) Walk up from this file, but only accept folders that also have package.json
  try {
    let dir = dirname(fileURLToPath(import.meta.url))
    for (let i = 0; i < 8; i++) {
      const envPath = join(dir, '.env')
      const pkgPath = join(dir, 'package.json')
      if (existsSync(envPath) && existsSync(pkgPath)) {
        applyEnv(envPath)
        return
      }
      const parent = dirname(dir)
      if (parent === dir) break
      dir = parent
    }
  } catch {
    // ignore
  }
}

export function getEnv(name: string): string {
  loadLocalEnv()

  const cached = cache.get(name)
  if (cached) return cached

  try {
    const value = Netlify.env.get(name)
    if (value) return value
  } catch {
    // local / non-Netlify runtime
  }

  return process.env[name] ?? ''
}

export function getEnvDebug() {
  loadLocalEnv()
  return {
    cwd: process.cwd(),
    loadedFrom,
    hasKeyId: Boolean(getEnv('RAZORPAY_KEY_ID')),
    hasKeySecret: Boolean(getEnv('RAZORPAY_KEY_SECRET')),
  }
}
