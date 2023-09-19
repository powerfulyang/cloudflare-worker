import { app, Bindings, isLocalDev } from '@/server';
import { bucketSchema } from '@/service/r2/bucket.get';
import { compressImage } from '@/utils/compressImage';
import { CommonJSONResponse } from '@/zodSchemas/CommonJSONResponse';
import { createRoute, z } from '@hono/zod-openapi';
import { drizzle } from 'drizzle-orm/d1';
import { sha1 } from 'hono/utils/crypto';
import { bucket, upload } from '~drizzle/schema/upload';

export const uploadSchema = z.object({
  id: z.number().int().positive(),
  hash: z.string(),
  thumbnailHash: z.string(),
  bucketName: z.string(),
  bucket: bucketSchema,
  mediaType: z.string(),
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
            bucketName: z.string().optional(),
          }),
        },
      },
    },
  },
  responses: CommonJSONResponse(uploadSchema),
});

export const uploadFile = async (env: Bindings, options: {
  file: File;
  bucketName?: string;
}) => {
  const defaultBucketName = isLocalDev(env) ? 'test' : 'eleven';
  const { file, bucketName = defaultBucketName } = options;
  const hash = (await sha1(file.stream()))!;

  const compressed = await compressImage(file);
  let thumbnailHash = '';

  if (compressed) {
    thumbnailHash = (await sha1(compressed))!;
    const thumbnailUploaded = await env.MY_BUCKET.put(
      thumbnailHash,
      compressed,
    );
    if (!thumbnailUploaded) {
      throw new Error('Upload thumbnail failed');
    }
  }

  const uploaded = await env.MY_BUCKET.put(hash, file.stream());
  if (!uploaded) {
    throw new Error('Upload failed');
  }

  const db = drizzle(env.DB);
  const mediaType = file.type;

  // TODO: check if file already exists
  const result = await db
    .insert(upload)
    .values({ hash, bucketName, mediaType, thumbnailHash })
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

  const result = await uploadFile(c.env, {
    file,
    bucketName,
  });

  return c.json(result);
});
