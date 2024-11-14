import type { AppEnv } from '@/core'
import { getPrismaInstance } from '@/core'
import { getContext } from 'hono/context-storage'

export class BaseService {
  protected readonly prisma
  protected readonly jwtSecret

  constructor() {
    const ctx = getContext<AppEnv>()
    this.prisma = getPrismaInstance()
    this.jwtSecret = ctx.env.JWT_SECRET
  }
}
