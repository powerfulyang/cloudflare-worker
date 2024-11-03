import app from '@/index'
import { env } from 'cloudflare:test'
import { expect } from 'vitest'

describe('baby', () => {
  it('get baby by id', async () => {
    const res = await app.request('/api/baby/1', undefined, env)

    expect(res.status).toBe(401)
  })
})
