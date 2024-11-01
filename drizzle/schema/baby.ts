import { upload } from '~drizzle/schema/upload'
import { relations } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const baby = sqliteTable('baby', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  bornAt: text('born_at').notNull(),
  // 0 is girl, 1 is boy
  gender: integer('gender').default(0).notNull(),
  avatar: integer('avatar').references(() => upload.id),
  deleted: integer('deleted', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .$onUpdateFn(() => new Date())
    .$defaultFn(() => new Date()),
})

export const babyAvatar = relations(baby, ({ one }) => {
  return {
    avatar: one(upload, {
      fields: [baby.avatar],
      references: [upload.id],
    }),
  }
})
