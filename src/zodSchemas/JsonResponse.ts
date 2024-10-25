import { InternalServerError } from '@/zodSchemas/InternalServerError'

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
