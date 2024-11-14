import { getAppInstance } from '@/core'
import { JsonResponse } from '@/zodSchemas/JsonResponse'
import { UserResult } from '@/zodSchemas/User'
import { createRoute } from '@hono/zod-openapi'

const GetCurrentUser = getAppInstance()

const route = createRoute({
  path: '/current',
  method: 'get',
  description: 'Get current user',
  responses: JsonResponse(UserResult),
})

GetCurrentUser.openapi(route, async (c) => {
  const user = c.get('user')

  return c.json(user)
})

export default GetCurrentUser
