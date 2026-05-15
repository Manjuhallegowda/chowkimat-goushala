CREATE TABLE `admin_login_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`admin_id` integer NOT NULL,
	`ip_address` text,
	`location` text,
	`user_agent` text,
	`timestamp` integer NOT NULL,
	FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `hero_slides` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`url` text NOT NULL,
	`title` text,
	`description` text,
	`show_logo` integer DEFAULT true NOT NULL,
	`btn_primary_text` text DEFAULT 'Make a Donation' NOT NULL,
	`btn_primary_link` text DEFAULT '/donate' NOT NULL,
	`btn_secondary_text` text DEFAULT 'About Us' NOT NULL,
	`btn_secondary_link` text DEFAULT '/about' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
