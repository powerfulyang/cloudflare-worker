import { momentSchema } from '@/service/moment/moment.post'
import { uploadSchema } from '@/service/r2/upload.post'
import { JsonResponse } from '@/zodSchemas/JsonResponse'
import { createRoute, z } from '@hono/zod-openapi'
import { moment, momentsToUploads } from '~drizzle/schema/moment'
import { upload } from '~drizzle/schema/upload'
import { asc, eq, inArray } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'

const momentPutSchema = momentSchema
  .pick({ content: true, id: true })
  .merge(
    z.object({
      attachments: z
        .array(uploadSchema.pick({ id: true }))
        .optional()
        .default([]),
    }),
  )
  .openapi('MomentPutRequest')

const route = createRoute({
  method: 'put',
  path: '/api/moment',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: momentPutSchema,
        },
      },
    },
  },
  responses: JsonResponse(momentSchema),
})

appServer.openapi(route, async (c) => {
  const { content, attachments, id } = c.req.valid('json')

  const db = drizzle(c.env.DB)
  const momentResult = await db
    .update(moment)
    .set({ content })
    .where(eq(moment.id, id))
    .returning()
    .get()

  // TODO: transaction with rollback

  const toInsert = attachments.map((attachment, index) => ({
    momentId: momentResult.id,
    uploadId: attachment.id,
    order: index,
  }))

  const result: any = momentResult

  // delete all momentsToUploads where momentId = id
  await db
    .delete(momentsToUploads)
    .where(eq(momentsToUploads.momentId, id))

  if (toInsert.length) {
    await db
      .insert(momentsToUploads)
      .values(toInsert)
      .execute()

    const res = await db
      .select()
      .from(upload)
      .leftJoin(momentsToUploads, eq(upload.id, momentsToUploads.uploadId))
      .orderBy(asc(momentsToUploads.order))
      .where(inArray(upload.id, attachments.map(a => a.id)))
      .all()

    result.attachments = res.map(r => r.upload)
  }

  return c.json(result)
})
