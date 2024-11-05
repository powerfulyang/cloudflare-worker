import { getAppInstance, getDrizzleInstance } from '@/core'
import { JsonRequest } from '@/zodSchemas/JsonRequest'
import { JsonResponse } from '@/zodSchemas/JsonResponse'
import { MomentPost } from '@/zodSchemas/Moment'
import { createRoute, z } from '@hono/zod-openapi'
import { moment, momentsToUploads } from '~drizzle/schema/moment'
import { eq } from 'drizzle-orm'

const PostMoment = getAppInstance()

const route = createRoute({
  method: 'post',
  path: '',
  request: {
    body: JsonRequest(MomentPost),
  },
  responses: JsonResponse(z.boolean()),
})

PostMoment.openapi(route, async (c) => {
  const { content, attachments, type } = c.req.valid('json')
  const db = getDrizzleInstance()
  let momentResult: { id: number } | null = null

  try {
    // 首先插入 moment，并获取插入的 momentResult
    momentResult = await db
      .insert(moment)
      .values({ content, type })
      .returning()
      .get()

    // 准备插入 momentsToUploads 的数据
    const toInsert = attachments
      .map((attachment, index) => (
        {
          momentId: momentResult!.id,
          uploadId: attachment.id,
          sort: index,
        }
      ))

    // 尝试插入 attachments 数据
    await db.insert(momentsToUploads).values(toInsert).execute()
  }
  catch {
    // 如果 momentsToUploads 插入失败，删除之前插入的 moment
    if (momentResult) {
      await db.delete(moment).where(eq(moment.id, momentResult.id)).execute()
    }
  }

  return c.json(true)
})

export default PostMoment
