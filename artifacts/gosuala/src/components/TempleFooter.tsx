import React from "react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export function TempleFooter() {
  const { t } = useLanguage();

  return (
    <footer className="bg-foreground text-background/80 pt-16 pb-8 border-t-[8px] border-primary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <svg width="32" height="32" viewBox="0 0 100 100" className="text-primary">
                <path d="M50 5C50 5 80 40 80 70C80 86.5685 66.5685 100 50 100C33.4315 100 20 86.5685 20 70C20 40 50 5 50 5Z" fill="currentColor" opacity="0.8"/>
              </svg>
              <span className="font-serif text-3xl font-semibold tracking-wide text-background">
                {t("Gosuala")}
              </span>
            </div>
            <p className="max-w-xs leading-relaxed opacity-80">
              A sacred sanctuary dedicated to the eternal welfare of cows and preserving the spiritual heritage of Karnataka.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="font-serif text-xl text-primary">{t("Contact")}</h3>
            <address className="not-italic opacity-80 space-y-2">
              <p>Sri Gosuala Temple Road</p>
              <p>Mysuru District, Karnataka</p>
              <p>India - 570001</p>
              <p className="pt-2">contact@gosuala.org</p>
              <p>+91 98765 43210</p>
            </address>
          </div>

          <div className="space-y-6">
            <h3 className="font-serif text-xl text-primary">Links</h3>
            <ul className="space-y-3 opacity-80">
              <li><Link href="/" className="hover:text-primary transition-colors">{t("Home")}</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">{t("About Us")}</Link></li>
              <li><Link href="/gallery" className="hover:text-primary transition-colors">{t("Gallery")}</Link></li>
              <li><Link href="/donate" className="hover:text-primary transition-colors">{t("Make a Donation")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-60">
          <p>&copy; {new Date().getFullYear()} {t("Gosuala")}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
