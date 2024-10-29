import { getAppInstance, getDrizzleInstance } from '@/core'
import { Bucket } from '@/zodSchemas/Bucket'
import { JsonResponse } from '@/zodSchemas/JsonResponse'
import { createRoute, z } from '@hono/zod-openapi'
import { bucket } from '~drizzle/schema/upload'
import { eq } from 'drizzle-orm'

const GetBucket = getAppInstance()

const route = createRoute({
  method: 'get',
  path: ':name',
  request: {
    params: z.object({
      name: z.string().openapi({
        description: 'The name of the bucket to get',
        param: {
          in: 'path',
        },
      }),
    }),
  },
  responses: JsonResponse(Bucket),
})

GetBucket.openapi(route, async (c) => {
  const { name } = c.req.valid('param')
  const db = getDrizzleInstance(c.env.DB)

  const result = await db.query.bucket.findFirst({
    where: eq(bucket.name, name),
  })

  return c.json(result)
})

export default GetBucket
