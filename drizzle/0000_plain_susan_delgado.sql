CREATE TABLE `band_frequency` (
	`band_id` integer NOT NULL,
	`channel_number` integer NOT NULL,
	`frequency` integer NOT NULL,
	PRIMARY KEY(`band_id`, `channel_number`),
	FOREIGN KEY (`band_id`) REFERENCES `frequency_band`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `device_band` (
	`device_id` integer NOT NULL,
	`band_id` integer NOT NULL,
	`band_label` text NOT NULL,
	PRIMARY KEY(`device_id`, `band_id`),
	FOREIGN KEY (`device_id`) REFERENCES `device`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`band_id`) REFERENCES `frequency_band`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `device` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `favorite` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`vtx_device_id` integer,
	`vrx_device_id` integer,
	`frequency` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`vtx_device_id`) REFERENCES `device`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`vrx_device_id`) REFERENCES `device`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `frequency_band` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`band_sign` text NOT NULL,
	`name` text NOT NULL,
	`short_name` text,
	`is_custom` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`vtx_device_id` integer,
	`vrx_device_id` integer,
	`frequency` integer NOT NULL,
	`used_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`vtx_device_id`) REFERENCES `device`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`vrx_device_id`) REFERENCES `device`(`id`) ON UPDATE no action ON DELETE set null
);
