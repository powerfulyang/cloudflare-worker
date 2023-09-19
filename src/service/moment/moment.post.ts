import { app } from '@/server';
import { uploadFile, uploadSchema } from '@/service/r2/upload.post';
import { CommonJSONResponse } from '@/zodSchemas/CommonJSONResponse';
import { createRoute, z } from '@hono/zod-openapi';
import { drizzle } from 'drizzle-orm/d1';
import { moment, momentsToUploads } from '~drizzle/schema/moment';

export const momentSchema = z.object({
  id: z.number().int().positive(),
  content: z.string(),
  attachments: z.array(uploadSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const momentPostSchema = momentSchema
  .pick({ content: true })
  .merge(
    z.object({
      attachments: z.array(z.instanceof(File)).or(z.instanceof(File)).default(
        [],
      ),
      bucketName: z.string().optional().default('eleven'),
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
        'multipart/form-data': {
          schema: momentPostSchema,
        },
      },
    },
  },
  responses: CommonJSONResponse(momentSchema),
});

app.openapi(route, async (c) => {
  const body = await c.req.parseBody<z.infer<typeof momentPostSchema>>({
    all: true,
  });

  const { content, attachments, bucketName = 'eleven' } = momentPostSchema
    .parse(body);

  const db = drizzle(c.env.DB);
  const momentResult = await db
    .insert(moment)
    .values({ content })
    .returning()
    .get();

  try {
    // TODO: transaction with rollback
    const r_attachments = [];

    if (Array.isArray(attachments)) {
      for (const attachment of attachments) {
        const uploaded = await uploadFile(c.env, {
          file: attachment,
          bucketName,
        });
        r_attachments.push(uploaded);
      }
    } else if (attachments instanceof File) {
      const uploaded = await uploadFile(c.env, {
        file: attachments,
        bucketName,
      });
      r_attachments.push(uploaded);
    }

    const toInsert = r_attachments.map((attachment) => ({
      momentId: momentResult.id,
      uploadId: attachment.id,
    }));

    await db
      .insert(momentsToUploads)
      .values(toInsert)
      .run();

    const result = {
      ...momentResult,
      attachments: r_attachments,
    };

    return c.json(result);
  } catch (e) {
    return c.json(
      {
        error: e.message,
      },
      500,
    );
  }
});
