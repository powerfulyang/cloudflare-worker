import { EventLogSchema } from '@/service/event/schemas/event-log'
import { convertDateToString } from '@/utils/formatDatetime'
import { JsonResponse } from '@/zodSchemas/JsonResponse'
import { createRoute, z } from '@hono/zod-openapi'
import { eventLog } from '~drizzle/schema'
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'

const eventLogPatch = createRoute({
  method: 'patch',
  path: '/api/event-log',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: EventLogSchema
            .pick(
              {
                id: true,
                comment: true,
                extra: true,
                eventTime: true,
              },
            )
            .partial({
              comment: true,
              extra: true,
              eventTime: true,
            })
            .extend(
              {
                eventTime: z.string().transform(v => new Date(v)).optional(),
              },
            )
            .openapi('EventLogPatchRequest'),
        },
      },
    },
  },
  responses: JsonResponse(EventLogSchema),
})

appServer.openapi(eventLogPatch, async (c) => {
  const json = c.req.valid('json')
  const db = drizzle(c.env.DB)
  const result = await db
    .update(eventLog)
    .set(json)
    .where(eq(eventLog.id, json.id))
    .returning()
    .get()

  return c.json(convertDateToString(result))
})
