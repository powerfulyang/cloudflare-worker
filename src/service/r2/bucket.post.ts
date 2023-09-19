import { app } from '@/server';
import { bucketSchema } from '@/service/r2/bucket.get';
import { CommonJSONResponse } from '@/zodSchemas/CommonJSONResponse';
import { createRoute, z } from '@hono/zod-openapi';
import { drizzle } from 'drizzle-orm/d1';
import { bucket } from '~drizzle/schema/upload';

const route = createRoute({
  method: 'post',
  path: '/api/bucket',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: bucketSchema.pick({ name: true, domain: true }),
        },
      },
    },
  },
  responses: CommonJSONResponse(bucketSchema),
});

app.openapi(route, async (c) => {
  const { name, domain } = c.req.valid('json');
  const db = drizzle(c.env.DB);
  const result = await db
    .insert(bucket)
    .values({ name, domain })
    .returning()
    .get();
  return c.json(result);
});
