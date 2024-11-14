import type { User } from '#/prisma/client'
import type { AuthService } from '@/service/auth.service'
import { PrismaClient } from '#/prisma/client'
import { OpenAPIHono } from '@hono/zod-openapi'
import { PrismaD1 } from '@prisma/adapter-d1'
import { getContext } from 'hono/context-storage'

export function getCtx() {
  return getContext<AppEnv>()
}

export function getD1() {
  return getCtx().env.DB
}

export function getPrismaInstance() {
  const d1 = getD1()
  const adapter = new PrismaD1(d1)
  return new PrismaClient({ adapter })
}

export interface AppEnv {
  Bindings: Bindings
  Variables: {
    authService: AuthService
    user: User
  }
}

export function getAppInstance() {
  return new OpenAPIHono<AppEnv>()
}
