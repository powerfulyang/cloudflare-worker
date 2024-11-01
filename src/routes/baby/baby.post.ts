import { getAppInstance } from '@/core'
import { BabyPost } from '@/zodSchemas/Baby'
import { JsonRequest } from '@/zodSchemas/JsonRequest'
import { JsonResponse } from '@/zodSchemas/JsonResponse'
import { createRoute, z } from '@hono/zod-openapi'

const PostBaby = getAppInstance()

const route = createRoute({
  path: '',
  method: 'post',
  request: {
    body: JsonRequest(BabyPost),
  },
  responses: JsonResponse(z.boolean()),
})

PostBaby.openapi(route, async (c) => {
  const json = c.req.valid('json')

  const babyService = c.get('babyService')
  await babyService.create(json)

  return c.json(true)
})

export default PostBaby
