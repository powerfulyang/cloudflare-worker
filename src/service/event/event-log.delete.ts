import { app } from '@/server';
import { CommonJSONResponse } from '@/zodSchemas/CommonJSONResponse';
import { createRoute, z } from '@hono/zod-openapi';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { eventLog } from '~drizzle/schema';

const eventLogDelete = createRoute({
  method: 'delete',
  path: '/api/event-log/{id}',
  request: {
    params: z.object(
      {
        id: z.string().min(1).openapi({
          param: {
            in: 'path',
            name: 'id',
          },
          example: '1',
        }),
      },
    ),
  },
  responses: CommonJSONResponse(
    z.object(
      {
        success: z
          .boolean()
          .openapi({
            example: true,
          }),
      },
    ),
  ),
});

app.openapi(eventLogDelete, async (c) => {
  const { id } = c.req.valid('param');
  const db = drizzle(c.env.DB);
  try {
    const result = await db
      .delete(eventLog)
      .where(eq(eventLog.id, Number(id)));

    return c.json({ success: result.success });
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});
