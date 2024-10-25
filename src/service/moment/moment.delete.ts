import { InternalServerError } from '@/zodSchemas/InternalServerError'
import { createRoute, z } from '@hono/zod-openapi'
import { moment, momentsToUploads } from '~drizzle/schema/moment'
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'

const route = createRoute({
  method: 'delete',
  path: '/api/moment/{id}',
  request: {
    params: z.object(
      {
        id: z.string().min(1).openapi({
          param: {
            in: 'path',
            name: 'id',
          },
          example: '1',
        }),
      },
    ),
  },
  responses: {
    204: {
      description: 'No Content',
    },
    500: InternalServerError,
  },
})

appServer.openapi(route, async (c) => {
  const { id } = c.req.valid('param')
  const db = drizzle(c.env.DB)
  // TODO: transaction with rollback
  // 先删关联
  await db
    .delete(momentsToUploads)
    .where(eq(momentsToUploads.momentId, Number(id)))
    .execute()
  // 再删主键
  await db
    .delete(moment)
    .where(eq(moment.id, Number(id)))
    .execute()

  return c.newResponse(null, 204)
})
