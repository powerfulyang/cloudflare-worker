import { EventLogSchema } from '@/service/event/schemas/event-log'
import { convertDateToString } from '@/utils/formatDatetime'
import { JsonResponse } from '@/zodSchemas/JsonResponse'
import { createRoute, z } from '@hono/zod-openapi'
import { eventLog } from '~drizzle/schema'
import { drizzle } from 'drizzle-orm/d1'

const eventLogPost = createRoute({
  method: 'post',
  path: '/api/event-log',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: EventLogSchema
            .pick(
              {
                eventName: true,
                comment: true,
                extra: true,
                eventTime: true,
              },
            )
            .extend(
              {
                eventTime: z.string().transform(v => new Date(v)).optional(),
              },
            )
            .openapi('EventLogPostRequest'),
        },
      },
    },
  },
  responses: JsonResponse(EventLogSchema),
})

appServer.openapi(eventLogPost, async (c) => {
  const json = c.req.valid('json')
  const db = drizzle(c.env.DB)
  const result = await db
    .insert(eventLog)
    .values(json)
    .returning()
    .get()

  return c.json(convertDateToString(result))
})
