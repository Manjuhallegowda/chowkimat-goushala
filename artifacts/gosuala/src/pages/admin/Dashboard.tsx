import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { Pencil, Trash2, Shield, Image as ImageIcon, CreditCard, Settings, Plus, Save, X, Key, Layout, LogOut, Menu, UserCircle, History } from "lucide-react";

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

type Tab = "gallery" | "hero" | "settings" | "financial" | "admins" | "logs";

// ── Component ───────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const perms = getPerms();
  const [tab, setTab] = useState<Tab>("hero");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!getToken()) setLocation("/admin");
  }, [setLocation]);

  function handleLogout() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_perms");
    setLocation("/admin");
  }

  const tabs: { key: Tab; label: string; icon: any; show: boolean }[] = [
    { key: "hero", label: "Hero", icon: Layout, show: perms.canEditSiteSettings },
    { key: "gallery", label: "Gallery", icon: ImageIcon, show: perms.canEditGallery },
    { key: "settings", label: "Settings", icon: Settings, show: perms.canEditSiteSettings },
    { key: "financial", label: "Financial", icon: CreditCard, show: perms.canEditFinancials },
    { key: "admins", label: "Admins", icon: Shield, show: perms.canManageAdmins },
    { key: "logs", label: "Login Logs", icon: History, show: perms.canManageAdmins },
  ];

  const activeTab = tabs.find(t => t.key === tab);

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-border z-50 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-serif font-bold text-sm">KC</div>
          <span className="font-serif font-bold text-primary">Admin</span>
        </div>
        <button onClick={handleLogout} className="p-2 text-destructive hover:bg-destructive/10 rounded-full transition-colors">
          <LogOut size={20} />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-border flex-col sticky top-0 h-screen z-40">
        <div className="p-6 border-b border-border">
          <h1 className="font-serif text-2xl text-primary font-bold tracking-tight">Chowkimat</h1>
          <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold mt-1">Admin Dashboard</p>
        </div>
        
        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          {tabs.filter(t => t.show).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                tab === t.key
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-foreground/60 hover:bg-primary/5 hover:text-primary"
              }`}
            >
              <t.icon size={18} />
              {t.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/5 transition-all">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50 flex items-center justify-around h-16 px-2 safe-area-pb">
        {tabs.filter(t => t.show).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex flex-col items-center justify-center flex-1 gap-1 h-full transition-all duration-200 ${
              tab === t.key ? "text-primary" : "text-foreground/40"
            }`}
          >
            <t.icon size={20} className={tab === t.key ? "scale-110" : ""} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">{t.label}</span>
            {tab === t.key && <div className="absolute bottom-0 w-12 h-1 bg-primary rounded-t-full" />}
          </button>
        ))}
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow pt-20 pb-20 lg:pt-0 lg:pb-0 min-h-screen">
        <header className="hidden lg:flex items-center justify-between p-8 bg-white/50 backdrop-blur-sm border-b border-border sticky top-0 z-30">
          <div>
            <h2 className="font-serif text-3xl text-foreground font-bold">{activeTab?.label}</h2>
            <p className="text-sm text-foreground/50 mt-1">Manage your temple's {activeTab?.label.toLowerCase()} efficiently</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
               <p className="text-xs font-bold text-foreground">Logged in as</p>
               <p className="text-[10px] text-primary uppercase tracking-widest font-black">Administrator</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
               <UserCircle size={24} />
             </div>
          </div>
        </header>

        {/* Page Header for Mobile */}
        <div className="lg:hidden px-4 pt-4 mb-4">
          <h2 className="font-serif text-2xl text-foreground font-bold">{activeTab?.label}</h2>
          <div className="h-1 w-12 bg-primary rounded-full mt-2" />
        </div>

        <div className="p-4 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="max-w-6xl mx-auto">
            {tab === "gallery" && perms.canEditGallery && <GalleryManager />}
            {tab === "hero" && perms.canEditSiteSettings && <HeroManager />}
            {tab === "settings" && perms.canEditSiteSettings && <SiteSettingsManager />}
            { tab === "financial" && perms.canEditFinancials && <FinancialSettingsManager /> }
            { tab === "admins" && perms.canManageAdmins && <AdminManager /> }
            { tab === "logs" && perms.canManageAdmins && <LoginLogsViewer /> }
          </div>
        </div>
      </main>
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      <div className="lg:col-span-4">
        <div className="bg-white border border-border p-6 lg:p-8 rounded-2xl shadow-sm lg:sticky lg:top-32">
          <h2 className="font-serif text-2xl text-foreground mb-6 flex items-center gap-2">
            {editingImage ? <Pencil size={20} className="text-primary" /> : <Plus size={20} className="text-primary" />}
            {editingImage ? "Edit Details" : "New Image"}
          </h2>
          {message && <StatusMessage message={message} />}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!editingImage && (
              <div>
                <label htmlFor="gallery-file" className="block text-xs font-bold text-foreground/40 uppercase tracking-widest mb-2">Image File</label>
                <div className="relative">
                  <input id="gallery-file" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} required className="w-full text-xs text-foreground/70 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:transition-colors file:cursor-pointer rounded-xl border border-border p-2 bg-background/50" />
                </div>
              </div>
            )}
            {editingImage && (
              <div className="aspect-video relative rounded-xl overflow-hidden border border-border mb-4 shadow-inner bg-muted">
                <img src={editingImage.url} alt={editingImage.alt} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2 text-white text-[9px] px-2 py-1 bg-primary rounded uppercase font-black tracking-widest">Active Image</div>
              </div>
            )}
            <InputField id="gallery-alt" label="Alt Text (SEO)" value={alt} onChange={setAlt} placeholder="Describe this photo..." />
            <div>
              <label htmlFor="gallery-aspect" className="block text-xs font-bold text-foreground/40 uppercase tracking-widest mb-2">Aspect Ratio</label>
              <select id="gallery-aspect" value={aspect} onChange={(e) => setAspect(e.target.value)} className="w-full px-4 py-3 border border-border bg-background/50 text-foreground rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium">
                <option value="aspect-square">Square (1:1)</option>
                <option value="aspect-video">Video (16:9)</option>
                <option value="aspect-[3/4]">Portrait (3:4)</option>
                <option value="aspect-[4/3]">Landscape (4:3)</option>
              </select>
            </div>
            <InputField id="gallery-sort" label="Display Order" type="number" value={String(sortOrder)} onChange={(v) => setSortOrder(parseInt(v, 10) || 0)} />
            
            <div className="flex gap-3 pt-4">
              <SubmitButton disabled={uploading || (!editingImage && !file)}>
                {uploading ? "Processing..." : editingImage ? "Save Changes" : "Upload Image"}
              </SubmitButton>
              {editingImage && (
                <button type="button" onClick={handleCancel} className="flex-1 border border-border text-foreground py-3 font-bold uppercase text-[10px] tracking-widest hover:bg-background transition-all rounded-xl active:scale-95">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      <div className="lg:col-span-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl lg:text-3xl text-foreground font-bold">Current Gallery</h2>
            <p className="text-xs text-foreground/40 mt-1 uppercase tracking-widest font-bold">{images.length} assets deployed</p>
          </div>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-foreground/20 italic">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest">Loading assets...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-24 bg-white border-2 border-dashed border-border rounded-3xl">
            <ImageIcon size={48} className="mx-auto text-foreground/10 mb-4" />
            <p className="text-foreground/40 italic font-medium">The gallery is currently empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {images.map((img) => (
              <div key={img.id} className="bg-white border border-border rounded-2xl overflow-hidden group hover:shadow-xl hover:border-primary/20 transition-all duration-500">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 backdrop-blur-[2px]">
                    <button onClick={() => handleEdit(img)} className="bg-white text-primary p-4 rounded-2xl hover:bg-primary hover:text-white transition-all transform translate-y-8 group-hover:translate-y-0 duration-500 shadow-xl active:scale-90">
                      <Pencil size={20} />
                    </button>
                    <button onClick={() => handleDelete(img.id)} className="bg-white text-destructive p-4 rounded-2xl hover:bg-destructive hover:text-white transition-all transform translate-y-8 group-hover:translate-y-0 duration-500 shadow-xl active:scale-90 delay-75">
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <div className="absolute top-3 left-3 px-3 py-1 bg-black/50 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest rounded-full border border-white/20">
                    Order {img.sortOrder}
                  </div>
                </div>
                <div className="p-5 bg-white border-t border-border/50">
                  <p className="text-sm font-bold text-foreground truncate mb-2">{img.alt || "No description"}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] px-3 py-1 bg-primary/5 text-primary font-black uppercase tracking-widest rounded-full">{img.aspect.replace("aspect-", "").replace("[", "").replace("]", "")}</span>
                    <span className="text-[10px] text-foreground/30 font-bold uppercase tracking-tighter">ID: #{img.id}</span>
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
    <div className="max-w-4xl">
      <div className="mb-8 lg:mb-12">
        <h2 className="font-serif text-2xl lg:text-3xl text-foreground font-bold">Temple Settings</h2>
        <p className="text-xs text-foreground/40 mt-1 uppercase tracking-widest font-black italic">Public Identity & Contact Information</p>
      </div>
      
      {message && <StatusMessage message={message} />}
      
      <form onSubmit={handleSave} className="space-y-8 lg:space-y-12">
        {groups.map((group) => (
          <div key={group.label} className="bg-white border border-border p-6 lg:p-10 rounded-3xl shadow-sm">
            <h3 className="text-xs font-black text-primary mb-8 uppercase tracking-[0.3em] border-b border-primary/10 pb-4">{group.label}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              {group.fields.map((f) => (
                <div key={f.key} className={f.key === "map_embed_url" ? "md:col-span-2" : ""}>
                  <InputField id={`setting-${f.key}`} label={f.label} value={settings[f.key] || ""} onChange={(v) => update(f.key, v)} placeholder={`Enter ${f.label.toLowerCase()}...`} />
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="max-w-xs ml-auto">
          <SubmitButton disabled={saving} icon={Save}>{saving ? "Synchronizing..." : "Update All Settings"}</SubmitButton>
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

  return (
    <div className="max-w-4xl space-y-12">
      <div className="bg-destructive/5 border border-destructive/20 p-6 lg:p-8 rounded-3xl flex items-start gap-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-destructive/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
        <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive shrink-0 shadow-sm border border-destructive/10">
          <Shield size={24} />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-destructive mb-1">High Security Vault</p>
          <p className="text-sm text-foreground/70 leading-relaxed font-medium">
            Sensitive financial data is protected by a secondary authorization layer. Changes to bank accounts or QR codes require the master secret code to prevent unauthorized redirection of donations.
          </p>
        </div>
      </div>

      {message && <StatusMessage message={message} />}

      <div className="bg-white border border-border p-6 lg:p-10 rounded-3xl shadow-md border-t-4 border-t-primary relative">
        <label htmlFor="secret-code" className="block text-[10px] font-black text-foreground/40 mb-4 flex items-center gap-2 uppercase tracking-[0.2em]">
          <Key size={14} className="text-primary" />
          Master Authorization Secret
        </label>
        <input id="secret-code" type="password" value={secretCode} onChange={(e) => setSecretCode(e.target.value)}
          placeholder="••••••••••••"
          className="w-full px-6 py-5 border border-border bg-background/50 text-foreground rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-2xl tracking-[0.5em] font-black placeholder:tracking-normal placeholder:text-foreground/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <form onSubmit={handleSave} className="bg-white border border-border p-6 lg:p-10 rounded-3xl shadow-sm space-y-8">
          <h2 className="font-serif text-xl lg:text-2xl text-foreground font-bold flex items-center gap-3 border-b border-border/50 pb-5">
            <CreditCard size={24} className="text-primary" />
            Bank Assets
          </h2>
          <div className="space-y-6">
            {[
              { key: "bank_name", label: "Bank Name" },
              { key: "bank_account_name", label: "Legal Holder" },
              { key: "bank_account_number", label: "Account No." },
              { key: "bank_ifsc", label: "IFSC Code" },
              { key: "bank_branch", label: "Branch Name" },
              { key: "upi_id", label: "UPI VPA" },
            ].map((f) => (
              <InputField key={f.key} id={`fin-${f.key}`} label={f.label} value={settings[f.key] || ""} onChange={(v) => update(f.key, v)} placeholder={`Enter ${f.label.toLowerCase()}...`} />
            ))}
          </div>
          <SubmitButton disabled={saving || !secretCode} icon={Save}>{saving ? "Updating..." : "Authorize & Save"}</SubmitButton>
        </form>

        <form onSubmit={handleQrUpload} className="bg-white border border-border p-6 lg:p-10 rounded-3xl shadow-sm space-y-8 flex flex-col">
          <h2 className="font-serif text-xl lg:text-2xl text-foreground font-bold flex items-center gap-3 border-b border-border/50 pb-5">
            <ImageIcon size={24} className="text-primary" />
            Donation QR
          </h2>
          <div className="flex-grow flex flex-col justify-center py-6">
            {settings.qr_code_url ? (
              <div className="text-center bg-[#FDFCFB] p-8 rounded-3xl border border-border shadow-inner relative group/qr">
                <p className="text-[9px] uppercase tracking-widest text-foreground/30 font-black mb-4">Active Deployment</p>
                <div className="relative inline-block">
                  <img src={settings.qr_code_url} alt="QR Code" className="mx-auto w-56 h-56 object-contain group-hover/qr:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/qr:opacity-100 transition-opacity pointer-events-none" />
                </div>
              </div>
            ) : (
              <div className="aspect-square bg-muted/30 rounded-3xl flex flex-col items-center justify-center text-foreground/20 p-12 text-center border-2 border-dashed border-border">
                <ImageIcon size={64} className="mb-4 opacity-10" />
                <p className="text-xs font-black uppercase tracking-widest">No QR Deployed</p>
              </div>
            )}
          </div>
          <div className="pt-4 border-t border-border/50">
            <label htmlFor="qr-file" className="block text-[10px] font-black text-foreground/40 mb-3 uppercase tracking-widest">Replace Asset</label>
            <input id="qr-file" type="file" accept="image/*" onChange={(e) => setQrFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-foreground/70 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer border border-border p-2 rounded-xl bg-background/50 mb-6" />
            <SubmitButton disabled={qrUploading || !qrFile || !secretCode} icon={Plus}>{qrUploading ? "Uploading..." : "Deploy New QR"}</SubmitButton>
          </div>
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
        if (password) {
           const res = await fetch(`/api/admin/users/${editingAdmin.id}/password`, {
             method: "PATCH",
             headers: authHeaders(),
             body: JSON.stringify({ password }),
           });
           if (!res.ok) throw new Error((await res.json()).error || "Update failed");
           setMessage(`Credentials for ${editingAdmin.username} updated!`);
        }
      } else {
        const res = await fetch("/api/admin/users", {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ username, password, ...perms }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed");
        setMessage(`New staff account "${username}" provisioned!`);
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
    if (!confirm(`Permanently terminate admin "${username}"? This will revoke all access immediately.`)) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE", headers: authHeaders() });
    if (!res.ok) { const d = await res.json(); setMessage(d.error || "Action failed"); return; }
    fetchAdmins();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      <div className="lg:col-span-5">
        <div className="bg-white border border-border p-6 lg:p-8 rounded-3xl shadow-sm lg:sticky lg:top-32">
          <h2 className="font-serif text-2xl text-foreground mb-6 flex items-center gap-2">
            {editingAdmin ? <Key size={20} className="text-primary" /> : <Plus size={20} className="text-primary" />}
            {editingAdmin ? "Reset Password" : "New Administrator"}
          </h2>
          {message && <StatusMessage message={message} />}
          <form onSubmit={handleCreate} className="space-y-6">
            {!editingAdmin && (
              <InputField id="new-username" label="Username" value={username} onChange={setUsername} placeholder="e.g. kcm_admin_1" />
            )}
            <InputField id="new-password" label={editingAdmin ? "New Credentials" : "Password"} type="password" value={password} onChange={setPassword} placeholder="Minimum 6 characters" />

            {!editingAdmin && (
              <div className="bg-background/40 p-5 rounded-2xl border border-border/50 space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 border-b border-border/20 pb-3">Access Control Permissions</p>
                {([
                  { key: "canEditGallery", label: "Gallery Management", icon: ImageIcon },
                  { key: "canEditSiteSettings", label: "Site Metadata & Identity", icon: Settings },
                  { key: "canEditFinancials", label: "Financial Data & QR", icon: CreditCard },
                  { key: "canManageAdmins", label: "Root System Administration", icon: Shield },
                ] as const).map((p) => (
                  <label key={p.key} className="flex items-center justify-between cursor-pointer group px-1">
                    <div className="flex items-center gap-3">
                      <p.icon size={14} className="text-foreground/30 group-hover:text-primary transition-colors" />
                      <span className="text-xs font-bold text-foreground/60">{p.label}</span>
                    </div>
                    <div className={`w-8 h-4 rounded-full transition-colors relative ${perms[p.key] ? "bg-primary" : "bg-foreground/10"}`}>
                      <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${perms[p.key] ? "left-4.5" : "left-0.5"}`} />
                    </div>
                    <input type="checkbox" checked={perms[p.key]}
                      onChange={(e) => setPerms((prev) => ({ ...prev, [p.key]: e.target.checked }))}
                      className="hidden" />
                  </label>
                ))}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <SubmitButton disabled={(!editingAdmin && !username) || !password} icon={editingAdmin ? Key : Plus}>
                {editingAdmin ? "Update Security" : "Provision Account"}
              </SubmitButton>
              {editingAdmin && (
                <button type="button" onClick={handleCancel} className="flex-1 border border-border text-foreground py-3 font-bold uppercase text-[10px] tracking-widest hover:bg-background transition-all rounded-xl active:scale-95">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="lg:col-span-7">
        <h2 className="font-serif text-2xl lg:text-3xl text-foreground font-bold mb-8">System Administrators</h2>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-foreground/20 italic">
            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
            <p className="text-xs font-black uppercase tracking-widest">Fetching Personnel...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {adminList.map((admin) => (
              <div key={admin.id} className="bg-white border border-border p-6 rounded-3xl shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-8 hover:border-primary/20 transition-all duration-300">
                <div className="flex-grow">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-serif font-black text-xl shadow-inner border border-primary/10">
                      {admin.username[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-xl font-bold text-foreground">{admin.username}</span>
                        {admin.role === "super_admin" && (
                          <span className="text-[8px] bg-primary/10 text-primary border border-primary/20 font-black px-2 py-0.5 rounded uppercase tracking-tighter">System Root</span>
                        )}
                      </div>
                      <p className="text-[10px] text-foreground/30 uppercase tracking-[0.2em] font-black mt-1">Staff Access Level</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {([
                      { key: "canEditGallery" as const, label: "Gallery", color: "text-blue-600 bg-blue-50 border-blue-200" },
                      { key: "canEditSiteSettings" as const, label: "Metadata", color: "text-green-600 bg-green-50 border-green-200" },
                      { key: "canEditFinancials" as const, label: "Financial", color: "text-amber-600 bg-amber-50 border-amber-200" },
                      { key: "canManageAdmins" as const, label: "Systems", color: "text-purple-600 bg-purple-50 border-purple-200" },
                    ]).map((p) => (
                      <button key={p.key} onClick={() => admin.role !== "super_admin" && handleTogglePerm(admin.id, p.key, admin[p.key])}
                        disabled={admin.role === "super_admin"}
                        className={`text-[9px] font-black px-3 py-1 rounded-full transition-all flex items-center gap-2 border ${
                          admin[p.key] 
                            ? `${p.color} shadow-sm shadow-current/5` 
                            : "bg-muted text-foreground/20 border-transparent grayscale opacity-50"
                        } ${admin.role === "super_admin" ? "cursor-default" : "cursor-pointer hover:scale-105 active:scale-95"}`}>
                        <div className={`w-1 h-1 rounded-full ${admin[p.key] ? "bg-current shadow-[0_0_4px_currentColor]" : "bg-foreground/20"}`} />
                        {p.label.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-6 lg:flex-col lg:items-end lg:gap-3 lg:border-l lg:border-border/50 lg:pl-8">
                  {admin.role !== "super_admin" && (
                    <>
                      <button onClick={() => setEditingAdmin(admin)} className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest hover:text-primary/70 transition-colors group">
                        <Key size={14} className="group-hover:rotate-12 transition-transform" /> Reset
                      </button>
                      <button onClick={() => handleDelete(admin.id, admin.username)} className="flex items-center gap-2 text-[10px] font-black text-destructive uppercase tracking-widest hover:text-destructive/70 transition-colors group">
                        <Trash2 size={14} className="group-hover:shake" /> Terminate
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
// LOGIN LOGS VIEWER
// ═════════════════════════════════════════════════════════════════════

function LoginLogsViewer() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/login-logs", { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => setLogs(d.logs || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h2 className="font-serif text-2xl lg:text-3xl text-foreground font-bold mb-2">Login History</h2>
        <p className="text-xs text-foreground/40 uppercase tracking-widest font-bold">Recent administrator logins</p>
      </div>

      <div className="bg-white border border-border rounded-3xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-foreground/20 italic">
            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
            <p className="text-xs font-black uppercase tracking-widest">Fetching Logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-foreground/40 italic">No login records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b border-border/50 text-[10px] uppercase tracking-widest font-black text-foreground/40">
                  <th className="p-4 pl-6">Admin</th>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">IP Address</th>
                  <th className="p-4">Location</th>
                  <th className="p-4 pr-6">Browser/Device</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-border/50 last:border-0 hover:bg-muted/10 transition-colors">
                    <td className="p-4 pl-6 font-bold text-foreground">{log.username || `ID: ${log.adminId}`}</td>
                    <td className="p-4 text-foreground/60 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4 font-mono text-xs text-primary/80">{log.ipAddress || "Unknown"}</td>
                    <td className="p-4 text-foreground/70">{log.location || "Unknown"}</td>
                    <td className="p-4 pr-6 text-xs text-foreground/50 max-w-[200px] truncate" title={log.userAgent}>
                      {log.userAgent || "Unknown"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════
// HERO MANAGER
// ═════════════════════════════════════════════════════════════════════

function HeroManager() {
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingSlide, setEditingSlide] = useState<any>(null);
  const [message, setMessage] = useState("");

  // Form State
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showLogo, setShowLogo] = useState(true);
  const [btnPrimaryText, setBtnPrimaryText] = useState("Make a Donation");
  const [btnPrimaryLink, setBtnPrimaryLink] = useState("/donate");
  const [btnSecondaryText, setBtnSecondaryText] = useState("About Us");
  const [btnSecondaryLink, setBtnSecondaryLink] = useState("/about");
  const [sortOrder, setSortOrder] = useState(0);

  const fetchSlides = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/hero-slides", { headers: authHeaders() });
      const data = await res.json();
      setSlides(data.slides || []);
    } catch { /* ignore */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchSlides(); }, [fetchSlides]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setMessage("");
    try {
      if (editingSlide) {
        const res = await fetch(`/api/admin/hero-slides/${editingSlide.id}`, {
          method: "PATCH", headers: authHeaders(),
          body: JSON.stringify({ title, description, showLogo, btnPrimaryText, btnPrimaryLink, btnSecondaryText, btnSecondaryLink, sortOrder }),
        });
        if (!res.ok) throw new Error("Update failed");
        setMessage("Slide content updated!");
      } else {
        if (!file) return;
        const fd = new FormData();
        fd.append("file", file); fd.append("title", title);
        fd.append("description", description); fd.append("showLogo", String(showLogo));
        fd.append("btnPrimaryText", btnPrimaryText); fd.append("btnPrimaryLink", btnPrimaryLink);
        fd.append("btnSecondaryText", btnSecondaryText); fd.append("btnSecondaryLink", btnSecondaryLink);
        fd.append("sortOrder", String(sortOrder));
        const res = await fetch("/api/admin/hero-slides", {
          method: "POST", headers: { Authorization: `Bearer ${getToken()}` },
          body: fd,
        });
        if (!res.ok) throw new Error("Upload failed");
        setMessage("New slide deployed!");
      }
      handleCancel(); fetchSlides();
    } catch (err: any) { setMessage(err.message); } finally { setSaving(false); }
  }

  function handleEdit(slide: any) {
    setEditingSlide(slide);
    setTitle(slide.title || "");
    setDescription(slide.description || "");
    setShowLogo(slide.showLogo);
    setBtnPrimaryText(slide.btnPrimaryText); setBtnPrimaryLink(slide.btnPrimaryLink);
    setBtnSecondaryText(slide.btnSecondaryText); setBtnSecondaryLink(slide.btnSecondaryLink);
    setSortOrder(slide.sortOrder);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancel() {
    setEditingSlide(null); setFile(null); setTitle(""); setDescription(""); setShowLogo(true);
    setBtnPrimaryText("Make a Donation"); setBtnPrimaryLink("/donate");
    setBtnSecondaryText("About Us"); setBtnSecondaryLink("/about");
    setSortOrder(0);
    const fi = document.getElementById("hero-file") as HTMLInputElement;
    if (fi) fi.value = "";
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this slide permanently?")) return;
    await fetch(`/api/admin/hero-slides/${id}`, { method: "DELETE", headers: authHeaders() });
    fetchSlides();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      <div className="lg:col-span-5">
        <div className="bg-white border border-border p-6 lg:p-8 rounded-2xl shadow-sm lg:sticky lg:top-32">
          <h2 className="font-serif text-2xl text-foreground mb-6 flex items-center gap-2">
            {editingSlide ? <Pencil size={20} className="text-primary" /> : <Plus size={20} className="text-primary" />}
            {editingSlide ? "Edit Slide" : "New Hero Slide"}
          </h2>
          {message && <StatusMessage message={message} />}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!editingSlide && (
              <div className="mb-2">
                <label className="block text-xs font-bold text-foreground/40 uppercase tracking-widest mb-2">Background Image</label>
                <input id="hero-file" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} required className="w-full text-xs text-foreground/70 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:transition-colors file:cursor-pointer rounded-xl border border-border p-2 bg-background/50" />
              </div>
            )}
            <InputField id="hero-title" label="Main Heading" value={title} onChange={setTitle} placeholder="e.g. Welcome to the Sanctuary" />
            <div className="space-y-2">
              <label className="block text-xs font-bold text-foreground/40 uppercase tracking-widest mb-2">Description / Mission</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-4 py-3 border border-border bg-background/50 text-foreground rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium" placeholder="A short description..." />
            </div>
            
            <div className="bg-background/40 p-4 rounded-xl border border-border/50 space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Button Configuration</p>
              <div className="grid grid-cols-2 gap-4">
                <InputField id="btn1-t" label="Btn 1 Text" value={btnPrimaryText} onChange={setBtnPrimaryText} />
                <InputField id="btn1-l" label="Btn 1 Link" value={btnPrimaryLink} onChange={setBtnPrimaryLink} />
                <InputField id="btn2-t" label="Btn 2 Text" value={btnSecondaryText} onChange={setBtnSecondaryText} />
                <InputField id="btn2-l" label="Btn 2 Link" value={btnSecondaryLink} onChange={setBtnSecondaryLink} />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 px-1">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-10 h-6 rounded-full transition-colors relative ${showLogo ? "bg-primary" : "bg-foreground/20"}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${showLogo ? "left-5" : "left-1"}`} />
                </div>
                <input type="checkbox" checked={showLogo} onChange={(e) => setShowLogo(e.target.checked)} className="hidden" />
                <span className="text-xs font-bold text-foreground/70 uppercase tracking-widest">Show Logo</span>
              </label>
              <div className="w-24">
                <InputField id="hero-sort" label="Order" type="number" value={String(sortOrder)} onChange={(v) => setSortOrder(parseInt(v) || 0)} />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <SubmitButton disabled={saving || (!editingSlide && !file)}>{saving ? "Processing..." : editingSlide ? "Save Changes" : "Create Slide"}</SubmitButton>
              {editingSlide && <button type="button" onClick={handleCancel} className="flex-1 border border-border text-foreground py-3 font-bold uppercase text-[10px] tracking-widest hover:bg-background transition-all rounded-xl active:scale-95">Cancel</button>}
            </div>
          </form>
        </div>
      </div>
      <div className="lg:col-span-7">
        <h2 className="font-serif text-2xl lg:text-3xl text-foreground font-bold mb-8">Active Slides</h2>
        <div className="grid grid-cols-1 gap-6">
          {slides.map((s: any) => (
            <div key={s.id} className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="relative w-full sm:w-40 aspect-video rounded-xl overflow-hidden shadow-inner bg-muted shrink-0">
                  <img src={s.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Order {s.sortOrder}</div>
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="font-serif text-lg font-bold text-foreground truncate mb-1">{s.title || "Untitled Slide"}</h4>
                  <p className="text-xs text-foreground/50 line-clamp-2 leading-relaxed mb-3">{s.description || "No mission description defined for this slide."}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-primary/10 text-primary rounded border border-primary/20">{s.btnPrimaryText}</span>
                    <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-foreground/5 text-foreground/60 rounded border border-foreground/10">{s.btnSecondaryText}</span>
                  </div>
                </div>
                <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                  <button onClick={() => handleEdit(s)} className="flex-1 sm:flex-initial p-3 text-primary hover:bg-primary/10 rounded-xl transition-colors border border-transparent hover:border-primary/20"><Pencil size={18} /></button>
                  <button onClick={() => handleDelete(s.id)} className="flex-1 sm:flex-initial p-3 text-destructive hover:bg-destructive/10 rounded-xl transition-colors border border-transparent hover:border-destructive/20"><Trash2 size={18} /></button>
                </div>
              </div>
            </div>
          ))}
          {slides.length === 0 && (
            <div className="text-center py-24 bg-white border-2 border-dashed border-border rounded-3xl">
              <Layout size={48} className="mx-auto text-foreground/10 mb-4" />
              <p className="text-foreground/40 italic font-medium">No slides configured. Default content active.</p>
            </div>
          )}
        </div>
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
      <label htmlFor={id} className="block text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em] ml-1">{label}</label>
      <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-4 py-3.5 border border-border bg-background/50 text-foreground rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-foreground/10 text-sm font-medium" />
    </div>
  );
}

function SubmitButton({ children, disabled, icon: Icon }: { children: React.ReactNode; disabled?: boolean; icon?: any }) {
  return (
    <button type="submit" disabled={disabled}
      className="group w-full bg-primary text-white py-4 px-6 rounded-xl font-black tracking-[0.2em] uppercase text-[10px] hover:bg-primary/90 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
      {Icon && <Icon size={16} className="group-hover:rotate-12 transition-transform" />}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

function StatusMessage({ message }: { message: string }) {
  const isSuccess = message.toLowerCase().includes("success") || message.toLowerCase().includes("updated") || message.toLowerCase().includes("created") || message.toLowerCase().includes("deployed") || message.toLowerCase().includes("provisioned");
  return (
    <div className={`text-[10px] font-black uppercase tracking-widest px-6 py-4 rounded-2xl mb-8 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500 shadow-sm border ${isSuccess
      ? "bg-emerald-50 border-emerald-100 text-emerald-600"
      : "bg-rose-50 border-rose-100 text-rose-600"
    }`}>
      <div className={`w-2 h-2 rounded-full ${isSuccess ? "bg-emerald-500 shadow-[0_0_8px_theme(colors.emerald.500)]" : "bg-rose-500 shadow-[0_0_8px_theme(colors.rose.500)]"} animate-pulse`} />
      {message}
    </div>
  );
}
