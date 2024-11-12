import { UploadSchema } from '#/prisma/zod'

export const UploadResult = UploadSchema
  .openapi('UploadResult')
