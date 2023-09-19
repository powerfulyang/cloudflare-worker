import { app } from '@/server';
import { babySchema } from '@/service/baby/baby.post';
import { CommonJSONResponse } from '@/zodSchemas/CommonJSONResponse';
import { createRoute, z } from '@hono/zod-openapi';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { HTTPException } from 'hono/http-exception';
import { baby } from '~drizzle/schema/baby';
import { bucket, upload } from '~drizzle/schema/upload';

const route = createRoute({
  path: '/api/baby/{id}',
  method: 'get',
  request: {
    params: z.object({
      id: z.string().openapi(
        {
          description: 'The id of the baby to get',
          param: {
            in: 'path',
          },
        },
      ),
    }),
  },
  responses: CommonJSONResponse(babySchema),
});

app.openapi(route, async (c) => {
  const { id } = c.req.valid('param');
  const db = drizzle(c.env.DB);

  const result = await db
    .select({
      name: baby.name,
      bornAt: baby.bornAt,
      gender: baby.gender,
      avatar: {
        id: upload.id,
        hash: upload.hash,
        thumbnailHash: upload.thumbnailHash,
      },
      bucket: {
        domain: bucket.domain,
      },
    })
    .from(baby)
    .leftJoin(upload, eq(baby.avatar, upload.id))
    .leftJoin(bucket, eq(upload.bucketName, bucket.name))
    .where(eq(baby.id, Number(id)))
    .get();

  if (result) {
    result.avatar = {
      ...result.avatar,
      // @ts-ignore
      bucket: result.bucket,
    };
  } else {
    throw new HTTPException(404, {
      message: 'Baby not found',
    });
  }

  return c.json<any>(result);
});
