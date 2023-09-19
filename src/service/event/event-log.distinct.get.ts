import { app } from '@/server';
import { EventSchema } from '@/service/event/schemas/event';
import { EventLogSchema } from '@/service/event/schemas/event-log';
import { CommonJSONResponse } from '@/zodSchemas/CommonJSONResponse';
import { createRoute, z } from '@hono/zod-openapi';
import { and, eq, SQL, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { event, eventLog } from '~drizzle/schema';

const route = createRoute({
  method: 'get',
  path: '/api/event-log/distinct',
  request: {
    query: z.object(
      {
        date: z
          .string()
          .optional().openapi(
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
  responses: CommonJSONResponse(
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
});

app.openapi(route, async (c) => {
  const { date } = c.req.valid('query');
  const db = drizzle(c.env.DB);
  const where: SQL[] = [];
  if (date) {
    where.push(
      eq(sql`DATE(${eventLog.eventTime} / 1000, 'unixepoch','+8 hours')`, date),
    );
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
    .all();

  return c.json(result);
});
