import { getAppInstance, getDrizzleInstance } from '@/core'
import { MomentKey } from '@/zodSchemas/Moment'
import { createRoute } from '@hono/zod-openapi'
import { moment, momentsToUploads } from '~drizzle/schema/moment'
import { eq } from 'drizzle-orm'

const DeleteMoment = getAppInstance()

const route = createRoute({
  method: 'delete',
  path: ':id',
  request: {
    params: MomentKey,
  },
  responses: {
    204: {
      description: 'No Content',
    },
  },
})

DeleteMoment.openapi(route, async (c) => {
  const { id } = c.req.valid('param')
  const db = getDrizzleInstance(c.env.DB)

  // 先删关联
  await db
    .update(momentsToUploads)
    .set({ deleted: true })
    .where(eq(momentsToUploads.momentId, id))
    .execute()

  // 再删主键
  await db
    .update(moment)
    .set({ deleted: true })
    .where(eq(moment.id, id))
    .execute()

  return c.newResponse(null, 204)
})

export default DeleteMoment
