import { getAppInstance, getDrizzleInstance } from '@/core'
import { EventLogKey, EventLogPatch } from '@/zodSchemas/EventLog'
import { JsonRequest } from '@/zodSchemas/JsonRequest'
import { JsonResponse } from '@/zodSchemas/JsonResponse'
import { createRoute, z } from '@hono/zod-openapi'
import { eventLog } from '~drizzle/schema/event'
import { eq } from 'drizzle-orm'

const PatchEventLog = getAppInstance()

const route = createRoute({
  method: 'patch',
  path: '/:id',
  request: {
    params: EventLogKey,
    body: JsonRequest(EventLogPatch),
  },
  responses: JsonResponse(z.boolean()),
})

PatchEventLog.openapi(route, async (c) => {
  const { id } = c.req.valid('param')
  const json = c.req.valid('json')
  const db = getDrizzleInstance()

  await db
    .update(eventLog)
    .set(json)
    .where(eq(eventLog.id, id))
    .returning()
    .get()

  return c.json(true)
})

export default PatchEventLog
