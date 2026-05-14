import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionDivider, DecorativeBorder } from "@/components/SectionDivider";
import { motion } from "framer-motion";

export default function Contact() {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<Record<string, string>>({
    address_line1: "Sri Gosuala Temple Road",
    address_line2: "Near Ancient Stone Pillar",
    address_city: "Mysuru District, Karnataka",
    address_pincode: "570001",
    address_country: "India",
    contact_phone: "+91 98765 43210",
    contact_email: "contact@gosuala.org",
    contact_hours: "6:00 AM - 6:00 PM (Daily)",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => { if (d.settings) setSettings((prev) => ({ ...prev, ...d.settings })); })
      .catch(() => { /* keep defaults */ });
  }, []);

  return (
    <div className="w-full pt-24 pb-16">
      <DecorativeBorder />
      
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="font-serif text-5xl md:text-6xl text-primary mb-6">
              {t("Get in Touch")}
            </h1>
            <p className="text-xl font-serif text-foreground/80 leading-relaxed max-w-2xl mx-auto">
              We welcome visitors, volunteers, and well-wishers to our sanctuary. Reach out to us for inquiries regarding donations, visits, or special pujas.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16">
            
            {/* Contact Info */}
            <div className="space-y-12">
              <div>
                <h3 className="font-serif text-2xl text-primary mb-4">{t("Address")}</h3>
                <address className="not-italic text-foreground/80 space-y-2 text-lg">
                  {settings.address_line1 && <p>{settings.address_line1}</p>}
                  {settings.address_line2 && <p>{settings.address_line2}</p>}
                  {settings.address_city && <p>{settings.address_city}</p>}
                  <p>{settings.address_country}{settings.address_pincode ? ` - ${settings.address_pincode}` : ""}</p>
                </address>
              </div>

              <div>
                <h3 className="font-serif text-2xl text-primary mb-4">Contact Details</h3>
                <div className="text-foreground/80 space-y-2 text-lg">
                  {settings.contact_phone && <p><span className="font-medium">Phone:</span> {settings.contact_phone}</p>}
                  {settings.contact_email && <p><span className="font-medium">Email:</span> {settings.contact_email}</p>}
                  {settings.contact_hours && <p><span className="font-medium">Hours:</span> {settings.contact_hours}</p>}
                </div>
              </div>

              {/* Map */}
              {settings.map_embed_url ? (
                <iframe
                  src={settings.map_embed_url}
                  className="w-full h-64 border border-border"
                  loading="lazy"
                  allowFullScreen
                  title="Temple Location"
                />
              ) : (
                <div className="w-full h-64 bg-card border border-border flex items-center justify-center text-foreground/40 font-serif">
                  Map Embed Placeholder
                </div>
              )}
            </div>

            {/* Contact Form */}
            <div className="bg-card p-8 border border-border">
              <h2 className="font-serif text-3xl text-foreground mb-8">{t("Send Message")}</h2>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">{t("Name")}</label>
                  <input 
                    type="text" 
                    className="w-full bg-background border border-border p-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">{t("Email")}</label>
                  <input 
                    type="email" 
                    className="w-full bg-background border border-border p-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Subject</label>
                  <input 
                    type="text" 
                    className="w-full bg-background border border-border p-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">{t("Message")}</label>
                  <textarea 
                    rows={5}
                    className="w-full bg-background border border-border p-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 font-medium tracking-widest uppercase transition-all mt-2"
                >
                  {t("Submit")}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
