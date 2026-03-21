import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { registerBullhub } from '@bullhub/hono'
import { showRoutes } from "hono/dev"

const app = new Hono()

app.get('/health', (c) => c.json({ ok: true }))

registerBullhub(app, {
    queues: ['email-queue', 'notification-queue'],
    connection: { host: 'localhost', port: 6379 },
})

showRoutes(app)

serve({ fetch: app.fetch, port: 3000 })