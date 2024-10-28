import { bucket } from '~drizzle/schema'
import { createSelectSchema } from 'drizzle-zod'

export const Bucket = createSelectSchema(bucket)
  .openapi('Bucket')
