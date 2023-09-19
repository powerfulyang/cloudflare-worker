import { EventExtraFieldsSchema } from '@/service/event/schemas/event';
import { z } from '@hono/zod-openapi';
import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const event = sqliteTable('event', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull().unique(),
	displayName: text('display_name').notNull(),
	icon: text('icon').notNull(),
	extraFields: text('extra_fields', { mode: 'json' })
		.notNull()
		.$defaultFn(() => ([]))
		.$type<z.infer<typeof EventExtraFieldsSchema>>(),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const eventLog = sqliteTable('event_log', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	eventName: text('event_name').notNull().references(() => event.name),
	comment: text('comment').notNull().default(''),
	extra: text('extra', { mode: 'json' })
		.notNull()
		.$defaultFn(() => ({}))
		.$type<Record<string, any>>(),
	eventTime: integer('event_time', { mode: 'timestamp_ms' })
		.notNull()
		.$defaultFn(() => new Date()),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const eventLogRelations = relations(eventLog, ({ one }) => {
	return {
		event: one(event)
	};
});
