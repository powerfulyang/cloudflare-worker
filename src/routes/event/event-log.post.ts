import { getAppInstance, getDrizzleInstance } from '@/core'
import { EventLog, EventLogPost } from '@/zodSchemas/EventLog'
import { JsonRequest } from '@/zodSchemas/JsonRequest'
import { JsonResponse } from '@/zodSchemas/JsonResponse'
import { createRoute } from '@hono/zod-openapi'
import { eventLog } from '~drizzle/schema/event'

const PostEventLog = getAppInstance()

const route = createRoute({
  method: 'post',
  path: '',
  request: {
    body: JsonRequest(EventLogPost),
  },
  responses: JsonResponse(EventLog),
})

PostEventLog.openapi(route, async (c) => {
  const json = c.req.valid('json')
  const db = getDrizzleInstance(c.env.DB)

  const result = await db
    .insert(eventLog)
    .values(json)
    .returning()
    .get()

  return c.json(result)
})

export default PostEventLog
