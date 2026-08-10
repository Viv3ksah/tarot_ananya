import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { homedir } from 'node:os'
import { join, relative } from 'node:path'
import { request } from 'node:https'

const require = createRequire(import.meta.url)
const { execSync } = require('node:child_process')

const siteId = '612de797-4386-4c96-ab6a-deafcdc20195'
const distDir = join(process.cwd(), 'dist')
const functionsSrc = join(process.cwd(), 'netlify', 'functions')
const functionsOut = join(process.cwd(), '.netlify', 'functions-deploy')

function readToken() {
  const candidates = [
    join(homedir(), '.netlify', 'config.json'),
    join(process.env.APPDATA || '', 'netlify', 'Config', 'config.json'),
    join(process.env.LOCALAPPDATA || '', 'netlify', 'Config', 'config.json'),
  ]
  for (const path of candidates) {
    if (!path || !existsSync(path)) continue
    const cfg = JSON.parse(readFileSync(path, 'utf8'))
    if (cfg?.token) return cfg.token
    for (const user of Object.values(cfg?.users || {})) {
      if (user?.auth?.token) return user.auth.token
    }
  }
  throw new Error('Netlify auth token not found. Run: npx netlify login')
}

function sha1File(filePath) {
  return createHash('sha1').update(readFileSync(filePath)).digest('hex')
}

function sha256File(filePath) {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex')
}

function listFiles(dir) {
  const out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...listFiles(full))
    else out.push(full)
  }
  return out
}

function apiJson(method, path, token, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? Buffer.from(JSON.stringify(body)) : null
    const req = request(
      {
        method,
        hostname: 'api.netlify.com',
        path,
        headers: {
          Authorization: `Bearer ${token}`,
          ...(payload
            ? { 'Content-Type': 'application/json', 'Content-Length': payload.length }
            : {}),
        },
      },
      (res) => {
        let data = ''
        res.on('data', (c) => (data += c))
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(data ? JSON.parse(data) : {})
          } else {
            reject(new Error(`${method} ${path} -> ${res.statusCode}: ${data.slice(0, 600)}`))
          }
        })
      },
    )
    req.on('error', reject)
    if (payload) req.write(payload)
    req.end()
  })
}

function putBinary(url, token, buffer, contentType, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const target = new URL(url)
    const req = request(
      {
        method: 'PUT',
        hostname: target.hostname,
        path: target.pathname + target.search,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': contentType,
          'Content-Length': buffer.length,
          ...extraHeaders,
        },
      },
      (res) => {
        let data = ''
        res.on('data', (c) => (data += c))
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) resolve(data)
          else reject(new Error(`PUT ${target.pathname}${target.search} -> ${res.statusCode}: ${data.slice(0, 400)}`))
        })
      },
    )
    req.on('error', reject)
    req.write(buffer)
    req.end()
  })
}

writeFileSync(
  join(distDir, '_redirects'),
  ['/api/*  /.netlify/functions/:splat  200', '/*    /index.html   200', ''].join('\n'),
)

console.log('Bundling functions...')
if (existsSync(functionsOut)) rmSync(functionsOut, { recursive: true, force: true })
mkdirSync(functionsOut, { recursive: true })
execSync(`npx --yes @netlify/zip-it-and-ship-it "${functionsSrc}" "${functionsOut}"`, {
  stdio: 'pipe',
  shell: true,
})

const token = readToken()
const files = {}
const fileBuffers = {}
for (const filePath of listFiles(distDir)) {
  const webPath = '/' + relative(distDir, filePath).split('\\').join('/')
  const digest = sha1File(filePath)
  files[webPath] = digest
  fileBuffers[digest] = { path: webPath, buffer: readFileSync(filePath) }
}

const functionRoutes = {
  'admin-bookings': {
    path: '/api/admin/bookings',
    methods: ['GET', 'OPTIONS'],
  },
  'booked-slots': {
    path: '/api/booked-slots',
    methods: ['GET', 'OPTIONS'],
  },
  'create-order': {
    path: '/api/create-order',
    methods: ['POST', 'OPTIONS'],
  },
  'payment-status': {
    path: '/api/payment-status',
    methods: ['GET', 'OPTIONS'],
  },
  'verify-payment': {
    path: '/api/verify-payment',
    methods: ['POST', 'OPTIONS'],
  },
}

const functions = {}
const functionBuffers = {}
for (const filePath of listFiles(functionsOut).filter((f) => f.endsWith('.zip'))) {
  const name = relative(functionsOut, filePath).replace(/\.zip$/i, '').split('\\').join('/')
  const digest = sha256File(filePath)
  const buffer = readFileSync(filePath)
  functions[name] = digest
  functionBuffers[digest] = { name, buffer, size: buffer.length }
}

const routes = Object.entries(functionRoutes).map(([name, route]) => ({
  expression: route.path,
  literal: route.path,
  methods: route.methods,
  prefer_static: false,
  function: name,
}))

console.log(
  `Creating deploy with ${Object.keys(files).length} files, ${Object.keys(functions).length} functions, ${routes.length} routes...`,
)

const deploy = await apiJson('POST', `/api/v1/sites/${siteId}/deploys`, token, {
  files,
  functions,
  routes,
  redirects: [
    { from: '/api/booked-slots', to: '/.netlify/functions/booked-slots', status: 200, force: true },
    { from: '/api/admin/bookings', to: '/.netlify/functions/admin-bookings', status: 200, force: true },
    { from: '/api/create-order', to: '/.netlify/functions/create-order', status: 200, force: true },
    { from: '/api/payment-status', to: '/.netlify/functions/payment-status', status: 200, force: true },
    { from: '/api/verify-payment', to: '/.netlify/functions/verify-payment', status: 200, force: true },
    { from: '/*', to: '/index.html', status: 200 },
  ],
})

const required = deploy.required || []
const requiredFunctions = deploy.required_functions || []
console.log(`required files=${required.length}`)
console.log(`required functions=${requiredFunctions.length}`)

for (const digest of required) {
  const item = fileBuffers[digest]
  if (!item) throw new Error(`Missing file buffer for ${digest}`)
  await putBinary(
    `https://api.netlify.com/api/v1/deploys/${deploy.id}/files${item.path}`,
    token,
    item.buffer,
    'application/octet-stream',
  )
  console.log(`uploaded file ${item.path}`)
}

for (const digest of requiredFunctions) {
  const item =
    functionBuffers[digest] ||
    Object.values(functionBuffers).find((f) => f.name === digest)
  if (!item) throw new Error(`Missing function buffer for ${digest}`)
  const url =
    `https://api.netlify.com/api/v1/deploys/${deploy.id}/functions/${encodeURIComponent(item.name)}` +
    `?runtime=js&size=${item.size}`
  await putBinary(url, token, item.buffer, 'application/octet-stream', {
    Language: 'js',
  })
  console.log(`uploaded function ${item.name}`)
}

await new Promise((r) => setTimeout(r, 5000))
const ready = await apiJson('GET', `/api/v1/deploys/${deploy.id}`, token)
console.log(`deploy_id=${ready.id}`)
console.log(`state=${ready.state}`)
console.log(`url=${ready.ssl_url || ready.url}`)
console.log(
  `functions=${(ready.available_functions || []).map((f) => f.n).join(',') || 'none'}`,
)
