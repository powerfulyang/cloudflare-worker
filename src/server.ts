import { protectedRoutes } from '@/constants';
import { isBlockIP } from '@/utils/isBlockIP';
import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { fromZodError } from 'zod-validation-error';

export type Bindings = {
  DB: D1Database;
  AI: any;
  ALLOW_IPS: string;
  MY_BUCKET: R2Bucket;
  ENVIRONMENT: 'development' | undefined;
  GEMINI_PRO_API_KEY: string;
};

const app = new OpenAPIHono<{
  Bindings: Bindings;
  Variables: {
    bucketName: 'eleven' | 'test';
  };
}>({
  defaultHook: (result, c) => {
    if (!result.success) {
      if (result.error.name === 'ZodError') {
        return c.json(
          {
            error: fromZodError(result.error).toString(),
            source: 'zod_error_handler',
          },
          422,
        );
      }
    }
  },
});

app.use(
  '*',
  cors({
    origin: (origin) => {
      if (origin.endsWith('.littleeleven.com')) {
        return origin;
      }
      return 'https://littleeleven.com';
    },
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    exposeHeaders: ['authorization'],
    allowHeaders: ['authorization', 'content-type'],
    maxAge: 86400,
  }),
);

app.use('*', logger());

export const isLocalDev = (env: Bindings) => env.ENVIRONMENT === 'development';

app.use('*', async (ctx, next) => {
  const ip = ctx.req.header('cf-connecting-ip');
  const method = ctx.req.method;
  const isLocal = isLocalDev(ctx.env);
  if (!isLocal && isBlockIP(ip, ctx.env.ALLOW_IPS) && method !== 'GET') {
    return ctx.json({ error: 'Not allowed' }, 403);
  }
  await next();
});

app.use('*', async (ctx, next) => {
  const ip = ctx.req.header('cf-connecting-ip');
  const method = ctx.req.method;
  const path = ctx.req.path;
  const isLocal = isLocalDev(ctx.env);
  const isProtected = protectedRoutes.some((route) => {
    return route.method === method && route.path === path;
  });
  if (!isLocal && isBlockIP(ip, ctx.env.ALLOW_IPS) && isProtected) {
    return ctx.json({ error: 'Not allowed' }, 403);
  }
  await next();
});

app.onError((error, ctx) => {
  return ctx.json(
    {
      error: error.message,
      source: 'error_handler',
    },
    500,
  );
});

export { app };
