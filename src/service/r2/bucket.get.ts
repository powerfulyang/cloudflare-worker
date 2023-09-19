import { app } from '@/server';
import { CommonJSONResponse } from '@/zodSchemas/CommonJSONResponse';
import { createRoute, z } from '@hono/zod-openapi';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { bucket } from '~drizzle/schema/upload';

export const bucketSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  domain: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const route = createRoute({
  method: 'get',
  path: '/api/bucket/{name}',
  request: {
    params: z.object(
      {
        name: z.string()
          .openapi({
            param: {
              in: 'path',
            },
          }),
      },
    ),
  },
  responses: CommonJSONResponse(bucketSchema),
});

app.openapi(route, async (c) => {
  const { name } = c.req.valid('param');
  const db = drizzle(c.env.DB);
  const result = await db
    .select()
    .from(bucket)
    .where(eq(bucket.name, name))
    .get();
  if (result) {
    return c.json(result);
  }
  return c.json({ error: 'Bucket not found' }, 404);
});
