import { app } from '@/server';
import { babySchema } from '@/service/baby/baby.post';
import { CommonJSONResponse } from '@/zodSchemas/CommonJSONResponse';
import { createRoute, z } from '@hono/zod-openapi';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { baby } from '~drizzle/schema/baby';

const route = createRoute({
  path: '/api/baby',
  method: 'patch',
  request: {
    body: {
      content: {
        'application/json': {
          schema: babySchema
            .merge(
              z.object({
                avatar: z.number().int().optional(),
                gender: z.number().int().optional(),
              }),
            )
            .partial()
            .merge(z.object({ id: z.number().int().positive() })),
        },
      },
    },
  },
  responses: CommonJSONResponse(z.any()),
});

app.openapi(route, async (c) => {
  const json = c.req.valid('json');
  const db = drizzle(c.env.DB);

  const result = await db
    .update(baby)
    .set(json)
    .where(eq(baby.id, json.id))
    .returning()
    .get();

  return c.json(result);
});
