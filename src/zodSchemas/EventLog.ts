import { Event } from '@/zodSchemas/Event'
import { z } from '@hono/zod-openapi'
import { eventLog } from '~drizzle/schema/event'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const EventLog = createSelectSchema(eventLog)
  .openapi('EventLog')

export const EventLogResult = EventLog
  .extend({
    event: Event,
  })
  .openapi('EventLogResult')

export const EventLogPost = createInsertSchema(eventLog)
  .pick({
    eventName: true,
    comment: true,
    eventTime: true,
  })
  .openapi('EventLogPost')

export const EventLogPatch = EventLog
  .pick({
    comment: true,
    extra: true,
    eventTime: true,
  })
  .partial({
    comment: true,
    extra: true,
    eventTime: true,
  })
  .openapi('EventLogPatch')

export const EventLogKey = z
  .object(
    {
      id: z.coerce.number().int().positive().openapi(
        {
          description: 'The id of the event log to get',
          param: {
            in: 'path',
          },
        },
      ),
    },
  )
  .openapi('EventLogKey')
