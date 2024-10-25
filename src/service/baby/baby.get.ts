import { JsonResponse } from '@/zodSchemas/JsonResponse'
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { baby } from '~drizzle/schema/baby'
import { bucket, upload } from '~drizzle/schema/upload'
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'

const route = new OpenAPIHono<{
  Bindings: Bindings
}>()

const getBabyById = createRoute({
  path: ':id',
  method: 'get',
  request: {
    params: z.object({
      id: z.string().or(z.number()).openapi(
        {
          description: 'The id of the baby to get',
          param: {
            in: 'path',
          },
        },
      ),
    }),
  },
  responses: JsonResponse(z.any()),
})

route.openapi(getBabyById, async (c) => {
  const { id } = c.req.valid('param')
  const db = drizzle(c.env.DB)

  const result = await db
    .select()
    .from(baby)
    .leftJoin(upload, eq(baby.avatar, upload.id))
    .leftJoin(bucket, eq(upload.bucketName, bucket.name))
    .where(eq(baby.id, Number(id)))
    .get()

  return c.json(result)
})

export default route
