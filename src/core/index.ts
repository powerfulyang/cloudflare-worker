import type { AuthService } from '@/service/auth.service'
import type { BabyService } from '@/service/baby.service'
import type { PrismaClient } from '@prisma/client'
import { OpenAPIHono } from '@hono/zod-openapi'
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

export interface AppEnv {
  Bindings: Bindings
  Variables: {
    babyService: BabyService
    authService: AuthService
    prisma: PrismaClient
  }
}

export function getAppInstance() {
  return new OpenAPIHono<AppEnv>()
}
