import { Bucket } from '@/zodSchemas/Bucket'
import { upload } from '~drizzle/schema'
import { createSelectSchema } from 'drizzle-zod'

export const Upload = createSelectSchema(upload)
  .extend({
    bucket: Bucket,
  })
  .openapi('Upload')
