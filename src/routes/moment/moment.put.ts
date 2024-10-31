import { getAppInstance, getDrizzleInstance } from '@/core'
import { JsonRequest } from '@/zodSchemas/JsonRequest'
import { JsonResponse } from '@/zodSchemas/JsonResponse'
import { MomentKey, MomentPut } from '@/zodSchemas/Moment'
import { createRoute, z } from '@hono/zod-openapi'
import { moment, momentsToUploads } from '~drizzle/schema/moment'
import { eq } from 'drizzle-orm'

const PutMoment = getAppInstance()

const route = createRoute({
  method: 'put',
  path: ':id',
  request: {
    params: MomentKey,
    body: JsonRequest(MomentPut),
  },
  responses: JsonResponse(z.boolean()),
})

PutMoment.openapi(route, async (c) => {
  const { id } = c.req.valid('param')
  const { content, attachments } = c.req.valid('json')
  const db = getDrizzleInstance(c.env.DB)

  const momentResult = await db
    .update(moment)
    .set({ content })
    .where(eq(moment.id, id))
    .returning()
    .get()

  // delete all momentsToUploads where momentId = id
  await db
    .update(momentsToUploads)
    .set({ deleted: 1 })
    .where(eq(momentsToUploads.momentId, id))

  if (attachments?.length) {
    const toInsert = attachments
      .map((attachment, index) => ({
        momentId: momentResult.id,
        uploadId: attachment.id,
        order: index,
      }))
    // 尝试插入 attachments 数据
    await db.insert(momentsToUploads).values(toInsert).execute()
  }

  return c.json(true)
})

export default PutMoment
