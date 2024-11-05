import { getAppInstance, getDrizzleInstance } from '@/core'
import { EventLogPost } from '@/zodSchemas/EventLog'
import { JsonRequest } from '@/zodSchemas/JsonRequest'
import { JsonResponse } from '@/zodSchemas/JsonResponse'
import { createRoute, z } from '@hono/zod-openapi'
import { eventLog } from '~drizzle/schema/event'

const PostEventLog = getAppInstance()

const route = createRoute({
  method: 'post',
  path: '',
  request: {
    body: JsonRequest(EventLogPost),
  },
  responses: JsonResponse(z.boolean()),
})

PostEventLog.openapi(route, async (c) => {
  const json = c.req.valid('json')
  const db = getDrizzleInstance()

  await db
    .insert(eventLog)
    .values(json)
    .execute()

  return c.json(true)
})

export default PostEventLog
