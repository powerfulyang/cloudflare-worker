import type { AuthService } from '@/service/auth.service'
import type { BabyService } from '@/service/baby.service'
import type { User } from '@prisma/client'
import { OpenAPIHono } from '@hono/zod-openapi'
import { PrismaD1 } from '@prisma/adapter-d1'
import { PrismaClient } from '@prisma/client'
import * as schema from '~drizzle/schema'
import { drizzle } from 'drizzle-orm/d1'
import { getContext } from 'hono/context-storage'

export function getCtx() {
  return getContext<AppEnv>()
}

export function getD1() {
  return getCtx().env.DB
}

export function getDrizzleInstance() {
  const d1 = getD1()
  return drizzle(d1, {
    schema,
    logger: true,
  })
}

export function getPrismaInstance() {
  const d1 = getD1()
  const adapter = new PrismaD1(d1)
  return new PrismaClient({ adapter })
}

export interface AppEnv {
  Bindings: Bindings
  Variables: {
    babyService: BabyService
    authService: AuthService
    user: User
  }
}

export function getAppInstance() {
  return new OpenAPIHono<AppEnv>()
}
