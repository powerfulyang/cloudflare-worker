import { EventSchema } from '@/service/event/schemas/event';
import { z } from '@hono/zod-openapi';

export const EventLogSchema = z.object(
  {
    id: z.number().int().positive(),
    eventName: z.string(),
    comment: z.string().optional(),
    extra: z.record(z.any()).optional().default({}),
    eventTime: z
      .string()
      .optional()
      .openapi({
        format: 'date-time',
      }),
    createdAt: z
      .string()
      .openapi({
        format: 'date-time',
      }),
    updatedAt: z
      .string()
      .openapi({
        format: 'date-time',
      }),
  },
)
  .openapi('EventLog');

export const EventLogResultSchema = z.object(
  {
    event: EventSchema,
  },
)
  .merge(EventLogSchema)
  .openapi('EventLogResult');
