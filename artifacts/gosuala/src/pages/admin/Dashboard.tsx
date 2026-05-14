import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { Pencil, Trash2, Shield, Image as ImageIcon, CreditCard, Settings, Plus, Save, X, Key } from "lucide-react";

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
  return t ? { Authorization: `Bearer ${t}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
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

  const tabs: { key: Tab; label: string; icon: any; show: boolean }[] = [
    { key: "gallery", label: "Gallery", icon: ImageIcon, show: perms.canEditGallery },
    { key: "settings", label: "Site Settings", icon: Settings, show: perms.canEditSiteSettings },
    { key: "financial", label: "Bank & QR", icon: CreditCard, show: perms.canEditFinancials },
    { key: "admins", label: "Manage Admins", icon: Shield, show: perms.canManageAdmins },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-border pb-6">
          <div>
            <h1 className="font-serif text-4xl text-primary font-bold">Admin Dashboard</h1>
            <p className="text-foreground/60 mt-1">Full control over temple assets and configurations</p>
          </div>
          <button onClick={handleLogout}
            className="border border-destructive/30 text-destructive px-6 py-2.5 text-sm tracking-widest uppercase font-medium hover:bg-destructive hover:text-destructive-foreground transition-all duration-300">
            Logout
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-10 overflow-x-auto pb-2">
          {tabs.filter((t) => t.show).map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-6 py-3 text-sm tracking-widest uppercase transition-all duration-300 whitespace-nowrap border-b-2 ${
                tab === t.key
                  ? "border-primary text-primary bg-primary/5 font-bold"
                  : "border-transparent text-foreground/50 hover:text-foreground/80 hover:bg-card"
              }`}>
              <t.icon size={18} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {tab === "gallery" && perms.canEditGallery && <GalleryManager />}
          {tab === "settings" && perms.canEditSiteSettings && <SiteSettingsManager />}
          {tab === "financial" && perms.canEditFinancials && <FinancialSettingsManager />}
          {tab === "admins" && perms.canManageAdmins && <AdminManager />}
        </div>
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
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  
  // Form State
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUploading(true); setMessage("");
    
    try {
      if (editingImage) {
        // Update existing metadata
        const res = await fetch(`/api/admin/gallery/${editingImage.id}`, {
          method: "PATCH",
          headers: authHeaders(),
          body: JSON.stringify({ alt, aspect, sortOrder }),
        });
        if (!res.ok) throw new Error((await res.json()).error || "Update failed");
        setMessage("Image metadata updated!");
      } else {
        // Upload new image
        if (!file) return;
        const fd = new FormData();
        fd.append("file", file); fd.append("alt", alt);
        fd.append("aspect", aspect); fd.append("sortOrder", String(sortOrder));
        const res = await fetch("/api/admin/gallery/upload", { 
          method: "POST", 
          headers: { Authorization: `Bearer ${getToken()}` }, // No Content-Type for FormData
          body: fd 
        });
        if (!res.ok) throw new Error((await res.json()).error || "Upload failed");
        setMessage("Image uploaded successfully!");
      }
      
      handleCancel();
      fetchImages();
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setUploading(false);
    }
  }

  function handleEdit(img: GalleryImage) {
    setEditingImage(img);
    setAlt(img.alt);
    setAspect(img.aspect);
    setSortOrder(img.sortOrder);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancel() {
    setEditingImage(null);
    setFile(null); setAlt(""); setAspect("aspect-square"); setSortOrder(0);
    const fi = document.getElementById("gallery-file") as HTMLInputElement;
    if (fi) fi.value = "";
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this image permanently?")) return;
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE", headers: authHeaders() });
    fetchImages();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-4">
        <div className="bg-card border border-border p-8 rounded-xl shadow-sm sticky top-28">
          <h2 className="font-serif text-2xl text-foreground mb-6 flex items-center gap-2">
            {editingImage ? <Pencil size={20} className="text-primary" /> : <Plus size={20} className="text-primary" />}
            {editingImage ? "Edit Metadata" : "Upload New Image"}
          </h2>
          {message && <StatusMessage message={message} />}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!editingImage && (
              <div>
                <label htmlFor="gallery-file" className="block text-sm font-semibold text-foreground mb-2">Image File</label>
                <input id="gallery-file" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} required className="w-full text-sm text-foreground/70 file:mr-4 file:py-2.5 file:px-6 file:border file:border-border file:text-sm file:font-bold file:bg-background file:text-foreground hover:file:bg-primary/10 file:transition-colors file:cursor-pointer rounded border border-border p-1" />
              </div>
            )}
            {editingImage && (
              <div className="aspect-video relative rounded-lg overflow-hidden border border-border mb-4">
                <img src={editingImage.url} alt={editingImage.alt} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-primary text-white text-[10px] px-2 py-1 rounded uppercase font-bold">Preview</div>
              </div>
            )}
            <InputField id="gallery-alt" label="Alt Text (Description)" value={alt} onChange={setAlt} placeholder="Describe the image for SEO" />
            <div>
              <label htmlFor="gallery-aspect" className="block text-sm font-semibold text-foreground mb-2">Display Aspect Ratio</label>
              <select id="gallery-aspect" value={aspect} onChange={(e) => setAspect(e.target.value)} className="w-full px-4 py-3 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
                <option value="aspect-square">Square (1:1)</option>
                <option value="aspect-video">Video (16:9)</option>
                <option value="aspect-[3/4]">Portrait (3:4)</option>
                <option value="aspect-[4/3]">Landscape (4:3)</option>
              </select>
            </div>
            <InputField id="gallery-sort" label="Display Order" type="number" value={String(sortOrder)} onChange={(v) => setSortOrder(parseInt(v, 10) || 0)} />
            
            <div className="flex gap-3 pt-2">
              <SubmitButton disabled={uploading || (!editingImage && !file)}>
                {uploading ? "Processing..." : editingImage ? "Save Changes" : "Upload Image"}
              </SubmitButton>
              {editingImage && (
                <button type="button" onClick={handleCancel} className="flex-1 border border-border text-foreground py-3 font-bold uppercase text-xs hover:bg-card transition-colors rounded-lg">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      <div className="lg:col-span-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl text-foreground">Current Gallery ({images.length})</h2>
        </div>
        {loading ? <p className="text-center py-20 text-foreground/40 italic">Loading gallery...</p>
          : images.length === 0 ? <p className="text-center py-20 bg-card border border-border rounded-xl text-foreground/40 italic">The gallery is currently empty</p>
          : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {images.map((img) => (
              <div key={img.id} className="bg-card border border-border rounded-xl overflow-hidden group hover:shadow-md transition-all duration-300">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button onClick={() => handleEdit(img)} className="bg-background/90 text-foreground p-3 rounded-full hover:bg-primary hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-lg">
                      <Pencil size={20} />
                    </button>
                    <button onClick={() => handleDelete(img.id)} className="bg-destructive/90 text-white p-3 rounded-full hover:bg-destructive transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-lg">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-background border-t border-border/30">
                  <p className="text-sm font-medium text-foreground truncate mb-1">{img.alt || "No description"}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-foreground/40 uppercase tracking-widest">Order: {img.sortOrder}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-secondary/50 text-foreground/60 rounded-full">{img.aspect.replace("aspect-", "")}</span>
                  </div>
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
      const sanitizedSettings = { ...settings };
      
      // Auto-extract SRC from iframe tag if user pasted the whole thing
      if (sanitizedSettings.map_embed_url?.includes("<iframe")) {
        const match = sanitizedSettings.map_embed_url.match(/src="([^"]+)"/);
        if (match && match[1]) {
          sanitizedSettings.map_embed_url = match[1];
        }
      }

      const res = await fetch("/api/admin/settings", {
        method: "PUT", headers: authHeaders(),
        body: JSON.stringify(sanitizedSettings),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Save failed");
      setSettings(sanitizedSettings);
      setMessage("Settings updated successfully!");
    } catch (err: any) { setMessage(err.message); } finally { setSaving(false); }
  }

  if (loading) return <p className="text-center py-20 italic text-foreground/40">Loading settings...</p>;

  const groups = [
    { label: "Address Information", fields: [
      { key: "address_line1", label: "Address Line 1" },
      { key: "address_line2", label: "Address Line 2" },
      { key: "address_city", label: "City / District" },
      { key: "address_pincode", label: "Pincode" },
      { key: "address_country", label: "Country" },
    ]},
    { label: "Contact Details", fields: [
      { key: "contact_phone", label: "Phone Number" },
      { key: "contact_email", label: "Public Email" },
      { key: "contact_hours", label: "Working Hours" },
    ]},
    { label: "Location", fields: [
      { key: "map_embed_url", label: "Google Maps Embed URL" },
    ]}
  ];

  return (
    <div className="max-w-3xl">
      <h2 className="font-serif text-2xl text-foreground mb-4">Temple Site Settings</h2>
      <p className="text-sm text-foreground/60 mb-8 italic">Update the physical address and contact information displayed on the website.</p>
      {message && <StatusMessage message={message} />}
      <form onSubmit={handleSave} className="space-y-8">
        {groups.map((group) => (
          <div key={group.label} className="bg-card border border-border p-8 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold text-primary mb-6 border-b border-border pb-2 uppercase tracking-widest">{group.label}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {group.fields.map((f) => (
                <div key={f.key} className={f.key === "map_embed_url" ? "md:col-span-2" : ""}>
                  <InputField id={`setting-${f.key}`} label={f.label} value={settings[f.key] || ""} onChange={(v) => update(f.key, v)} />
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="max-w-xs ml-auto">
          <SubmitButton disabled={saving} icon={Save}>{saving ? "Saving..." : "Update All Settings"}</SubmitButton>
        </div>
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
    if (!secretCode) { setMessage("⚠️ Secret code is required to modify financial data"); return; }
    setSaving(true); setMessage("");
    try {
      const { qr_code_key, qr_code_url, ...bankSettings } = settings;
      const res = await fetch("/api/admin/settings/financial", {
        method: "PUT", headers: authHeaders(),
        body: JSON.stringify({ secretCode, settings: bankSettings }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Update failed");
      setMessage("Bank details updated successfully!");
    } catch (err: any) { setMessage(err.message); } finally { setSaving(false); }
  }

  async function handleQrUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!qrFile || !secretCode) { setMessage("⚠️ QR file and secret code are both required"); return; }
    setQrUploading(true); setMessage("");
    try {
      const fd = new FormData();
      fd.append("file", qrFile); fd.append("secretCode", secretCode);
      const res = await fetch("/api/admin/settings/qr-upload", { 
        method: "POST", 
        headers: { Authorization: `Bearer ${getToken()}` }, 
        body: fd 
      });
      if (!res.ok) throw new Error((await res.json()).error || "Upload failed");
      const data = await res.json();
      setSettings((prev) => ({ ...prev, qr_code_url: data.qr_code_url }));
      setMessage("New QR code has been deployed!");
      setQrFile(null);
      const fi = document.getElementById("qr-file") as HTMLInputElement;
      if (fi) fi.value = "";
    } catch (err: any) { setMessage(err.message); } finally { setQrUploading(false); }
  }

  if (loading) return <p className="text-center py-20 italic text-foreground/40">Loading financial data...</p>;

  return (
    <div className="max-w-3xl space-y-10">
      <div className="bg-destructive/10 border border-destructive/30 p-6 rounded-xl flex items-start gap-4">
        <Shield className="text-destructive shrink-0 mt-1" size={24} />
        <div>
          <p className="text-destructive font-bold uppercase tracking-widest text-sm">Highly Protected Area</p>
          <p className="text-sm text-foreground/70 mt-1 leading-relaxed">
            Modification of bank details and QR codes requires the **Financial Authorization Secret**. 
            This layer prevents unauthorized changes to donation routing even if an admin account is compromised.
          </p>
        </div>
      </div>

      {message && <StatusMessage message={message} />}

      <div className="bg-card border border-border p-8 rounded-xl shadow-md border-l-4 border-l-primary">
        <label htmlFor="secret-code" className="block text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <Key size={16} className="text-primary" />
          Enter Secret Authorization Code
        </label>
        <input id="secret-code" type="password" value={secretCode} onChange={(e) => setSecretCode(e.target.value)}
          placeholder="••••••••••••"
          className="w-full px-5 py-4 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all text-xl tracking-widest" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <form onSubmit={handleSave} className="bg-card border border-border p-8 rounded-xl shadow-sm space-y-6">
          <h2 className="font-serif text-xl text-foreground flex items-center gap-2 border-b border-border pb-3">
            <CreditCard size={20} className="text-primary" />
            Bank Details
          </h2>
          {[
            { key: "bank_name", label: "Bank Name" },
            { key: "bank_account_name", label: "Account Holder" },
            { key: "bank_account_number", label: "Account Number" },
            { key: "bank_ifsc", label: "IFSC Code" },
            { key: "bank_branch", label: "Branch Name" },
            { key: "upi_id", label: "UPI ID / VPA" },
          ].map((f) => (
            <InputField key={f.key} id={`fin-${f.key}`} label={f.label} value={settings[f.key] || ""} onChange={(v) => update(f.key, v)} />
          ))}
          <SubmitButton disabled={saving || !secretCode}>{saving ? "Updating..." : "Update Bank Details"}</SubmitButton>
        </form>

        <form onSubmit={handleQrUpload} className="bg-card border border-border p-8 rounded-xl shadow-sm space-y-6">
          <h2 className="font-serif text-xl text-foreground flex items-center gap-2 border-b border-border pb-3">
            <ImageIcon size={20} className="text-primary" />
            Donation QR Code
          </h2>
          {settings.qr_code_url ? (
            <div className="text-center bg-white p-6 rounded-lg border border-border shadow-inner">
              <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-3">Live QR Code</p>
              <img src={settings.qr_code_url} alt="QR Code" className="mx-auto w-48 h-48 object-contain" />
            </div>
          ) : (
            <div className="aspect-square bg-muted rounded-lg flex flex-col items-center justify-center text-foreground/30 p-8 text-center">
              <ImageIcon size={48} className="mb-4 opacity-20" />
              <p className="text-sm font-medium">No QR Code Deployed</p>
            </div>
          )}
          <div>
            <label htmlFor="qr-file" className="block text-sm font-bold text-foreground mb-3 uppercase tracking-tighter">Upload Replacement</label>
            <input id="qr-file" type="file" accept="image/*" onChange={(e) => setQrFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-foreground/70 file:mr-4 file:py-2 file:px-4 file:border file:border-border file:text-sm file:font-bold file:bg-background file:text-foreground hover:file:bg-card file:cursor-pointer border border-border p-1 rounded" />
          </div>
          <SubmitButton disabled={qrUploading || !qrFile || !secretCode}>{qrUploading ? "Uploading..." : "Deploy QR Code"}</SubmitButton>
        </form>
      </div>
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
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);

  // Form State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [perms, setPerms] = useState({
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
      if (editingAdmin) {
        // Only password change is supported for existing admins via this form
        if (password) {
           const res = await fetch(`/api/admin/users/${editingAdmin.id}/password`, {
             method: "PATCH",
             headers: authHeaders(),
             body: JSON.stringify({ password }),
           });
           if (!res.ok) throw new Error((await res.json()).error || "Update failed");
           setMessage(`Password for ${editingAdmin.username} updated!`);
        }
      } else {
        const res = await fetch("/api/admin/users", {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ username, password, ...perms }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed");
        setMessage(`New admin account "${username}" created!`);
      }
      
      handleCancel();
      fetchAdmins();
    } catch (err: any) { setMessage(err.message); }
  }

  function handleCancel() {
    setEditingAdmin(null);
    setUsername(""); setPassword("");
    setPerms({ canManageAdmins: false, canEditFinancials: false, canEditSiteSettings: true, canEditGallery: true });
  }

  async function handleTogglePerm(adminId: number, perm: string, currentValue: boolean) {
    await fetch(`/api/admin/users/${adminId}`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ [perm]: !currentValue }),
    });
    fetchAdmins();
  }

  async function handleDelete(id: number, username: string) {
    if (!confirm(`Permanently remove admin "${username}"? This will revoke all access immediately.`)) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE", headers: authHeaders() });
    if (!res.ok) { const d = await res.json(); setMessage(d.error || "Delete failed"); return; }
    fetchAdmins();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-5">
        <div className="bg-card border border-border p-8 rounded-xl shadow-sm sticky top-28">
          <h2 className="font-serif text-2xl text-foreground mb-6 flex items-center gap-2">
            {editingAdmin ? <Key size={20} className="text-primary" /> : <Plus size={20} className="text-primary" />}
            {editingAdmin ? `Change Password: ${editingAdmin.username}` : "Add New Administrator"}
          </h2>
          {message && <StatusMessage message={message} />}
          <form onSubmit={handleCreate} className="space-y-6">
            {!editingAdmin && (
              <InputField id="new-username" label="Username" value={username} onChange={setUsername} placeholder="e.g. kcm_admin_1" />
            )}
            <InputField id="new-password" label={editingAdmin ? "New Password" : "Password"} type="password" value={password} onChange={setPassword} placeholder="Minimum 6 characters" />

            {!editingAdmin && (
              <div className="bg-secondary/20 p-6 rounded-lg space-y-4">
                <p className="text-xs font-bold text-foreground/60 uppercase tracking-widest border-b border-border/50 pb-2">Assign Permissions</p>
                {([
                  { key: "canEditGallery", label: "Manage Gallery Content", icon: ImageIcon },
                  { key: "canEditSiteSettings", label: "Edit Address & Contact", icon: Settings },
                  { key: "canEditFinancials", label: "Manage Bank & QR", icon: CreditCard },
                  { key: "canManageAdmins", label: "System Administration", icon: Shield },
                ] as const).map((p) => (
                  <label key={p.key} className="flex items-center justify-between cursor-pointer group p-2 hover:bg-background rounded transition-colors">
                    <div className="flex items-center gap-3">
                      <p.icon size={14} className="text-foreground/40 group-hover:text-primary transition-colors" />
                      <span className="text-xs font-medium text-foreground/80">{p.label}</span>
                    </div>
                    <input type="checkbox" checked={perms[p.key]}
                      onChange={(e) => setPerms((prev) => ({ ...prev, [p.key]: e.target.checked }))}
                      className="w-4 h-4 accent-primary rounded cursor-pointer" />
                  </label>
                ))}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <SubmitButton disabled={(!editingAdmin && !username) || !password}>
                {editingAdmin ? "Reset Password" : "Create Account"}
              </SubmitButton>
              {editingAdmin && (
                <button type="button" onClick={handleCancel} className="flex-1 border border-border text-foreground py-3 font-bold uppercase text-xs hover:bg-card transition-colors rounded-lg">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="lg:col-span-7">
        <h2 className="font-serif text-2xl text-foreground mb-6">Staff Accounts ({adminList.length})</h2>
        {loading ? <p className="text-foreground/40 italic">Loading staff list...</p> : (
          <div className="grid grid-cols-1 gap-4">
            {adminList.map((admin) => (
              <div key={admin.id} className="bg-card border border-border p-6 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-primary/30 transition-all duration-300">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                      {admin.username[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground text-lg">{admin.username}</span>
                        {admin.role === "super_admin" && (
                          <span className="text-[9px] bg-primary text-white font-black px-2 py-0.5 rounded tracking-tighter">ROOT</span>
                        )}
                      </div>
                      <p className="text-[10px] text-foreground/40 uppercase tracking-widest mt-0.5">Administrator ID: #{admin.id}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {([
                      { key: "canEditGallery" as const, label: "Gallery", color: "text-blue-600 bg-blue-50" },
                      { key: "canEditSiteSettings" as const, label: "Settings", color: "text-green-600 bg-green-50" },
                      { key: "canEditFinancials" as const, label: "Financial", color: "text-amber-600 bg-amber-50" },
                      { key: "canManageAdmins" as const, label: "System", color: "text-purple-600 bg-purple-50" },
                    ]).map((p) => (
                      <button key={p.key} onClick={() => admin.role !== "super_admin" && handleTogglePerm(admin.id, p.key, admin[p.key])}
                        disabled={admin.role === "super_admin"}
                        className={`text-[10px] font-bold px-3 py-1 rounded-full transition-all flex items-center gap-1.5 border ${
                          admin[p.key] 
                            ? `${p.color} border-current` 
                            : "bg-muted text-foreground/20 border-transparent grayscale"
                        } ${admin.role === "super_admin" ? "cursor-default" : "cursor-pointer hover:opacity-80 active:scale-95"}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${admin[p.key] ? "bg-current" : "bg-foreground/20"}`}></div>
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
                  {admin.role !== "super_admin" && (
                    <>
                      <button onClick={() => setEditingAdmin(admin)} className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase hover:underline">
                        <Key size={12} /> Reset Password
                      </button>
                      <button onClick={() => handleDelete(admin.id, admin.username)} className="flex items-center gap-2 text-[10px] font-bold text-destructive uppercase hover:underline">
                        <Trash2 size={12} /> Terminate
                      </button>
                    </>
                  )}
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
// SHARED UI COMPONENTS
// ═════════════════════════════════════════════════════════════════════

function InputField({ id, label, value, onChange, type = "text", placeholder }: {
  id: string; label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-bold text-foreground/80 uppercase tracking-tight ml-1">{label}</label>
      <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-4 py-3 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-foreground/20" />
    </div>
  );
}

function SubmitButton({ children, disabled, icon: Icon }: { children: React.ReactNode; disabled?: boolean; icon?: any }) {
  return (
    <button type="submit" disabled={disabled}
      className="w-full bg-primary text-primary-foreground py-4 px-6 rounded-lg font-bold tracking-widest uppercase text-xs hover:bg-primary/90 hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm">
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

function StatusMessage({ message }: { message: string }) {
  const isSuccess = message.toLowerCase().includes("success") || message.toLowerCase().includes("updated") || message.toLowerCase().includes("created") || message.toLowerCase().includes("deployed");
  return (
    <div className={`text-xs font-bold px-5 py-4 rounded-lg mb-6 flex items-center gap-3 animate-in fade-in zoom-in duration-300 ${isSuccess
      ? "bg-green-500/10 border border-green-500/30 text-green-700"
      : "bg-destructive/10 border border-destructive/30 text-destructive"
    }`}>
      <div className={`w-2 h-2 rounded-full ${isSuccess ? "bg-green-600" : "bg-destructive"} animate-pulse`}></div>
      {message}
    </div>
  );
}
