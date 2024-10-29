import { getAppInstance } from '@/core'
import GetBabyById from '@/routes/baby/baby.get'
import PatchBabyId from '@/routes/baby/baby.patch'
import PostBaby from '@/routes/baby/baby.post'

const BabyRoute = getAppInstance()

BabyRoute.route('', GetBabyById)
BabyRoute.route('', PatchBabyId)
BabyRoute.route('', PostBaby)

export default BabyRoute
