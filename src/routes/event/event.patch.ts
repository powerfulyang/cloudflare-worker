import { getAppInstance, getDrizzleInstance } from '@/core'
import { Event, EventPatch } from '@/zodSchemas/Event'
import { JsonResponse } from '@/zodSchemas/JsonResponse'
import { createRoute, z } from '@hono/zod-openapi'
import { event } from '~drizzle/schema/event'
import { eq } from 'drizzle-orm'

const PatchEvent = getAppInstance()

const route = createRoute({
  method: 'patch',
  path: '',
  request: {
    body: {
      content: {
        'application/json': {
          schema: EventPatch.or(z.array(EventPatch)),
        },
      },
    },
  },
  responses: JsonResponse(Event.or(z.array(Event))),
})

PatchEvent.openapi(route, async (c) => {
  const json = c.req.valid('json')
  const db = getDrizzleInstance(c.env.DB)

  if (Array.isArray(json)) {
    const result = []
    for (const e of json) {
      const r = await db
        .update(event)
        .set(e)
        .where(eq(event.id, e.id))
        .returning()
        .get()
      result.push(r)
    }
    return c.json(result)
  }
  else {
    const result = await db
      .update(event)
      .set(json)
      .where(eq(event.id, json.id))
      .returning()
      .get()
    return c.json(result)
  }
})

export default PatchEvent
