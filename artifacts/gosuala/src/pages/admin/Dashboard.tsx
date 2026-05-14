import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";

// ── Types ───────────────────────────────────────────────────────────

interface GalleryImage {
  id: number; key: string; url: string; alt: string; aspect: string; sortOrder: number;
}
interface AdminUser {
  id: number; username: string; role: string;
  canManageAdmins: boolean; canEditFinancials: boolean;
  canEditSiteSettings: boolean; canEditGallery: boolean;
}
interface AdminPerms {
  canManageAdmins: boolean; canEditFinancials: boolean;
  canEditSiteSettings: boolean; canEditGallery: boolean;
}

function getToken(): string | null { return localStorage.getItem("admin_token"); }
function getPerms(): AdminPerms {
  try { return JSON.parse(localStorage.getItem("admin_perms") || "{}"); }
  catch { return { canManageAdmins: false, canEditFinancials: false, canEditSiteSettings: true, canEditGallery: true }; }
}
function authHeaders(): HeadersInit {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

// ── Tabs ────────────────────────────────────────────────────────────

type Tab = "gallery" | "settings" | "financial" | "admins";

// ── Component ───────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const perms = getPerms();
  const [tab, setTab] = useState<Tab>("gallery");

  useEffect(() => {
    if (!getToken()) setLocation("/admin");
  }, [setLocation]);

  function handleLogout() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_perms");
    setLocation("/admin");
  }

  const tabs: { key: Tab; label: string; show: boolean }[] = [
    { key: "gallery", label: "Gallery", show: perms.canEditGallery },
    { key: "settings", label: "Site Settings", show: perms.canEditSiteSettings },
    { key: "financial", label: "Bank & QR", show: perms.canEditFinancials },
    { key: "admins", label: "Manage Admins", show: perms.canManageAdmins },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-foreground/60 mt-1">Manage the temple website</p>
          </div>
          <button onClick={handleLogout}
            className="border border-border text-foreground/70 px-4 py-2 text-sm tracking-widest uppercase hover:bg-card transition-colors">
            Logout
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 border-b border-border mb-8 overflow-x-auto">
          {tabs.filter((t) => t.show).map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-6 py-3 text-sm tracking-widest uppercase transition-colors whitespace-nowrap ${
                tab === t.key
                  ? "border-b-2 border-primary text-primary font-medium"
                  : "text-foreground/50 hover:text-foreground/80"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === "gallery" && perms.canEditGallery && <GalleryManager />}
        {tab === "settings" && perms.canEditSiteSettings && <SiteSettingsManager />}
        {tab === "financial" && perms.canEditFinancials && <FinancialSettingsManager />}
        {tab === "admins" && perms.canManageAdmins && <AdminManager />}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════
// GALLERY MANAGER
// ═════════════════════════════════════════════════════════════════════

function GalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [aspect, setAspect] = useState("aspect-square");
  const [sortOrder, setSortOrder] = useState(0);
  const [message, setMessage] = useState("");

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      setImages(data.images || []);
    } catch { /* ignore */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setUploading(true); setMessage("");
    try {
      const fd = new FormData();
      fd.append("file", file); fd.append("alt", alt);
      fd.append("aspect", aspect); fd.append("sortOrder", String(sortOrder));
      const res = await fetch("/api/admin/gallery/upload", { method: "POST", headers: authHeaders(), body: fd });
      if (!res.ok) { setMessage((await res.json()).error || "Upload failed"); return; }
      setMessage("Image uploaded successfully!");
      setFile(null); setAlt(""); setAspect("aspect-square"); setSortOrder(0);
      const fi = document.getElementById("gallery-file") as HTMLInputElement;
      if (fi) fi.value = "";
      fetchImages();
    } catch { setMessage("Upload failed."); } finally { setUploading(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this image?")) return;
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE", headers: authHeaders() });
    fetchImages();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <div className="bg-card border border-border p-6 sticky top-28">
          <h2 className="font-serif text-xl text-foreground mb-4">Upload Image</h2>
          {message && <div className={`text-sm px-4 py-3 rounded mb-4 ${message.includes("success") ? "bg-green-500/10 border border-green-500/30 text-green-700" : "bg-destructive/10 border border-destructive/30 text-destructive"}`}>{message}</div>}
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label htmlFor="gallery-file" className="block text-sm font-medium text-foreground mb-1.5">Image File</label>
              <input id="gallery-file" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} required className="w-full text-sm text-foreground/70 file:mr-4 file:py-2 file:px-4 file:border file:border-border file:text-sm file:font-medium file:bg-background file:text-foreground hover:file:bg-card file:cursor-pointer" />
            </div>
            <InputField id="gallery-alt" label="Alt Text" value={alt} onChange={setAlt} placeholder="Describe the image" />
            <div>
              <label htmlFor="gallery-aspect" className="block text-sm font-medium text-foreground mb-1.5">Aspect Ratio</label>
              <select id="gallery-aspect" value={aspect} onChange={(e) => setAspect(e.target.value)} className="w-full px-4 py-2.5 border border-border bg-background text-foreground rounded focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="aspect-square">Square (1:1)</option>
                <option value="aspect-video">Video (16:9)</option>
                <option value="aspect-[3/4]">Portrait (3:4)</option>
                <option value="aspect-[4/3]">Landscape (4:3)</option>
              </select>
            </div>
            <InputField id="gallery-sort" label="Sort Order" type="number" value={String(sortOrder)} onChange={(v) => setSortOrder(parseInt(v, 10) || 0)} />
            <SubmitButton disabled={uploading || !file}>{uploading ? "Uploading..." : "Upload Image"}</SubmitButton>
          </form>
        </div>
      </div>
      <div className="lg:col-span-2">
        <h2 className="font-serif text-xl text-foreground mb-4">Current Gallery ({images.length} images)</h2>
        {loading ? <p className="text-center py-12 text-foreground/60">Loading...</p>
          : images.length === 0 ? <p className="text-center py-12 bg-card border border-border text-foreground/60">No images yet</p>
          : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {images.map((img) => (
              <div key={img.id} className="bg-card border border-border overflow-hidden group">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-center justify-center">
                    <button onClick={() => handleDelete(img.id)} className="opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground px-4 py-2 text-sm uppercase">Delete</button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm text-foreground truncate">{img.alt || "No description"}</p>
                  <p className="text-xs text-foreground/40 mt-1">Order: {img.sortOrder} • {img.aspect}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════
// SITE SETTINGS MANAGER
// ═════════════════════════════════════════════════════════════════════

function SiteSettingsManager() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((d) => setSettings(d.settings || {})).finally(() => setLoading(false));
  }, []);

  function update(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setMessage("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT", headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) { setMessage((await res.json()).error || "Save failed"); return; }
      setMessage("Settings saved successfully!");
    } catch { setMessage("Save failed."); } finally { setSaving(false); }
  }

  if (loading) return <p className="text-center py-12 text-foreground/60">Loading...</p>;

  const fields = [
    { key: "address_line1", label: "Address Line 1" },
    { key: "address_line2", label: "Address Line 2" },
    { key: "address_city", label: "City / District" },
    { key: "address_pincode", label: "Pincode" },
    { key: "address_country", label: "Country" },
    { key: "contact_phone", label: "Phone Number" },
    { key: "contact_email", label: "Email" },
    { key: "contact_hours", label: "Visiting Hours" },
    { key: "map_embed_url", label: "Map Embed URL" },
  ];

  return (
    <div className="max-w-2xl">
      <h2 className="font-serif text-xl text-foreground mb-4">Address & Contact Information</h2>
      <p className="text-sm text-foreground/60 mb-6">Changes here will be reflected on the Contact page.</p>
      {message && <StatusMessage message={message} />}
      <form onSubmit={handleSave} className="space-y-4 bg-card border border-border p-6">
        {fields.map((f) => (
          <InputField key={f.key} id={`setting-${f.key}`} label={f.label} value={settings[f.key] || ""} onChange={(v) => update(f.key, v)} />
        ))}
        <SubmitButton disabled={saving}>{saving ? "Saving..." : "Save Settings"}</SubmitButton>
      </form>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════
// FINANCIAL SETTINGS MANAGER
// ═════════════════════════════════════════════════════════════════════

function FinancialSettingsManager() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [secretCode, setSecretCode] = useState("");
  const [message, setMessage] = useState("");
  const [qrUploading, setQrUploading] = useState(false);
  const [qrFile, setQrFile] = useState<File | null>(null);

  useEffect(() => {
    fetch("/api/settings/financial", { headers: authHeaders() })
      .then((r) => r.json()).then((d) => setSettings(d.settings || {})).finally(() => setLoading(false));
  }, []);

  function update(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!secretCode) { setMessage("Secret code is required"); return; }
    setSaving(true); setMessage("");
    try {
      const { qr_code_key, qr_code_url, ...bankSettings } = settings;
      const res = await fetch("/api/admin/settings/financial", {
        method: "PUT", headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ secretCode, settings: bankSettings }),
      });
      if (!res.ok) { setMessage((await res.json()).error || "Save failed"); return; }
      setMessage("Financial settings saved successfully!");
    } catch { setMessage("Save failed."); } finally { setSaving(false); }
  }

  async function handleQrUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!qrFile || !secretCode) { setMessage("QR file and secret code required"); return; }
    setQrUploading(true); setMessage("");
    try {
      const fd = new FormData();
      fd.append("file", qrFile); fd.append("secretCode", secretCode);
      const res = await fetch("/api/admin/settings/qr-upload", { method: "POST", headers: authHeaders(), body: fd });
      if (!res.ok) { setMessage((await res.json()).error || "Upload failed"); return; }
      const data = await res.json();
      setSettings((prev) => ({ ...prev, qr_code_url: data.qr_code_url }));
      setMessage("QR code uploaded successfully!");
      setQrFile(null);
      const fi = document.getElementById("qr-file") as HTMLInputElement;
      if (fi) fi.value = "";
    } catch { setMessage("Upload failed."); } finally { setQrUploading(false); }
  }

  if (loading) return <p className="text-center py-12 text-foreground/60">Loading...</p>;

  return (
    <div className="max-w-2xl space-y-8">
      <div className="bg-destructive/5 border border-destructive/20 p-4 rounded">
        <p className="text-sm text-destructive font-medium">⚠️ Protected Area</p>
        <p className="text-sm text-foreground/70 mt-1">
          Changing bank details and QR code requires both <strong>financial permission</strong> and a <strong>secret code</strong>.
        </p>
      </div>

      {message && <StatusMessage message={message} />}

      {/* Secret Code Input — shared by both forms */}
      <div className="bg-card border border-border p-6">
        <label htmlFor="secret-code" className="block text-sm font-medium text-foreground mb-1.5">
          Secret Code <span className="text-destructive">*</span>
        </label>
        <input id="secret-code" type="password" value={secretCode} onChange={(e) => setSecretCode(e.target.value)}
          placeholder="Enter the financial secret code"
          className="w-full px-4 py-2.5 border border-border bg-background text-foreground rounded focus:outline-none focus:ring-2 focus:ring-destructive/50 focus:border-destructive transition-colors" />
      </div>

      {/* Bank Details */}
      <form onSubmit={handleSave} className="bg-card border border-border p-6 space-y-4">
        <h2 className="font-serif text-xl text-foreground mb-2">Bank Details</h2>
        {[
          { key: "bank_name", label: "Bank Name" },
          { key: "bank_account_name", label: "Account Name" },
          { key: "bank_account_number", label: "Account Number" },
          { key: "bank_ifsc", label: "IFSC Code" },
          { key: "bank_branch", label: "Branch" },
          { key: "upi_id", label: "UPI ID" },
        ].map((f) => (
          <InputField key={f.key} id={`fin-${f.key}`} label={f.label} value={settings[f.key] || ""} onChange={(v) => update(f.key, v)} />
        ))}
        <SubmitButton disabled={saving || !secretCode}>{saving ? "Saving..." : "Save Bank Details"}</SubmitButton>
      </form>

      {/* QR Code Upload */}
      <form onSubmit={handleQrUpload} className="bg-card border border-border p-6 space-y-4">
        <h2 className="font-serif text-xl text-foreground mb-2">QR Code</h2>
        {settings.qr_code_url && (
          <div className="mb-4">
            <p className="text-sm text-foreground/60 mb-2">Current QR Code:</p>
            <img src={settings.qr_code_url} alt="QR Code" className="w-48 h-48 object-contain border border-border bg-white p-2" />
          </div>
        )}
        <div>
          <label htmlFor="qr-file" className="block text-sm font-medium text-foreground mb-1.5">Upload New QR Code</label>
          <input id="qr-file" type="file" accept="image/*" onChange={(e) => setQrFile(e.target.files?.[0] || null)}
            className="w-full text-sm text-foreground/70 file:mr-4 file:py-2 file:px-4 file:border file:border-border file:text-sm file:font-medium file:bg-background file:text-foreground hover:file:bg-card file:cursor-pointer" />
        </div>
        <SubmitButton disabled={qrUploading || !qrFile || !secretCode}>{qrUploading ? "Uploading..." : "Upload QR Code"}</SubmitButton>
      </form>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════
// ADMIN MANAGER
// ═════════════════════════════════════════════════════════════════════

function AdminManager() {
  const [adminList, setAdminList] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // New admin form
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPerms, setNewPerms] = useState({
    canManageAdmins: false,
    canEditFinancials: false,
    canEditSiteSettings: true,
    canEditGallery: true,
  });

  const fetchAdmins = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users", { headers: authHeaders() });
      const data = await res.json();
      setAdminList(data.admins || []);
    } catch { /* ignore */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ username: newUsername, password: newPassword, ...newPerms }),
      });
      const data = await res.json();
      if (!res.ok) { setMessage(data.error || "Failed"); return; }
      setMessage(`Admin "${newUsername}" created successfully!`);
      setNewUsername(""); setNewPassword("");
      setNewPerms({ canManageAdmins: false, canEditFinancials: false, canEditSiteSettings: true, canEditGallery: true });
      fetchAdmins();
    } catch { setMessage("Failed to create admin."); }
  }

  async function handleTogglePerm(adminId: number, perm: string, currentValue: boolean) {
    await fetch(`/api/admin/users/${adminId}`, {
      method: "PATCH",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ [perm]: !currentValue }),
    });
    fetchAdmins();
  }

  async function handleDelete(id: number, username: string) {
    if (!confirm(`Delete admin "${username}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE", headers: authHeaders() });
    if (!res.ok) { const d = await res.json(); setMessage(d.error || "Delete failed"); return; }
    fetchAdmins();
  }

  return (
    <div className="space-y-8">
      {message && <StatusMessage message={message} />}

      {/* Create New Admin */}
      <div className="max-w-xl bg-card border border-border p-6">
        <h2 className="font-serif text-xl text-foreground mb-4">Add New Admin</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <InputField id="new-username" label="Username" value={newUsername} onChange={setNewUsername} placeholder="Enter username" />
          <InputField id="new-password" label="Password" type="password" value={newPassword} onChange={setNewPassword} placeholder="Min 6 characters" />

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Permissions</p>
            {([
              { key: "canEditGallery", label: "Can manage gallery images" },
              { key: "canEditSiteSettings", label: "Can edit site settings (address, contact)" },
              { key: "canEditFinancials", label: "Can edit bank details & QR code" },
              { key: "canManageAdmins", label: "Can manage other admins" },
            ] as const).map((p) => (
              <label key={p.key} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={newPerms[p.key]}
                  onChange={(e) => setNewPerms((prev) => ({ ...prev, [p.key]: e.target.checked }))}
                  className="w-4 h-4 accent-primary" />
                <span className="text-sm text-foreground/80">{p.label}</span>
              </label>
            ))}
          </div>

          <SubmitButton disabled={!newUsername || !newPassword}>Create Admin</SubmitButton>
        </form>
      </div>

      {/* Admin List */}
      <div>
        <h2 className="font-serif text-xl text-foreground mb-4">All Admins ({adminList.length})</h2>
        {loading ? <p className="text-foreground/60">Loading...</p> : (
          <div className="space-y-3">
            {adminList.map((admin) => (
              <div key={admin.id} className="bg-card border border-border p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{admin.username}</span>
                    {admin.role === "super_admin" && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">SUPER ADMIN</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {([
                      { key: "canEditGallery" as const, label: "Gallery", color: "bg-blue-500/10 text-blue-700" },
                      { key: "canEditSiteSettings" as const, label: "Settings", color: "bg-green-500/10 text-green-700" },
                      { key: "canEditFinancials" as const, label: "Financial", color: "bg-amber-500/10 text-amber-700" },
                      { key: "canManageAdmins" as const, label: "Admins", color: "bg-purple-500/10 text-purple-700" },
                    ]).map((p) => (
                      <button key={p.key} onClick={() => admin.role !== "super_admin" && handleTogglePerm(admin.id, p.key, admin[p.key])}
                        disabled={admin.role === "super_admin"}
                        className={`text-xs px-2 py-1 rounded transition-opacity ${
                          admin[p.key] ? p.color : "bg-foreground/5 text-foreground/30 line-through"
                        } ${admin.role === "super_admin" ? "cursor-default" : "cursor-pointer hover:opacity-70"}`}>
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
                {admin.role !== "super_admin" && (
                  <button onClick={() => handleDelete(admin.id, admin.username)}
                    className="text-destructive text-sm hover:underline whitespace-nowrap">
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════
// SHARED UI COMPONENTS
// ═════════════════════════════════════════════════════════════════════

function InputField({ id, label, value, onChange, type = "text", placeholder }: {
  id: string; label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-4 py-2.5 border border-border bg-background text-foreground rounded focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" />
    </div>
  );
}

function SubmitButton({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) {
  return (
    <button type="submit" disabled={disabled}
      className="w-full bg-primary text-primary-foreground py-3 font-medium tracking-widest uppercase text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
      {children}
    </button>
  );
}

function StatusMessage({ message }: { message: string }) {
  const isSuccess = message.toLowerCase().includes("success");
  return (
    <div className={`text-sm px-4 py-3 rounded ${isSuccess
      ? "bg-green-500/10 border border-green-500/30 text-green-700"
      : "bg-destructive/10 border border-destructive/30 text-destructive"
    }`}>{message}</div>
  );
}
