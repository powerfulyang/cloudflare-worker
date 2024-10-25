import type { AiTextGenerationInput } from '@cloudflare/workers-types'
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'

const AiRoute = new OpenAPIHono<{
  Bindings: Bindings
}>()

const textGenerationRoute = createRoute({
  method: 'post',
  path: '/text-generation',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            prompt: z.string(),
            messages: z.array(z.object({
              role: z.enum(['user', 'assistant']),
              content: z.string(),
            })).optional(),
            max_tokens: z.number().optional(),
            temperature: z.number().min(0).max(1).optional(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: z.object({
            response: z.string().optional(),
          }),
        },
      },
    },
  },
})

AiRoute.openapi(textGenerationRoute, async (c) => {
  const ai = c.env.AI
  const inputs: AiTextGenerationInput = c.req.valid('json')
  const response = await ai.run(
    '@hf/google/gemma-7b-it',
    inputs,
  )
  let msg
  if ('response' in response) {
    msg = response.response
  }
  return c.json({
    response: msg,
  })
})

export default AiRoute
