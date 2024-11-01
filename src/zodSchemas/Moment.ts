import { UploadResult } from '@/zodSchemas/Upload'
import { z } from '@hono/zod-openapi'
import { moment } from '~drizzle/schema/moment'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const Moment = createSelectSchema(moment)
  .extend({
    attachments: z.array(
      z.object({
        upload: UploadResult,
      }),
    ),
  })
  .openapi('Moment')

export const MomentPost = createInsertSchema(moment)
  .extend({
    attachments: z.array(
      z.object({
        id: z.number().int().positive(),
      }),
    ).optional().default([]),
  })
  .openapi('MomentPost')

export const MomentPut = createInsertSchema(moment)
  .pick({ content: true })
  .extend({
    attachments: z.array(
      z.object({
        id: z.number().int().positive(),
      }),
    ).optional().default([]),
  })
  .openapi('MomentPut')

export const MomentKey = z
  .object({
    id: z.coerce.number().int().positive().openapi({
      description: 'The id of the moment',
      param: {
        in: 'path',
      },
    }),
  })
  .openapi('MomentKey')
