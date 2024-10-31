import { getAppInstance } from '@/core'
import DeleteMoment from '@/routes/moment/moment.delete'
import QueryMoment from '@/routes/moment/moment.get'
import PostMoment from '@/routes/moment/moment.post'
import PutMoment from '@/routes/moment/moment.put'

const MomentRoute = getAppInstance()

MomentRoute.route('', QueryMoment)
MomentRoute.route('', PostMoment)
MomentRoute.route('', PutMoment)
MomentRoute.route('', DeleteMoment)

export default MomentRoute
