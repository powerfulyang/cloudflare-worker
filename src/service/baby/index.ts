import route from '@/service/baby/baby.get'
import { OpenAPIHono } from '@hono/zod-openapi'

const BabyRoute = new OpenAPIHono<{
  Bindings: Bindings
}>()

BabyRoute.route('baby', route)

export default BabyRoute
