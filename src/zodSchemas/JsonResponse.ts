import { z } from '@hono/zod-openapi'

export const InternalServerErrorSchema = z
  .object({
    error: z
      .string()
      .openapi(
        {
          description: 'Error message',
          example: 'Internal Server Error',
        },
      ),
  })
  .openapi('InternalServerError')

export const InternalServerError = {
  description: 'Internal Server Error',
  content: {
    'application/json': {
      schema: InternalServerErrorSchema,
    },
  },
}

export function JsonResponse<T>(schema: T) {
  return {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema,
        },
      },
    },
    500: InternalServerError,
  }
}
