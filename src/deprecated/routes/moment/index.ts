import { getAppInstance } from '@/core'
import DeleteMoment from '@/v1/routes/moment/moment.delete'
import QueryMoment from '@/v1/routes/moment/moment.get'
import PostMoment from '@/v1/routes/moment/moment.post'
import PutMoment from '@/v1/routes/moment/moment.put'

const MomentRoute = getAppInstance()

MomentRoute.route('', QueryMoment)
MomentRoute.route('', PostMoment)
MomentRoute.route('', PutMoment)
MomentRoute.route('', DeleteMoment)

export default MomentRoute
