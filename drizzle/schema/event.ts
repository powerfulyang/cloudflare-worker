import { eq, relations } from 'drizzle-orm'
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

export const event = sqliteTable(
  'event',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull().unique(),
    displayName: text('display_name').notNull(),
    icon: text('icon').notNull(),
    extraFields: text('extra_fields', { mode: 'json' })
      .notNull()
      .$defaultFn(() => ([])),
    deleted: integer('deleted', { mode: 'boolean' }).notNull().default(false),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .notNull()
      .$onUpdateFn(() => new Date())
      .$defaultFn(() => new Date()),
  },
  (t) => {
    return {
      uniqueNotDeleted: uniqueIndex('unique_name_not_deleted')
        .on(t.name)
        .where(eq(t.deleted, false)),
    }
  },
)

export const eventLog = sqliteTable('event_log', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  eventName: text('event_name').notNull().references(() => event.name),
  comment: text('comment').notNull().default(''),
  extra: text('extra', { mode: 'json' })
    .notNull()
    .$defaultFn(() => ({})),
  eventTime: integer('event_time', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
  deleted: integer('deleted', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .$onUpdateFn(() => new Date())
    .$defaultFn(() => new Date()),
})

export const eventLogRelations = relations(eventLog, ({ one }) => {
  return {
    event: one(event, {
      fields: [eventLog.eventName],
      references: [event.name],
    }),
  }
})
