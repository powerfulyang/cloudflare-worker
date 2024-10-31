import { eq, relations } from 'drizzle-orm'
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

export const bucket = sqliteTable(
  'bucket',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    domain: text('domain').notNull(),
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

export const upload = sqliteTable('upload', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  hash: text('hash').notNull(),
  thumbnailHash: text('thumbnail_hash').notNull().default(''),
  bucketName: text('bucket_name').notNull().references(() => bucket.name),
  mediaType: text('media_type').notNull(),
  deleted: integer('deleted', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .$onUpdateFn(() => new Date())
    .$defaultFn(() => new Date()),
})

export const uploadBucket = relations(upload, ({ one }) => {
  return {
    bucket: one(bucket, {
      fields: [upload.bucketName],
      references: [bucket.name],
    }),
  }
})
