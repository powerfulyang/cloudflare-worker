import { bucketSchema } from '@/service/r2/bucket.get'
import { JsonResponse } from '@/zodSchemas/JsonResponse'
import { createRoute } from '@hono/zod-openapi'
import { bucket } from '~drizzle/schema/upload'
import { drizzle } from 'drizzle-orm/d1'

const route = createRoute({
  method: 'post',
  path: '/api/bucket',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: bucketSchema.pick({ name: true, domain: true }),
        },
      },
    },
  },
  responses: JsonResponse(bucketSchema),
})

appServer.openapi(route, async (c) => {
  const { name, domain } = c.req.valid('json')
  const db = drizzle(c.env.DB)
  const result = await db
    .insert(bucket)
    .values({ name, domain })
    .returning()
    .get()
  return c.json(result)
})
