import type { SQL } from 'drizzle-orm'
import { getAppInstance, getDrizzleInstance } from '@/core'
import { EventLogResult } from '@/zodSchemas/EventLog'
import { JsonResponse } from '@/zodSchemas/JsonResponse'
import { createRoute, z } from '@hono/zod-openapi'
import { eventLog } from '~drizzle/schema/event'
import { and, desc, eq, sql } from 'drizzle-orm'

const QueryEventLog = getAppInstance()

const route = createRoute({
  method: 'get',
  path: '',
  request: {
    query: z.object({
      date: z
        .string()
        .optional()
        .openapi({
          format: 'date',
          param: {
            in: 'query',
            name: 'date',
          },
          example: '2021-01-01',
        }),
      eventName: z
        .string()
        .optional()
        .openapi({
          param: {
            in: 'query',
            name: 'eventName',
          },
          example: 'Weigh',
        }),
    }),
  },
  responses: JsonResponse(z.array(EventLogResult)),
})

QueryEventLog.openapi(route, async (c) => {
  const { date, eventName } = c.req.valid('query')
  const db = getDrizzleInstance(c.env.DB)

  const where: SQL[] = []
  if (date) {
    where.push(
      eq(sql`DATE(${eventLog.eventTime} / 1000, 'unixepoch','+8 hours')`, date),
    )
  }
  if (eventName) {
    where.push(eq(eventLog.eventName, eventName))
  }
  const result = await db
    .query
    .eventLog
    .findMany({
      with: {
        event: true,
      },
      where: and(...where),
      orderBy: desc(eventLog.eventTime),
    })

  return c.json(result)
})

export default QueryEventLog
