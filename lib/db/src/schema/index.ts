import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// ─── Admin users ────────────────────────────────────────────────────
export const admins = sqliteTable("admins", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  /** Role: "super_admin" has full access, "admin" has limited access */
  role: text("role").notNull().default("admin"),
  /** Whether this admin can manage other admins */
  canManageAdmins: integer("can_manage_admins", { mode: "boolean" }).notNull().default(false),
  /** Whether this admin can edit financial settings (QR code, bank details) */
  canEditFinancials: integer("can_edit_financials", { mode: "boolean" }).notNull().default(false),
  /** Whether this admin can edit site settings (address, location, contact) */
  canEditSiteSettings: integer("can_edit_site_settings", { mode: "boolean" }).notNull().default(true),
  /** Whether this admin can manage gallery images */
  canEditGallery: integer("can_edit_gallery", { mode: "boolean" }).notNull().default(true),
});

export const adminLoginLogs = sqliteTable("admin_login_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  adminId: integer("admin_id").notNull().references(() => admins.id, { onDelete: "cascade" }),
  ipAddress: text("ip_address"),
  location: text("location"),
  userAgent: text("user_agent"),
  timestamp: integer("timestamp", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const heroSlides = sqliteTable("hero_slides", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull(),
  url: text("url").notNull(),
  title: text("title"),
  description: text("description"),
  showLogo: integer("show_logo", { mode: "boolean" }).notNull().default(true),
  btnPrimaryText: text("btn_primary_text").notNull().default("Make a Donation"),
  btnPrimaryLink: text("btn_primary_link").notNull().default("/donate"),
  btnSecondaryText: text("btn_secondary_text").notNull().default("About Us"),
  btnSecondaryLink: text("btn_secondary_link").notNull().default("/about"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export type HeroSlide = typeof heroSlides.$inferSelect;
export type InsertHeroSlide = typeof heroSlides.$inferInsert;

export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = typeof admins.$inferInsert;

export type AdminLoginLog = typeof adminLoginLogs.$inferSelect;
export type InsertAdminLoginLog = typeof adminLoginLogs.$inferInsert;

// ─── Gallery images (metadata, actual files live in R2) ─────────────
export const gallery = sqliteTable("gallery", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** R2 object key, e.g. "gallery/temple-exterior.png" */
  key: text("key").notNull(),
  /** Public URL served via R2 custom domain or Worker */
  url: text("url").notNull(),
  alt: text("alt").notNull().default(""),
  /** CSS aspect class like "aspect-video", "aspect-square", "aspect-[3/4]" */
  aspect: text("aspect").notNull().default("aspect-square"),
  /** Display order — lower numbers appear first */
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type GalleryImage = typeof gallery.$inferSelect;
export type InsertGalleryImage = typeof gallery.$inferInsert;

// ─── Site settings (key-value store for dynamic content) ────────────
export const siteSettings = sqliteTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
});

export type SiteSetting = typeof siteSettings.$inferSelect;

/**
 * Well-known setting keys:
 *
 * Contact / Location:
 *   "address_line1", "address_line2", "address_city", "address_state",
 *   "address_pincode", "address_country"
 *   "contact_phone", "contact_email", "contact_hours"
 *   "map_embed_url"
 *
 * Financial (protected by secret code):
 *   "bank_name", "bank_account_name", "bank_account_number",
 *   "bank_ifsc", "bank_branch"
 *   "upi_id"
 *   "qr_code_key"   — R2 object key for the QR code image
 *   "qr_code_url"   — public URL for the QR code image
 */