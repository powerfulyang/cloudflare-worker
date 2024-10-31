import { getAppInstance } from '@/core'
import GetEvent from '@/routes/event/event.get'
import PatchEvent from '@/routes/event/event.patch'
import PostEvent from '@/routes/event/event.post'
import DeleteEventLog from '@/routes/event/event-log.delete'
import GetEventLogDistinct from '@/routes/event/event-log.distinct.get'
import QueryEventLog from '@/routes/event/event-log.get'
import PatchEventLog from '@/routes/event/event-log.patch'
import PostEventLog from '@/routes/event/event-log.post'

const EventRoute = getAppInstance()

// Event Log routes
EventRoute.route('log', DeleteEventLog)
EventRoute.route('log/distinct', GetEventLogDistinct)
EventRoute.route('log', QueryEventLog)
EventRoute.route('log', PatchEventLog)
EventRoute.route('log', PostEventLog)

// Event routes
EventRoute.route('', GetEvent)
EventRoute.route('', PatchEvent)
EventRoute.route('', PostEvent)

export default EventRoute
