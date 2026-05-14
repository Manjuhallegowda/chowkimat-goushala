import { Hono } from "hono";
import { cors } from "hono/cors";
import { createDb, type Env } from "@workspace/db";
import { gallery, admins, siteSettings } from "@workspace/db/schema";
import { eq, asc } from "drizzle-orm";

type Variables = {
  adminId: number;
  adminRole: string;
  adminPerms: {
    canManageAdmins: boolean;
    canEditFinancials: boolean;
    canEditSiteSettings: boolean;
    canEditGallery: boolean;
  };
};

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// ── CORS ────────────────────────────────────────────────────────────
app.use("*", cors({
  origin: ["https://chowkimat-goushala.pages.dev", "http://localhost:3000", "http://localhost:5173"],
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// ── Helpers ─────────────────────────────────────────────────────────

async function signJwt(payload: Record<string, unknown>, secret: string): Promise<string> {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))
    .replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const body = btoa(JSON.stringify({ ...payload, exp: Date.now() + 86400000 }))
    .replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${header}.${body}`));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  return `${header}.${body}.${sigB64}`;
}

async function verifyJwt(token: string, secret: string): Promise<Record<string, unknown> | null> {
  try {
    const [header, body, sig] = token.split(".");
    if (!header || !body || !sig) return null;
    const key = await crypto.subtle.importKey(
      "raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"],
    );
    const sigRestore = sig.replace(/-/g, "+").replace(/_/g, "/");
    const sigBytes = Uint8Array.from(atob(sigRestore), (c) => c.charCodeAt(0));
    const valid = await crypto.subtle.verify("HMAC", key, sigBytes, new TextEncoder().encode(`${header}.${body}`));
    if (!valid) return null;
    const payload = JSON.parse(atob(body.replace(/-/g, "+").replace(/_/g, "/")));
    if (payload.exp && payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

async function hashPassword(password: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Financial setting keys that require the secret code to modify */
const FINANCIAL_KEYS = [
  "bank_name", "bank_account_name", "bank_account_number",
  "bank_ifsc", "bank_branch", "upi_id",
  "qr_code_key", "qr_code_url",
];

// ── Health ──────────────────────────────────────────────────────────
app.get("/api/healthz", (c) => c.json({ status: "ok" }));

// ── Auth: Login ─────────────────────────────────────────────────────
app.post("/api/admin/login", async (c) => {
  const { username, password } = await c.req.json<{ username: string; password: string }>();
  if (!username || !password) {
    return c.json({ error: "Username and password required" }, 400);
  }

  const db = createDb(c.env.DB);
  const [admin] = await db.select().from(admins).where(eq(admins.username, username)).limit(1);
  if (!admin) return c.json({ error: "Invalid credentials" }, 401);

  const hashed = await hashPassword(password);
  if (hashed !== admin.passwordHash) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const token = await signJwt({
    sub: admin.id,
    username: admin.username,
    role: admin.role,
    canManageAdmins: admin.canManageAdmins,
    canEditFinancials: admin.canEditFinancials,
    canEditSiteSettings: admin.canEditSiteSettings,
    canEditGallery: admin.canEditGallery,
  }, c.env.ADMIN_JWT_SECRET);

  return c.json({
    token,
    admin: {
      id: admin.id,
      username: admin.username,
      role: admin.role,
      canManageAdmins: admin.canManageAdmins,
      canEditFinancials: admin.canEditFinancials,
      canEditSiteSettings: admin.canEditSiteSettings,
      canEditGallery: admin.canEditGallery,
    },
  });
});

// ── Auth middleware for admin routes ────────────────────────────────
app.use("/api/admin/*", async (c, next) => {
  if (c.req.path === "/api/admin/login") return next();

  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const token = authHeader.slice(7);
  const payload = await verifyJwt(token, c.env.ADMIN_JWT_SECRET);
  if (!payload) {
    return c.json({ error: "Invalid or expired token" }, 401);
  }

  c.set("adminId", payload.sub as number);
  c.set("adminRole", payload.role as string);
  c.set("adminPerms", {
    canManageAdmins: payload.canManageAdmins as boolean,
    canEditFinancials: payload.canEditFinancials as boolean,
    canEditSiteSettings: payload.canEditSiteSettings as boolean,
    canEditGallery: payload.canEditGallery as boolean,
  });
  return next();
});

// ═════════════════════════════════════════════════════════════════════
// ADMIN MANAGEMENT
// ═════════════════════════════════════════════════════════════════════

// ── List all admins ─────────────────────────────────────────────────
app.get("/api/admin/users", async (c) => {
  if (!c.get("adminPerms").canManageAdmins) {
    return c.json({ error: "You don't have permission to manage admins" }, 403);
  }
  const db = createDb(c.env.DB);
  const allAdmins = await db.select({
    id: admins.id,
    username: admins.username,
    role: admins.role,
    canManageAdmins: admins.canManageAdmins,
    canEditFinancials: admins.canEditFinancials,
    canEditSiteSettings: admins.canEditSiteSettings,
    canEditGallery: admins.canEditGallery,
  }).from(admins);
  return c.json({ admins: allAdmins });
});

// ── Create a new admin ──────────────────────────────────────────────
app.post("/api/admin/users", async (c) => {
  if (!c.get("adminPerms").canManageAdmins) {
    return c.json({ error: "You don't have permission to manage admins" }, 403);
  }

  const body = await c.req.json<{
    username: string;
    password: string;
    canManageAdmins?: boolean;
    canEditFinancials?: boolean;
    canEditSiteSettings?: boolean;
    canEditGallery?: boolean;
  }>();

  if (!body.username || !body.password) {
    return c.json({ error: "Username and password required" }, 400);
  }
  if (body.password.length < 6) {
    return c.json({ error: "Password must be at least 6 characters" }, 400);
  }

  const db = createDb(c.env.DB);

  // Check if username already exists
  const [existing] = await db.select().from(admins).where(eq(admins.username, body.username)).limit(1);
  if (existing) {
    return c.json({ error: "Username already exists" }, 409);
  }

  const passwordHash = await hashPassword(body.password);
  const [newAdmin] = await db.insert(admins).values({
    username: body.username,
    passwordHash,
    role: "admin",
    canManageAdmins: body.canManageAdmins ?? false,
    canEditFinancials: body.canEditFinancials ?? false,
    canEditSiteSettings: body.canEditSiteSettings ?? true,
    canEditGallery: body.canEditGallery ?? true,
  }).returning();

  return c.json({
    admin: {
      id: newAdmin.id,
      username: newAdmin.username,
      role: newAdmin.role,
      canManageAdmins: newAdmin.canManageAdmins,
      canEditFinancials: newAdmin.canEditFinancials,
      canEditSiteSettings: newAdmin.canEditSiteSettings,
      canEditGallery: newAdmin.canEditGallery,
    },
  }, 201);
});

// ── Update admin permissions ────────────────────────────────────────
app.patch("/api/admin/users/:id", async (c) => {
  if (!c.get("adminPerms").canManageAdmins) {
    return c.json({ error: "You don't have permission to manage admins" }, 403);
  }

  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) return c.json({ error: "Invalid ID" }, 400);

  // Prevent editing yourself
  if (id === c.get("adminId")) {
    return c.json({ error: "You cannot modify your own permissions" }, 400);
  }

  const body = await c.req.json<{
    canManageAdmins?: boolean;
    canEditFinancials?: boolean;
    canEditSiteSettings?: boolean;
    canEditGallery?: boolean;
  }>();

  const db = createDb(c.env.DB);
  const [admin] = await db.select().from(admins).where(eq(admins.id, id)).limit(1);
  if (!admin) return c.json({ error: "Admin not found" }, 404);

  // Protect super_admin from being demoted
  if (admin.role === "super_admin") {
    return c.json({ error: "Cannot modify super admin permissions" }, 403);
  }

  await db.update(admins).set({
    canManageAdmins: body.canManageAdmins ?? admin.canManageAdmins,
    canEditFinancials: body.canEditFinancials ?? admin.canEditFinancials,
    canEditSiteSettings: body.canEditSiteSettings ?? admin.canEditSiteSettings,
    canEditGallery: body.canEditGallery ?? admin.canEditGallery,
  }).where(eq(admins.id, id));

  return c.json({ success: true });
});

// ── Delete an admin ─────────────────────────────────────────────────
app.delete("/api/admin/users/:id", async (c) => {
  if (!c.get("adminPerms").canManageAdmins) {
    return c.json({ error: "You don't have permission to manage admins" }, 403);
  }

  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) return c.json({ error: "Invalid ID" }, 400);

  if (id === c.get("adminId")) {
    return c.json({ error: "You cannot delete yourself" }, 400);
  }

  const db = createDb(c.env.DB);
  const [admin] = await db.select().from(admins).where(eq(admins.id, id)).limit(1);
  if (!admin) return c.json({ error: "Admin not found" }, 404);
  if (admin.role === "super_admin") {
    return c.json({ error: "Cannot delete super admin" }, 403);
  }

  await db.delete(admins).where(eq(admins.id, id));
  return c.json({ success: true });
});

// ═════════════════════════════════════════════════════════════════════
// SITE SETTINGS (address, contact, location)
// ═════════════════════════════════════════════════════════════════════

// ── Public: Get all site settings ───────────────────────────────────
app.get("/api/settings", async (c) => {
  const db = createDb(c.env.DB);
  const all = await db.select().from(siteSettings);
  const map: Record<string, string> = {};
  for (const s of all) {
    // Don't expose financial settings publicly
    if (!FINANCIAL_KEYS.includes(s.key)) {
      map[s.key] = s.value;
    }
  }
  return c.json({ settings: map });
});

// ── Public: Get financial display settings (bank + QR URL only) ─────
app.get("/api/settings/financial", async (c) => {
  const db = createDb(c.env.DB);
  const all = await db.select().from(siteSettings);
  const map: Record<string, string> = {};
  for (const s of all) {
    if (FINANCIAL_KEYS.includes(s.key)) {
      map[s.key] = s.value;
    }
  }
  return c.json({ settings: map });
});

// ── Admin: Update site settings (address, contact) ──────────────────
app.put("/api/admin/settings", async (c) => {
  if (!c.get("adminPerms").canEditSiteSettings) {
    return c.json({ error: "You don't have permission to edit site settings" }, 403);
  }

  const body = await c.req.json<Record<string, string>>();
  const db = createDb(c.env.DB);

  for (const [key, value] of Object.entries(body)) {
    // Block financial keys from being updated through this route
    if (FINANCIAL_KEYS.includes(key)) {
      return c.json({ error: `"${key}" is a financial setting — use the financial settings endpoint with secret code` }, 403);
    }
    await db.insert(siteSettings).values({ key, value })
      .onConflictDoUpdate({ target: siteSettings.key, set: { value } });
  }

  return c.json({ success: true });
});

// ── Admin: Update financial settings (requires secret code) ─────────
app.put("/api/admin/settings/financial", async (c) => {
  if (!c.get("adminPerms").canEditFinancials) {
    return c.json({ error: "You don't have permission to edit financial settings" }, 403);
  }

  const { secretCode, settings } = await c.req.json<{
    secretCode: string;
    settings: Record<string, string>;
  }>();

  if (!secretCode || secretCode !== c.env.FINANCIAL_SECRET_CODE) {
    return c.json({ error: "Invalid secret code" }, 403);
  }

  const db = createDb(c.env.DB);

  for (const [key, value] of Object.entries(settings)) {
    if (!FINANCIAL_KEYS.includes(key)) {
      return c.json({ error: `"${key}" is not a financial setting` }, 400);
    }
    await db.insert(siteSettings).values({ key, value })
      .onConflictDoUpdate({ target: siteSettings.key, set: { value } });
  }

  return c.json({ success: true });
});

// ── Admin: Upload QR code image (requires secret code) ──────────────
app.post("/api/admin/settings/qr-upload", async (c) => {
  if (!c.get("adminPerms").canEditFinancials) {
    return c.json({ error: "You don't have permission to edit financial settings" }, 403);
  }

  const formData = await c.req.formData();
  const file = formData.get("file") as File | null;
  const secretCode = formData.get("secretCode") as string | null;

  if (!secretCode || secretCode !== c.env.FINANCIAL_SECRET_CODE) {
    return c.json({ error: "Invalid secret code" }, 403);
  }
  if (!file) {
    return c.json({ error: "No file provided" }, 400);
  }

  // Delete old QR code from R2 if exists
  const db = createDb(c.env.DB);
  const [oldQr] = await db.select().from(siteSettings).where(eq(siteSettings.key, "qr_code_key")).limit(1);
  if (oldQr && oldQr.value) {
    await c.env.BUCKET.delete(oldQr.value);
  }

  // Upload new QR code to R2
  const key = `qr/${Date.now()}-${file.name}`;
  await c.env.BUCKET.put(key, file.stream(), {
    httpMetadata: { contentType: file.type },
  });

  const url = `/api/r2/${key}`;

  // Save to D1
  await db.insert(siteSettings).values({ key: "qr_code_key", value: key })
    .onConflictDoUpdate({ target: siteSettings.key, set: { value: key } });
  await db.insert(siteSettings).values({ key: "qr_code_url", value: url })
    .onConflictDoUpdate({ target: siteSettings.key, set: { value: url } });

  return c.json({ qr_code_url: url });
});

// ═════════════════════════════════════════════════════════════════════
// GALLERY
// ═════════════════════════════════════════════════════════════════════

// ── Public list ─────────────────────────────────────────────────────
app.get("/api/gallery", async (c) => {
  const db = createDb(c.env.DB);
  const images = await db.select().from(gallery).orderBy(asc(gallery.sortOrder));
  return c.json({ images });
});

// ── Admin upload ────────────────────────────────────────────────────
app.post("/api/admin/gallery/upload", async (c) => {
  if (!c.get("adminPerms").canEditGallery) {
    return c.json({ error: "You don't have permission to manage gallery" }, 403);
  }

  const formData = await c.req.formData();
  const file = formData.get("file") as File | null;
  const alt = (formData.get("alt") as string) || "";
  const aspect = (formData.get("aspect") as string) || "aspect-square";
  const sortOrder = parseInt((formData.get("sortOrder") as string) || "0", 10);

  if (!file) return c.json({ error: "No file provided" }, 400);

  const key = `gallery/${Date.now()}-${file.name}`;
  await c.env.BUCKET.put(key, file.stream(), {
    httpMetadata: { contentType: file.type },
  });

  const url = `/api/r2/${key}`;
  const db = createDb(c.env.DB);
  const [inserted] = await db.insert(gallery).values({ key, url, alt, aspect, sortOrder }).returning();

  return c.json({ image: inserted }, 201);
});

// ── Admin delete ────────────────────────────────────────────────────
app.delete("/api/admin/gallery/:id", async (c) => {
  if (!c.get("adminPerms").canEditGallery) {
    return c.json({ error: "You don't have permission to manage gallery" }, 403);
  }

  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) return c.json({ error: "Invalid ID" }, 400);

  const db = createDb(c.env.DB);
  const [image] = await db.select().from(gallery).where(eq(gallery.id, id)).limit(1);
  if (!image) return c.json({ error: "Not found" }, 404);

  await c.env.BUCKET.delete(image.key);
  await db.delete(gallery).where(eq(gallery.id, id));
  return c.json({ success: true });
});

// ── Gallery: Admin update metadata ──────────────────────────────────
app.patch("/api/admin/gallery/:id", async (c) => {
  if (!c.get("adminPerms").canEditGallery) {
    return c.json({ error: "You don't have permission to manage gallery" }, 403);
  }

  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) return c.json({ error: "Invalid ID" }, 400);

  const body = await c.req.json<{
    alt?: string;
    aspect?: string;
    sortOrder?: number;
  }>();

  const db = createDb(c.env.DB);
  await db.update(gallery).set({
    alt: body.alt,
    aspect: body.aspect,
    sortOrder: body.sortOrder,
  }).where(eq(gallery.id, id));

  return c.json({ success: true });
});

// ── Admin: Change password ──────────────────────────────────────────
app.patch("/api/admin/users/:id/password", async (c) => {
  if (!c.get("adminPerms").canManageAdmins) {
    return c.json({ error: "You don't have permission to manage admins" }, 403);
  }

  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) return c.json({ error: "Invalid ID" }, 400);

  const { password } = await c.req.json<{ password: string }>();
  if (!password || password.length < 6) {
    return c.json({ error: "Password must be at least 6 characters" }, 400);
  }

  const passwordHash = await hashPassword(password);
  const db = createDb(c.env.DB);
  
  await db.update(admins).set({ passwordHash }).where(eq(admins.id, id));

  return c.json({ success: true });
});

// ═════════════════════════════════════════════════════════════════════
// R2 IMAGE SERVING
// ═════════════════════════════════════════════════════════════════════

app.get("/api/r2/*", async (c) => {
  const key = c.req.path.replace("/api/r2/", "");
  const object = await c.env.BUCKET.get(key);
  if (!object) return c.notFound();

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  return new Response(object.body, { headers });
});

export default app;
