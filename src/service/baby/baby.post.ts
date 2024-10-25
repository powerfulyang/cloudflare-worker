import { uploadSchema } from '@/service/r2/upload.post'
import { JsonResponse } from '@/zodSchemas/JsonResponse'
import { createRoute, z } from '@hono/zod-openapi'
import { baby } from '~drizzle/schema/baby'
import { drizzle } from 'drizzle-orm/d1'

export const babySchema = z.object({
  name: z.string(),
  avatar: uploadSchema,
  gender: z.number().int(),
  bornAt: z.string(),
})

const route = createRoute({
  path: '/api/baby',
  method: 'post',
  request: {
    body: {
      content: {
        'application/json': {
          schema: babySchema.merge(
            z.object({
              avatar: z.number().int(),
              gender: z.number().int().default(0),
            }),
          ),
        },
      },
    },
  },
  responses: JsonResponse(z.any()),
})

appServer.openapi(route, async (c) => {
  const json = c.req.valid('json')
  const db = drizzle(c.env.DB)

  const result = await db
    .insert(baby)
    .values(json)
    .returning()
    .get()

  return c.json(result)
})
