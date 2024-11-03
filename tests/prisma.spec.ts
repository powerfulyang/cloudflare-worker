import { PrismaD1 } from '@prisma/adapter-d1'
import { PrismaClient } from '@prisma/client'
import { env } from 'cloudflare:test'

export function getPrisma(DB: D1Database) {
  const adapter = new PrismaD1(DB)
  return new PrismaClient({ adapter })
}

describe('prismaClient', () => {
  const prisma = getPrisma(env.DB)

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('can run basic query', async () => {
    const result = await prisma.$queryRawUnsafe(
      'select 1 + 1',
    )

    expect(result).toEqual(2)
  })
})
