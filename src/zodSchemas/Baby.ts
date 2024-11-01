import { UploadResult } from '@/zodSchemas/Upload'
import { z } from '@hono/zod-openapi'
import { baby } from '~drizzle/schema'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const BabyResult = createSelectSchema(baby)
  .extend(
    {
      avatar: UploadResult.nullable(),
    },
  )
  .openapi('BabyResult')

export const BabyPatch = createInsertSchema(baby)
  .partial()
  .openapi('BabyPatch')

export const BabyPost = createInsertSchema(baby)
  .openapi('BabyPost')

export const BabyKey = z
  .object(
    {
      id: z.coerce.number().int().positive().openapi(
        {
          description: 'The id of the baby to get',
          param: {
            in: 'path',
          },
        },
      ),
    },
  )
  .openapi('BabyKey')
