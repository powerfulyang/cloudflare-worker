import { getAppInstance, getDrizzleInstance } from '@/core'
import { EventLogKey } from '@/zodSchemas/EventLog'
import { InternalServerError } from '@/zodSchemas/JsonResponse'
import { createRoute } from '@hono/zod-openapi'
import { eventLog } from '~drizzle/schema/event'
import { eq } from 'drizzle-orm'

const DeleteEventLog = getAppInstance()

const route = createRoute({
  method: 'delete',
  path: ':id',
  request: {
    params: EventLogKey,
  },
  responses: {
    204: {
      description: 'No Content',
    },
    500: InternalServerError,
  },
})

DeleteEventLog.openapi(route, async (c) => {
  const { id } = c.req.valid('param')
  const db = getDrizzleInstance(c.env.DB)

  await db
    .update(eventLog)
    .set({
      deleted: true,
    })
    .where(eq(eventLog.id, id))
    .execute()

  return c.json(null, 204)
})

export default DeleteEventLog
