import { bucket } from '~drizzle/schema'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const Bucket = createSelectSchema(bucket)
  .openapi('Bucket')

export const BucketPost = createInsertSchema(bucket)
  .openapi('BucketPost')
