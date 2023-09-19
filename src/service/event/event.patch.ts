import { app } from '@/server';
import { EventSchema } from '@/service/event/schemas/event';
import { convertDateToString } from '@/utils/formatDatetime';
import { CommonJSONResponse } from '@/zodSchemas/CommonJSONResponse';
import { createRoute, z } from '@hono/zod-openapi';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { event } from '~drizzle/schema';

const EventPatchSchema = EventSchema
  .pick(
    {
      id: true,
      name: true,
      displayName: true,
      icon: true,
      extraFields: true,
    },
  )
  .partial(
    {
      name: true,
      displayName: true,
      icon: true,
      extraFields: true,
    },
  )
  .openapi('EventPatchRequest');

const eventPatch = createRoute({
  method: 'patch',
  path: '/api/event',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: EventPatchSchema.or(z.array(EventPatchSchema)),
        },
      },
    },
  },
  responses: CommonJSONResponse(EventSchema.or(z.array(EventSchema))),
});

app.openapi(eventPatch, async (c) => {
  const json = c.req.valid('json');
  const db = drizzle(c.env.DB);
  if (Array.isArray(json)) {
    const result = [];
    for (const e of json) {
      const r = await db
        .update(event)
        .set(e)
        .where(eq(event.id, e.id))
        .returning()
        .get();
      result.push(r);
    }
    return c.json(convertDateToString(result));
  } else {
    const result = await db
      .update(event)
      .set(json)
      .where(eq(event.id, json.id))
      .returning()
      .get();
    return c.json(convertDateToString(result));
  }
});
