import app from '@/index'
import { expect } from 'vitest'

describe('baby', () => {
  it('get baby by id', async () => {
    const res = await app.request('/api/baby/1')

    expect(res.status).toBe(200)

    const json = await res.json()

    expect(json).toBeDefined()
  })
})
