import { app } from '@/server';
import { compressImage } from '@/utils/compressImage';
import { createRoute, z } from '@hono/zod-openapi';
import { stream } from 'hono/streaming';

const route = createRoute({
  method: 'post',
  path: '/api/compress',
  request: {
    body: {
      required: true,
      content: {
        'multipart/form-data': {
          schema: z.object({
            file: z.instanceof(File),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Success',
    },
  },
});

app.openapi(route, async (c) => {
  const { file } = c.req.valid('form');
  const buffer = await compressImage(file);
  if (!buffer) {
    throw new Error('compress fail');
  }
  return stream(c, async (_) => {
    c.header('Content-Type', 'image/webp');
    await _.write(new Uint8Array(buffer));
    await _.close();
  });
});
