import { BabyOptionalDefaultsSchema, BabyPartialSchema, BabySchema, UserSchema } from '#/prisma/zod'
import { UploadResult } from '@/zodSchemas/Upload'
import { z } from '@hono/zod-openapi'

export const BabyResult = BabySchema
  .extend(
    {
      avatar: UploadResult.nullable(),
      user: UserSchema,
    },
  )
  .openapi('BabyResult')

export const BabyPatch = BabyPartialSchema
  .openapi('BabyPatch')

export const BabyPost = BabyOptionalDefaultsSchema
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
