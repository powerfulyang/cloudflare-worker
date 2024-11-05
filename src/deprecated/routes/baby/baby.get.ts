import { getAppInstance } from '@/core'
import { BabyKey, BabyResult } from '@/zodSchemas/Baby'
import { JsonResponse } from '@/zodSchemas/JsonResponse'
import { createRoute } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'

const GetBabyById = getAppInstance()

const route = createRoute({
  path: ':id',
  method: 'get',
  description: 'Get baby info by id',
  request: {
    params: BabyKey,
  },
  responses: JsonResponse(BabyResult),
})

GetBabyById.openapi(route, async (c) => {
  const { id } = c.req.valid('param')
  const babyService = c.get('babyService')
  const result = await babyService.getById(id)

  if (!result) {
    throw new HTTPException(404, {
      message: 'Baby not found',
    })
  }

  return c.json(result)
})

export default GetBabyById
