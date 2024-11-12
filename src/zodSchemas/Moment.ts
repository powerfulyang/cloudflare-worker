import { MomentOptionalDefaultsSchema, MomentSchema } from '#/prisma/zod'
import { UploadResult } from '@/zodSchemas/Upload'
import { z } from '@hono/zod-openapi'

export const Moment = MomentSchema
  .extend({
    attachments: z.array(
      z.object({
        upload: UploadResult,
      }),
    ),
  })
  .openapi('Moment')

export const MomentPost = MomentOptionalDefaultsSchema
  .extend({
    attachments: z.array(
      z.object({
        id: z.number().int().positive(),
      }),
    ).optional().default([]),
  })
  .openapi('MomentPost')

export const MomentPut = MomentOptionalDefaultsSchema
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
