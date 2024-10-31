import { getAppInstance, getDrizzleInstance } from '@/core'
import { Event } from '@/zodSchemas/Event'
import { JsonResponse } from '@/zodSchemas/JsonResponse'
import { createRoute, z } from '@hono/zod-openapi'

const GetEvent = getAppInstance()

const route = createRoute({
  method: 'get',
  path: '',
  responses: JsonResponse(z.array(Event)),
})

GetEvent.openapi(route, async (c) => {
  const db = getDrizzleInstance(c.env.DB)

  const result = await db
    .query
    .event
    .findMany()

  return c.json(result)
})

export default GetEvent
