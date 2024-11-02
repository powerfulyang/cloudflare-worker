import type { AppEnv } from '@/core'
import { getDrizzleInstance } from '@/core'
import { getContext } from 'hono/context-storage'

export class BaseService {
  protected readonly drizzle
  protected readonly prisma

  constructor() {
    const ctx = getContext<AppEnv>()
    this.drizzle = getDrizzleInstance()
    this.prisma = ctx.get('prisma')
  }
}
