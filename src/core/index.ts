import type { BabyService } from '@/service/baby.service'
import { OpenAPIHono } from '@hono/zod-openapi'
import * as schema from '~drizzle/schema'
import { drizzle } from 'drizzle-orm/d1'

export function getDrizzleInstance(d1Database: D1Database) {
  return drizzle(d1Database, {
    schema,
    logger: true,
  })
}

export interface AppEnv {
  Bindings: Bindings
  Variables: {
    babyService: BabyService
  }
}

export function getAppInstance() {
  return new OpenAPIHono<AppEnv>()
}
