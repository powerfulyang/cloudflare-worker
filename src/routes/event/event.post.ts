import { EventSchema } from '@/service/event/schemas/event'
import { convertDateToString } from '@/utils/formatDatetime'
import { JsonResponse } from '@/zodSchemas/JsonResponse'
import { createRoute, z } from '@hono/zod-openapi'
import { event } from '~drizzle/schema/event'
import { drizzle } from 'drizzle-orm/d1'

const EventPostSchema = EventSchema
  .pick(
    {
      name: true,
      displayName: true,
      icon: true,
      extraFields: true,
    },
  )
  .openapi('EventPostRequest')

const eventPost = createRoute({
  method: 'post',
  path: '/api/event',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: z.array(EventPostSchema).or(EventPostSchema),
        },
      },
    },
  },
  responses: JsonResponse(z.array(EventSchema)),
})

appServer.openapi(eventPost, async (c) => {
  const json = c.req.valid('json')
  const db = drizzle(c.env.DB)
  if (Array.isArray(json)) {
    const result = await db.insert(event).values(json).returning()

    return c.json(convertDateToString(result))
  }
  const result = await db.insert(event).values(json).returning()

  return c.json(convertDateToString(result))
})
