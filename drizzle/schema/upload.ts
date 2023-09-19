import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { moment } from '~drizzle/schema/moment';

export const bucket = sqliteTable('bucket', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull().unique(),
	domain: text('domain').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const upload = sqliteTable('upload', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	hash: text('hash').notNull(),
	thumbnailHash: text('thumbnail_hash').notNull().default(''),
	bucketName: text('bucket_name').notNull().references(() => bucket.name),
	mediaType: text('media_type').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const uploadRelations = relations(upload, ({ one,many }) => {
	return {
		bucket: one(bucket),
		moments: many(moment)
	};
});
