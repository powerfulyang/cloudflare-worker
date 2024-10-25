import { JsonResponse } from '@/zodSchemas/JsonResponse'
import { createRoute, z } from '@hono/zod-openapi'
import { bucket } from '~drizzle/schema/upload'
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'

export const bucketSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  domain: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

const route = createRoute({
  method: 'get',
  path: '/api/bucket/{name}',
  request: {
    params: z.object(
      {
        name: z.string()
          .openapi({
            param: {
              in: 'path',
            },
          }),
      },
    ),
  },
  responses: JsonResponse(bucketSchema),
})

appServer.openapi(route, async (c) => {
  const { name } = c.req.valid('param')
  const db = drizzle(c.env.DB)
  const result = await db
    .select()
    .from(bucket)
    .where(eq(bucket.name, name))
    .get()
  if (result) {
    return c.json(result)
  }
  return c.json({ error: 'Bucket not found' }, 404)
})
