import { getAppInstance } from '@/core'
import { Baby, BabyKey } from '@/zodSchemas/Baby'
import { JsonResponse } from '@/zodSchemas/JsonResponse'
import { createRoute } from '@hono/zod-openapi'

const GetBabyById = getAppInstance()

const route = createRoute({
  path: ':id',
  method: 'get',
  description: 'Get baby info by id',
  request: {
    params: BabyKey,
  },
  responses: JsonResponse(Baby),
})

GetBabyById.openapi(route, async (c) => {
  const { id } = c.req.valid('param')
  const babyService = c.get('babyService')
  const result = await babyService.getById(id)

  return c.json(result)
})

export default GetBabyById
