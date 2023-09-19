import { InternalServerError } from '@/zodSchemas/InternalServerError';

export const CommonJSONResponse = <T>(schema: T) => {
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
  };
};
