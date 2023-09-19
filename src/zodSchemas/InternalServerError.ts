import { z } from '@hono/zod-openapi';

export const InternalServerErrorSchema = z.object({
  error: z.string().openapi({
    description: 'Error message',
    example: 'Internal Server Error',
  }),
}).openapi('InternalServerError');

export const InternalServerError = {
  description: 'Internal Server Error',
  content: {
    'application/json': {
      schema: InternalServerErrorSchema,
    },
  },
};
