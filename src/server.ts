import { isBlockIP } from '@/utils/isBlockIP';
import { OpenAPIHono, z } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { fromZodError } from 'zod-validation-error';

export type Bindings = {
  DB: D1Database;
  AI: any;
  ALLOW_IPS: string;
  MY_BUCKET: R2Bucket;
  ENVIRONMENT: 'development' | undefined;
};

const app = new OpenAPIHono<{ Bindings: Bindings }>({
  defaultHook: (result, c) => {
    if (!result.success && result.error.name === 'ZodError') {
      return c.json(
        {
          ok: false,
          error: fromZodError(result.error).toString(),
          source: 'custom_error_handler',
        },
        422,
      );
    }
  },
});

app.use(
  '*',
  cors({
    origin: 'https://littleeleven.com',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    exposeHeaders: ['authorization'],
    allowHeaders: ['authorization', 'content-type'],
    maxAge: 86400,
  }),
);

app.use('*', logger());

app.use('*', async (ctx, next) => {
  const ip = ctx.req.header('cf-connecting-ip');
  const method = ctx.req.method;
  const isLocal = ctx.env.ENVIRONMENT === 'development';
  if (!isLocal && isBlockIP(ip, ctx.env.ALLOW_IPS) && method !== 'GET') {
    return ctx.json({ error: 'Not allowed' }, 403);
  }
  await next();
});

export { app };
