import { upload } from '~drizzle/schema/upload'
import { eq, relations, sql } from 'drizzle-orm'
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

export const moment = sqliteTable('moment', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type').default('moment').notNull(),
  content: text('content').default('').notNull(),
  deleted: integer('deleted', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .$onUpdateFn(() => new Date())
    .$defaultFn(() => new Date()),
})

export const momentsToUploads = sqliteTable(
  'moments_to_uploads',
  {
    momentId: integer('moment_id').notNull().references(() => moment.id),
    uploadId: integer('upload_id').notNull().references(() => upload.id),
    sort: integer('sort').notNull().default(0),
    deleted: integer('deleted', { mode: 'boolean' }).notNull().default(false),
  },
  (t) => {
    return {
      uniqueNotDeleted: uniqueIndex('unique_moment_upload')
        .on(t.momentId, t.uploadId)
        .where(eq(t.deleted, sql`false`)),
    }
  },
)

export const momentRelations = relations(moment, ({ many }) => {
  return {
    attachments: many(momentsToUploads),
  }
})

export const momentsToUploadsRelations = relations(momentsToUploads, ({ one }) => {
  return {
    moment: one(moment, {
      fields: [momentsToUploads.momentId],
      references: [moment.id],
    }),
    upload: one(upload, {
      fields: [momentsToUploads.uploadId],
      references: [upload.id],
    }),
  }
})
