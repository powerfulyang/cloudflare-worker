import { app } from '@/server';
import { EventSchema } from '@/service/event/schemas/event';
import { convertDateToString } from '@/utils/formatDatetime';
import { CommonJSONResponse } from '@/zodSchemas/CommonJSONResponse';
import { createRoute, z } from '@hono/zod-openapi';
import { drizzle } from 'drizzle-orm/d1';
import { event } from '~drizzle/schema';

const EventPostSchema = EventSchema
  .pick(
    {
      name: true,
      displayName: true,
      icon: true,
      extraFields: true,
    },
  )
  .openapi('EventPostRequest');

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
  responses: CommonJSONResponse(z.array(EventSchema)),
});

app.openapi(eventPost, async (c) => {
  const json = c.req.valid('json');
  const db = drizzle(c.env.DB);
  if (Array.isArray(json)) {
    const result = await db.insert(event).values(json).returning();

    return c.json(convertDateToString(result));
  }
  const result = await db.insert(event).values(json).returning();

  return c.json(convertDateToString(result));
});
