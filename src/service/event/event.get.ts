import { app } from '@/server';
import { EventSchema } from '@/service/event/schemas/event';
import { convertDateToString } from '@/utils/formatDatetime';
import { CommonJSONResponse } from '@/zodSchemas/CommonJSONResponse';
import { createRoute, z } from '@hono/zod-openapi';
import { drizzle } from 'drizzle-orm/d1';
import { event } from '~drizzle/schema';

const eventGet = createRoute({
  method: 'get',
  path: '/api/event',
  responses: CommonJSONResponse(z.array(EventSchema)),
});

app.openapi(eventGet, async (c) => {
  const db = drizzle(c.env.DB);
  const result = await db.select().from(event).all();

  return c.json(convertDateToString(result));
});
