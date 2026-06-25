import test from 'node:test'
import assert from 'node:assert/strict'

import createApp from '../app.js'

const listen = (app) =>
  new Promise((resolve) => {
    const server = app.listen(0, () => resolve(server))
  })

test('smoke: meta.json returns JSON + request id header', async () => {
  process.env.NODE_ENV = 'test'
  const app = createApp()
  const server = await listen(app)
  const { port } = server.address()

  try {
    const res = await fetch(`http://127.0.0.1:${port}/meta.json`)
    assert.equal(res.status, 200)
    assert.ok(res.headers.get('x-request-id'))
    const data = await res.json()
    assert.equal(data.name, 'Ecommerce Frontend')
  } finally {
    server.close()
  }
})

test('smoke: unknown route returns JSON error with requestId', async () => {
  process.env.NODE_ENV = 'test'
  const app = createApp()
  const server = await listen(app)
  const { port } = server.address()

  try {
    const res = await fetch(`http://127.0.0.1:${port}/does-not-exist`)
    assert.equal(res.status, 404)
    const data = await res.json()
    assert.ok(data.message)
    assert.ok(data.requestId)
  } finally {
    server.close()
  }
})

