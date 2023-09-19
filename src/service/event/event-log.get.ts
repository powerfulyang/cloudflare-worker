import { app } from '@/server';
import { EventLogResultSchema } from '@/service/event/schemas/event-log';
import { convertDateToString } from '@/utils/formatDatetime';
import { CommonJSONResponse } from '@/zodSchemas/CommonJSONResponse';
import { createRoute, z } from '@hono/zod-openapi';
import { and, desc, eq, SQL, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { event, eventLog } from '~drizzle/schema';

const eventLogGet = createRoute({
  method: 'get',
  path: '/api/event-log',
  request: {
    query: z.object(
      {
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
      },
    ),
  },
  responses: CommonJSONResponse(z.array(EventLogResultSchema)),
});

app.openapi(eventLogGet, async (c) => {
  const { date, eventName } = c.req.valid('query');
  const db = drizzle(c.env.DB);
  const where: SQL[] = [];
  if (date) {
    where.push(
      eq(sql`DATE(${eventLog.eventTime} / 1000, 'unixepoch','+8 hours')`, date),
    );
  }
  if (eventName) {
    where.push(eq(eventLog.eventName, eventName));
  }
  const logs = await db
    .select()
    .from(eventLog)
    .where(and(...where))
    .orderBy(desc(eventLog.eventTime))
    .all();

  const events = await db
    .select()
    .from(event)
    .all();

  const helperMap = new Map<string, any>();
  for (const event of events) {
    helperMap.set(event.name, convertDateToString(event));
  }

  const result = logs.map((log) => {
    const event = helperMap.get(log.eventName);
    return {
      ...log,
      event,
    };
  });

  return c.json(convertDateToString(result));
});
