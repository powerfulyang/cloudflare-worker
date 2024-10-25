import { version } from '#/package.json'
import { OpenAPIHono } from '@hono/zod-openapi'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { fromZodError } from 'zod-validation-error'

const app = new OpenAPIHono<{
  Bindings: Bindings
  Variables: {
    bucketName: 'eleven' | 'test'
  }
}>({
  defaultHook: (result, c) => {
    if (!result.success) {
      // ZodError handler
      if (result.error.name === 'ZodError') {
        return c.json(
          {
            error: fromZodError(result.error).toString(),
            source: 'zod_error_handler',
          },
          422,
        )
      }
    }
  },
}).basePath('api')

app.use(
  '*',
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
)

app.use('*', logger())

// Error handler
app.onError((error, ctx) => {
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
