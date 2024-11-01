import { BucketResult } from '@/zodSchemas/Bucket'
import { upload } from '~drizzle/schema'
import { createSelectSchema } from 'drizzle-zod'

export const UploadResult = createSelectSchema(upload)
  .extend({
    bucket: BucketResult,
  })
  .openapi('UploadResult')
