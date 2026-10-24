import { loadEnv, type Plugin, type PreviewServer, type ViteDevServer } from 'vite'
import { createVisitorsReader } from './visitors.ts'

// Local adapter only. Secrets are never passed to Vite's client-side `define`.
export function visitorsPlugin(): Plugin {
  const configure = (server: ViteDevServer | PreviewServer) => {
    const env = {
      ...loadEnv(server.config.mode, server.config.envDir, 'ANALYTICS_'),
      ...process.env,
    }
    const readVisitors = createVisitorsReader(() => env)
    server.middlewares.use(async (req, res, next) => {
      const url = new URL(req.url ?? '/', 'http://127.0.0.1')
      if (url.pathname !== '/api/visitors') return next()
      if (req.method !== 'GET') {
        res.writeHead(405, { Allow: 'GET', 'Cache-Control': 'no-store' })
        res.end()
        return
      }
      const response = await readVisitors(new Request(url, { method: req.method }))
      res.statusCode = response.status
      response.headers.forEach((value, key) => res.setHeader(key, value))
      res.end(await response.text())
    })
  }
  return {
    name: 'local-visitors-api',
    configureServer: configure,
    configurePreviewServer: configure,
  }
}
