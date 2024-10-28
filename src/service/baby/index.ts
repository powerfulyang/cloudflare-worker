import GetBabyById from '@/service/baby/baby.get'
import PatchBaby from '@/service/baby/baby.patch'
import PostBaby from '@/service/baby/baby.post'
import { OpenAPIHono } from '@hono/zod-openapi'

const BabyRoute = new OpenAPIHono<{
  Bindings: Bindings
}>()

BabyRoute.route('', GetBabyById)
BabyRoute.route('', PatchBaby)
BabyRoute.route('', PostBaby)

export default BabyRoute
