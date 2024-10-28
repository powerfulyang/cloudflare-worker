import { getAppInstance } from '@/utils'
import { Baby, BabyKey, BabyPatch } from '@/zodSchemas/Baby'
import { JsonRequest } from '@/zodSchemas/JsonRequest'
import { JsonResponse } from '@/zodSchemas/JsonResponse'
import { createRoute } from '@hono/zod-openapi'

const PatchBaby = getAppInstance()

const route = createRoute({
  path: ':id',
  method: 'patch',
  description: 'Update baby info by id',
  request: {
    params: BabyKey,
    body: JsonRequest(BabyPatch),
  },
  responses: JsonResponse(Baby),
})

PatchBaby.openapi(route, async (c) => {
  const { id } = c.req.valid('param')
  const json = c.req.valid('json')

  const babyService = c.get('babyService')
  const result = await babyService.updateById(id, json)

  return c.json(result)
})

export default PatchBaby
