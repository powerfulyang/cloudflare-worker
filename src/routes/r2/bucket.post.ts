import { getAppInstance, getDrizzleInstance } from '@/core'
import { Bucket, BucketPost } from '@/zodSchemas/Bucket'
import { JsonRequest } from '@/zodSchemas/JsonRequest'
import { JsonResponse } from '@/zodSchemas/JsonResponse'
import { createRoute } from '@hono/zod-openapi'
import { bucket } from '~drizzle/schema/upload'

const PostBucket = getAppInstance()

const route = createRoute({
  method: 'post',
  path: '',
  request: {
    body: JsonRequest(BucketPost),
  },
  responses: JsonResponse(Bucket),
})

PostBucket.openapi(route, async (c) => {
  const { name, domain } = c.req.valid('json')
  const db = getDrizzleInstance(c.env.DB)

  const result = await db
    .insert(bucket)
    .values({ name, domain })
    .returning()
    .get()

  return c.json(result)
})

export default PostBucket
