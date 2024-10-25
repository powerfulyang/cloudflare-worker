import type { SQL } from 'drizzle-orm'
import { EventSchema } from '@/service/event/schemas/event'
import { EventLogSchema } from '@/service/event/schemas/event-log'
import { JsonResponse } from '@/zodSchemas/JsonResponse'
import { createRoute, z } from '@hono/zod-openapi'
import { event, eventLog } from '~drizzle/schema'
import { and, eq, sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'

const route = createRoute({
  method: 'get',
  path: '/api/event-log/distinct',
  request: {
    query: z.object(
      {
        date: z
          .string()
          .optional()
          .openapi(
            {
              format: 'date',
              param: {
                in: 'query',
                name: 'date',
              },
              example: '2021-01-01',
            },
          ),
      },
    ),
  },
  responses: JsonResponse(
    z.array(
      EventSchema
        .pick(
          {
            displayName: true,
          },
        )
        .merge(
          EventLogSchema.pick(
            {
              eventName: true,
            },
          ),
        )
        .extend({
          count: z.number(),
        })
        .openapi('EventLogDistinctResult'),
    ),
  ),
})

appServer.openapi(route, async (c) => {
  const { date } = c.req.valid('query')
  const db = drizzle(c.env.DB)
  const where: SQL[] = []
  if (date) {
    where.push(
      eq(sql`DATE(${eventLog.eventTime} / 1000, 'unixepoch','+8 hours')`, date),
    )
  }
  const result = await db
    .select({
      eventName: eventLog.eventName,
      displayName: sql<string>`${event.displayName}`,
      count: sql<number>`COUNT(${eventLog.eventName})`,
    })
    .from(eventLog)
    .leftJoin(event, eq(event.name, eventLog.eventName))
    .where(and(...where))
    .groupBy(eventLog.eventName)
    .all()

  return c.json(result)
})
