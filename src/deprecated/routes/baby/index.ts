import { getAppInstance } from '@/core'
import GetBabyById from '@/v1/routes/baby/baby.get'
import PatchBabyId from '@/v1/routes/baby/baby.patch'
import PostBaby from '@/v1/routes/baby/baby.post'

const BabyRoute = getAppInstance()

BabyRoute.route('', GetBabyById)
BabyRoute.route('', PatchBabyId)
BabyRoute.route('', PostBaby)

export default BabyRoute
