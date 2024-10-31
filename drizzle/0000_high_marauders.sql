CREATE TABLE `baby` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`born_at` text NOT NULL,
	`gender` integer DEFAULT 0 NOT NULL,
	`avatar` integer DEFAULT 1 NOT NULL,
	`deleted` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`avatar`) REFERENCES `upload`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `event` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`display_name` text NOT NULL,
	`icon` text NOT NULL,
	`extra_fields` text NOT NULL,
	`deleted` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_event_name_not_deleted` ON `event` (`name`) WHERE "event"."deleted" = false;--> statement-breakpoint
CREATE TABLE `event_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_name` text NOT NULL,
	`comment` text DEFAULT '' NOT NULL,
	`extra` text NOT NULL,
	`event_time` integer NOT NULL,
	`deleted` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`event_name`) REFERENCES `event`(`name`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `moment` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text DEFAULT 'moment' NOT NULL,
	`content` text DEFAULT '' NOT NULL,
	`deleted` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `moments_to_uploads` (
	`moment_id` integer NOT NULL,
	`upload_id` integer NOT NULL,
	`sort` integer DEFAULT 0 NOT NULL,
	`deleted` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`moment_id`) REFERENCES `moment`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`upload_id`) REFERENCES `upload`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_moment_upload` ON `moments_to_uploads` (`moment_id`,`upload_id`) WHERE "moments_to_uploads"."deleted" = false;--> statement-breakpoint
CREATE TABLE `bucket` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`domain` text NOT NULL,
	`deleted` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_bucket_name_not_deleted` ON `bucket` (`name`) WHERE "bucket"."deleted" = false;--> statement-breakpoint
CREATE TABLE `upload` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`hash` text NOT NULL,
	`thumbnail_hash` text DEFAULT '' NOT NULL,
	`bucket_name` text NOT NULL,
	`media_type` text NOT NULL,
	`deleted` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`bucket_name`) REFERENCES `bucket`(`name`) ON UPDATE no action ON DELETE no action
);
