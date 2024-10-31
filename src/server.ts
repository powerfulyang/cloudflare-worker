import { version } from '#/package.json'
import { getAppInstance } from '@/core'
import { BabyService } from '@/service/baby.service'
import { z } from '@hono/zod-openapi'
import { every, some } from 'hono/combine'
import { contextStorage } from 'hono/context-storage'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { requestId } from 'hono/request-id'
import { secureHeaders } from 'hono/secure-headers'
import { fromZodError } from 'zod-validation-error'

const app = getAppInstance().basePath('api')

app.use(contextStorage())

function customLogger(message: string, ...rest: string[]) {
  console.log(message, ...rest)
}

// first
app.use(
  '*',
  every(
    secureHeaders(),
    requestId(),
    logger(customLogger),
    cors({
      origin: (origin) => {
        if (origin.endsWith('.littleeleven.com')) {
          return origin
        }
        return 'https://littleeleven.com'
      },
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      exposeHeaders: ['authorization'],
      allowHeaders: ['authorization', 'content-type'],
      maxAge: 86400,
    }),
  ),
)

// second
// service middleware
app.use('*', async (ctx, next) => {
  const d1 = ctx.env.DB
  ctx.set('babyService', new BabyService(d1))
  await next()
})

// Error handler
app.onError((error, ctx) => {
  if (error instanceof z.ZodError) {
    return ctx.json(
      {
        error: fromZodError(error).toString(),
        source: 'zod_error_handler',
      },
      422,
    )
  }
  return ctx.json(
    {
      error: error.message,
      source: 'error_handler',
    },
    500,
  )
})

app.doc31('doc', {
  openapi: '3.1.0',
  info: {
    version,
    title: 'Eleven API',
  },
})

export default app
