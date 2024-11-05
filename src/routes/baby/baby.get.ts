import { getAppInstance, getPrismaInstance } from '@/core'
import { BabyKey, BabyResult } from '@/zodSchemas/Baby'
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
  responses: JsonResponse(BabyResult),
})

GetBabyById.openapi(route, async (c) => {
  const { id } = c.req.valid('param')
  const prisma = getPrismaInstance()

  const result = await prisma.baby.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      user: true,
      avatar: {
        include: {
          bucket: true,
        },
      },
    },
  })

  return c.json(result)
})

export default GetBabyById
