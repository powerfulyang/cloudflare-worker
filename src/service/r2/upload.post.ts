import { app, Bindings } from '@/server';
import { bucketSchema } from '@/service/r2/bucket.get';
import { sha1 } from '@/utils/sha1';
import { CommonJSONResponse } from '@/zodSchemas/CommonJSONResponse';
import { createRoute, z } from '@hono/zod-openapi';
import { drizzle } from 'drizzle-orm/d1';
import { bucket, upload } from '~drizzle/schema/upload';

export const uploadSchema = z.object({
  id: z.number().int().positive(),
  hash: z.string(),
  bucketName: z.string(),
  bucket: bucketSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

const route = createRoute({
  method: 'post',
  path: '/api/upload',
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: z.object({
            file: z.instanceof(File),
            bucketName: z.string().optional().default('eleven'),
          }),
        },
      },
    },
  },
  responses: CommonJSONResponse(uploadSchema),
});

export const uploadFile = async (env: Bindings, options: {
  file: File;
  bucketName: string;
}) => {
  const { file, bucketName } = options;
  const hash = await sha1(file);
  const uploaded = await env.MY_BUCKET.put(hash, file.stream());

  if (!uploaded) {
    throw new Error('Upload failed');
  }

  const db = drizzle(env.DB);
  const mediaType = file.type;
  // TODO: check if file already exists
  const result = await db
    .insert(upload)
    .values({ hash, bucketName, mediaType })
    .returning()
    .get();

  const buckets = await db
    .select()
    .from(bucket)
    .all();

  return {
    ...result,
    bucket: buckets.find((b) => b.name === result.bucketName)!,
  };
};

app.openapi(route, async (c) => {
  const form = c.req.valid('form');
  const file = form.file;
  const bucketName = form.bucketName;

  try {
    const result = await uploadFile(c.env, {
      file,
      bucketName,
    });

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
