import { EventSchema } from '@/service/event/schemas/event'
import { convertDateToString } from '@/utils/formatDatetime'
import { JsonResponse } from '@/zodSchemas/JsonResponse'
import { createRoute, z } from '@hono/zod-openapi'
import { event } from '~drizzle/schema'
import { drizzle } from 'drizzle-orm/d1'

const eventGet = createRoute({
  method: 'get',
  path: '/api/event',
  responses: JsonResponse(z.array(EventSchema)),
})

appServer.openapi(eventGet, async (c) => {
  const db = drizzle(c.env.DB)
  const result = await db.select().from(event).all()

  return c.json(convertDateToString(result))
})
