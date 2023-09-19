import { app } from '@/server';
import { compress } from '@/wasm/photon';
import { createRoute, z } from '@hono/zod-openapi';
import { stream } from 'hono/streaming';
import './gemini-pro';

const route = createRoute({
  path: '/api/hello/photon',
  method: 'post',
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
      description: 'OK',
    },
  },
});

app.openapi(route, async c => {
  const { file } = c.req.valid('form');
  const buffer = await file.arrayBuffer();
  const vec = new Uint8Array(buffer);
  const data = await compress(vec);
  if (!data) {
    throw new Error('compress error');
  }
  return stream(c, async (_) => {
    c.header('Content-Type', 'image/webp');
    await _.write(new Uint8Array(data));
    await _.close();
  });
});
