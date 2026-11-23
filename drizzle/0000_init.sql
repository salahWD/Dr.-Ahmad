CREATE TABLE `articles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`image` text DEFAULT '' NOT NULL,
	`category_ar` text DEFAULT '' NOT NULL,
	`category_en` text DEFAULT '' NOT NULL,
	`title_ar` text NOT NULL,
	`title_en` text DEFAULT '' NOT NULL,
	`intro_ar` text DEFAULT '' NOT NULL,
	`intro_en` text DEFAULT '' NOT NULL,
	`body_ar` text DEFAULT '' NOT NULL,
	`body_en` text DEFAULT '' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `articles_slug_unique` ON `articles` (`slug`);--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`time` text NOT NULL,
	`duration` integer NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`service_id` integer,
	`service_label` text DEFAULT '' NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`locale` text DEFAULT 'ar' NOT NULL,
	`source` text DEFAULT 'website' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`decided_at` integer,
	FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `bookings_date` ON `bookings` (`date`);--> statement-breakpoint
CREATE INDEX `bookings_status` ON `bookings` (`status`);--> statement-breakpoint
CREATE UNIQUE INDEX `bookings_active_slot` ON `bookings` (`date`,`time`) WHERE status in ('pending', 'approved');--> statement-breakpoint
CREATE TABLE `cases` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`image` text DEFAULT '' NOT NULL,
	`condition_ar` text DEFAULT '' NOT NULL,
	`condition_en` text DEFAULT '' NOT NULL,
	`title_ar` text NOT NULL,
	`title_en` text DEFAULT '' NOT NULL,
	`summary_ar` text DEFAULT '' NOT NULL,
	`summary_en` text DEFAULT '' NOT NULL,
	`treatment_ar` text DEFAULT '' NOT NULL,
	`treatment_en` text DEFAULT '' NOT NULL,
	`outcome_ar` text DEFAULT '' NOT NULL,
	`outcome_en` text DEFAULT '' NOT NULL,
	`sessions` integer,
	`illustrative` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `closed_dates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`note` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `closed_dates_date_unique` ON `closed_dates` (`date`);--> statement-breakpoint
CREATE TABLE `services` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`icon` text DEFAULT 'activity' NOT NULL,
	`title_ar` text NOT NULL,
	`title_en` text DEFAULT '' NOT NULL,
	`summary_ar` text DEFAULT '' NOT NULL,
	`summary_en` text DEFAULT '' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quote_ar` text NOT NULL,
	`quote_en` text DEFAULT '' NOT NULL,
	`subject_ar` text DEFAULT '' NOT NULL,
	`subject_en` text DEFAULT '' NOT NULL,
	`illustrative` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `weekly_hours` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`weekday` integer NOT NULL,
	`start` text NOT NULL,
	`end` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `weekly_hours_weekday` ON `weekly_hours` (`weekday`);