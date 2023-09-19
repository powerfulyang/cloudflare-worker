CREATE TABLE `moment` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `moments_to_uploads` (
	`moment_id` integer NOT NULL,
	`upload_id` integer NOT NULL,
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
CREATE TABLE `upload` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`hash` text NOT NULL,
	`bucket_name` text NOT NULL,
	`media_type` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`bucket_name`) REFERENCES `bucket`(`name`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bucket_name_unique` ON `bucket` (`name`);