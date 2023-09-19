import { app } from '@/server';
import { createRoute, z } from '@hono/zod-openapi';

const route = createRoute({
  path: '/api/hello/gemini-pro',
  method: 'post',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: z.object({
            contents: z.array(z.object({
              parts: z.array(z.object({
                text: z.string(),
              })),
            })),
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

/**
 * curl \
 *   -H 'Content-Type: application/json' \
 *   -d '{"contents":[{"parts":[{"text":"Write a story about a magic backpack"}]}]}' \
 *   -X POST https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY
 */
app.openapi(route, async c => {
  const json = c.req.valid('json');
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${c.env.GEMINI_PRO_API_KEY}`,
    {
      method: 'POST',
      body: JSON.stringify(json),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  const result: any = await res.json();
  return c.json({
    result: result.candidates[0].content.parts[0].text,
  });
});
