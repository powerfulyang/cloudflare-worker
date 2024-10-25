CREATE TABLE `baby` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`born_at` text NOT NULL,
	`gender` integer DEFAULT 0 NOT NULL,
	`avatar` integer NOT NULL,
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
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `event_name_unique` ON `event` (`name`);--> statement-breakpoint
CREATE TABLE `event_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_name` text NOT NULL,
	`comment` text DEFAULT '' NOT NULL,
	`extra` text NOT NULL,
	`event_time` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`event_name`) REFERENCES `event`(`name`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `moment` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text DEFAULT 'moment' NOT NULL,
	`content` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `moments_to_uploads` (
	`moment_id` integer NOT NULL,
	`upload_id` integer NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`moment_id`, `upload_id`),
	FOREIGN KEY (`moment_id`) REFERENCES `moment`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`upload_id`) REFERENCES `upload`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `bucket` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`domain` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bucket_name_unique` ON `bucket` (`name`);--> statement-breakpoint
CREATE TABLE `upload` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`hash` text NOT NULL,
	`thumbnail_hash` text DEFAULT '' NOT NULL,
	`bucket_name` text NOT NULL,
	`media_type` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`bucket_name`) REFERENCES `bucket`(`name`) ON UPDATE no action ON DELETE no action
);
