import { getAppInstance } from '@/core'
import { BabyKey, BabyPatch } from '@/zodSchemas/Baby'
import { JsonRequest } from '@/zodSchemas/JsonRequest'
import { JsonResponse } from '@/zodSchemas/JsonResponse'
import { createRoute, z } from '@hono/zod-openapi'

const PatchBabyId = getAppInstance()

const route = createRoute({
  path: ':id',
  method: 'patch',
  description: 'Update baby info by id',
  request: {
    params: BabyKey,
    body: JsonRequest(BabyPatch),
  },
  responses: JsonResponse(z.boolean()),
})

PatchBabyId.openapi(route, async (c) => {
  const { id } = c.req.valid('param')
  const json = c.req.valid('json')

  const babyService = c.get('babyService')
  await babyService.updateById(id, json)

  return c.json(true)
})

export default PatchBabyId
