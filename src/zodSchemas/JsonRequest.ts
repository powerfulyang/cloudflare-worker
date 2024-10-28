export function JsonRequest<T>(schema: T) {
  return {
    content: {
      'application/json': {
        schema,
      },
    },
  }
}
