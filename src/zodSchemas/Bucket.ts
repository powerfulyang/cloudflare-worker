import { bucket } from '~drizzle/schema'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const BucketResult = createSelectSchema(bucket)
  .openapi('BucketResult')

export const BucketPost = createInsertSchema(bucket)
  .openapi('BucketPost')
