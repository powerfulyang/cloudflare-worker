import { getAppInstance, getDrizzleInstance } from '@/core'
import { EventKey, EventPatch, EventResult } from '@/zodSchemas/Event'
import { JsonRequest } from '@/zodSchemas/JsonRequest'
import { JsonResponse } from '@/zodSchemas/JsonResponse'
import { createRoute } from '@hono/zod-openapi'
import { event } from '~drizzle/schema/event'
import { eq } from 'drizzle-orm'

const PatchEvent = getAppInstance()

const route = createRoute({
  method: 'patch',
  path: ':id',
  request: {
    params: EventKey,
    body: JsonRequest(EventPatch),
  },
  responses: JsonResponse(EventResult),
})

PatchEvent.openapi(route, async (c) => {
  const { id } = c.req.valid('param')
  const json = c.req.valid('json')
  const db = getDrizzleInstance()

  const result = await db
    .update(event)
    .set(json)
    .where(eq(event.id, id))
    .returning()
    .get()
  return c.json(result)
})

export default PatchEvent
