import { getAppInstance, getDrizzleInstance } from '@/core'
import { Event, EventPost } from '@/zodSchemas/Event'
import { JsonResponse } from '@/zodSchemas/JsonResponse'
import { createRoute, z } from '@hono/zod-openapi'
import { event } from '~drizzle/schema/event'

const PostEvent = getAppInstance()

const route = createRoute({
  method: 'post',
  path: '',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.array(EventPost).or(EventPost),
        },
      },
    },
  },
  responses: JsonResponse(z.array(Event)),
})

PostEvent.openapi(route, async (c) => {
  const json = c.req.valid('json')
  const db = getDrizzleInstance(c.env.DB)

  if (Array.isArray(json)) {
    const result = await db
      .insert(event)
      .values(json)
      .returning()
    return c.json(result)
  }
  const result = await db.insert(event).values(json).returning()
  return c.json(result)
})

export default PostEvent
