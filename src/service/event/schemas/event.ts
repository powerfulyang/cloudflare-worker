import { z } from '@hono/zod-openapi';

export const EventExtraFieldsSchema = z.array(
  z.object(
    {
      name: z.string(),
      displayName: z.string(),
      type: z
        .enum(
          ['text', 'number', 'time', 'radio', 'checkbox', 'picker'],
        ),
      enums: z
        .array(z.string())
        .optional(),
      userInput: z
        .boolean()
        .optional()
        .default(true),
      required: z
        .boolean()
        .optional()
        .default(true),
      defaultValue: z
        .string()
        .optional(),
      cascade: z
        .object({
          fieldName: z.string(),
          fieldValue: z.string(),
        })
        .optional(),
    },
  ),
)
  .optional()
  .default([])
  .openapi('EventExtraFields');

export const EventSchema = z.object(
  {
    id: z
      .number()
      .int()
      .positive(),
    name: z.string(),
    displayName: z.string(),
    icon: z.string(),
    extraFields: EventExtraFieldsSchema,
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
  .openapi('Event');
