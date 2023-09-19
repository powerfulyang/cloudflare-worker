import { app } from '@/server';
import { uploadSchema } from '@/service/r2/upload.post';
import { CommonJSONResponse } from '@/zodSchemas/CommonJSONResponse';
import { createRoute, z } from '@hono/zod-openapi';
import { asc, eq, inArray } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { moment, momentsToUploads } from '~drizzle/schema/moment';
import { upload } from '~drizzle/schema/upload';

export const momentSchema = z.object({
  id: z.number().int().positive(),
  type: z.enum(['moment', 'feedback']).optional().default('moment'),
  content: z.string(),
  attachments: z.array(uploadSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const momentPostSchema = momentSchema
  .pick({ content: true, type: true })
  .merge(
    z.object({
      attachments: z
        .array(uploadSchema.pick({ id: true }))
        .optional()
        .default([]),
    }),
  )
  .openapi('MomentPostRequest');

const route = createRoute({
  method: 'post',
  path: '/api/moment',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: momentPostSchema,
        },
      },
    },
  },
  responses: CommonJSONResponse(momentSchema),
});

app.openapi(route, async (c) => {
  const { content, attachments, type } = c.req.valid('json');

  const db = drizzle(c.env.DB);
  const momentResult = await db
    .insert(moment)
    .values({ content, type })
    .returning()
    .get();

  // TODO: transaction with rollback

  const toInsert = attachments.map((attachment, index) => ({
    momentId: momentResult.id,
    uploadId: attachment.id,
    order: index,
  }));

  const result: any = momentResult;

  if (toInsert.length) {
    await db
      .insert(momentsToUploads)
      .values(toInsert)
      .execute();

    const res = await db
      .select()
      .from(upload)
      .leftJoin(momentsToUploads, eq(upload.id, momentsToUploads.uploadId))
      .orderBy(asc(momentsToUploads.order))
      .where(inArray(upload.id, attachments.map((a) => a.id)))
      .all();

    result.attachments = res.map((r) => r.upload);
  }

  return c.json(result);
});
