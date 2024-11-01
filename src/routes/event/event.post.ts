import { getAppInstance, getDrizzleInstance } from '@/core'
import { EventPost, EventResult } from '@/zodSchemas/Event'
import { JsonRequest } from '@/zodSchemas/JsonRequest'
import { JsonResponse } from '@/zodSchemas/JsonResponse'
import { createRoute } from '@hono/zod-openapi'
import { event } from '~drizzle/schema/event'

const PostEvent = getAppInstance()

const route = createRoute({
  method: 'post',
  path: '',
  request: {
    body: JsonRequest(EventPost),
  },
  responses: JsonResponse(EventResult),
})

PostEvent.openapi(route, async (c) => {
  const json = c.req.valid('json')
  const db = getDrizzleInstance(c.env.DB)

  const result = await db
    .insert(event)
    .values(json)
    .returning()
    .get()
  return c.json(result)
})

export default PostEvent
