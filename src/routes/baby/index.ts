import { getAppInstance } from '@/core'
import GetBabyById from '@/routes/baby/baby.get'

const BabyRoute = getAppInstance()

BabyRoute.route('', GetBabyById)

export default BabyRoute
