import React from "react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import logoImg from "@assets/kcm_1778773778796.webp";

export function TempleFooter() {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-foreground text-background/80 pt-12 pb-6 border-t-[6px] border-primary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={logoImg}
                alt="Shree Kalyan Chowkimath Kamadhenu Goushala"
                className="h-14 w-14 object-contain"
              />
              <div className="flex flex-col leading-tight">
                <span className="font-serif text-base font-semibold tracking-wide text-background">
                  {t("SiteName")}
                </span>
                <span className="text-xs text-primary tracking-widest uppercase">
                  {t("SiteSubtitle")}
                </span>
              </div>
            </div>
            <p className="max-w-xs leading-relaxed opacity-75 text-sm">
              {language === "kn"
                ? "ಕರ್ನಾಟಕದ ಆಧ್ಯಾತ್ಮಿಕ ಪರಂಪರೆ ಮತ್ತು ಗೋವಿನ ಕಲ್ಯಾಣಕ್ಕಾಗಿ ಮೀಸಲಾದ ಪವಿತ್ರ ಕ್ಷೇತ್ರ."
                : "A sacred sanctuary dedicated to the eternal welfare of cows and preserving the spiritual heritage of Karnataka."}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-lg text-primary">{t("Contact")}</h3>
            <address className="not-italic opacity-75 space-y-1 text-sm">
              <p>Sri Kalyan Chowkimath Temple Road</p>
              <p>Mysuru District, Karnataka</p>
              <p>India - 570001</p>
              <p className="pt-2">contact@kamadhenugoushala.org</p>
              <p>+91 98765 43210</p>
            </address>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-lg text-primary">
              {language === "kn" ? "ಸಂಪರ್ಕಗಳು" : "Links"}
            </h3>
            <ul className="space-y-2 opacity-75 text-sm">
              <li><Link href="/" className="hover:text-primary transition-colors">{t("Home")}</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">{t("About Us")}</Link></li>
              <li><Link href="/gallery" className="hover:text-primary transition-colors">{t("Gallery")}</Link></li>
              <li><Link href="/donate" className="hover:text-primary transition-colors">{t("Make a Donation")}</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">{t("Contact Us")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-3 text-xs opacity-50">
          <p>&copy; {new Date().getFullYear()} {t("SiteName")}. {language === "kn" ? "ಎಲ್ಲ ಹಕ್ಕುಗಳು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ." : "All rights reserved."}</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-primary">
              {language === "kn" ? "ಗೌಪ್ಯತಾ ನೀತಿ" : "Privacy Policy"}
            </Link>
            <Link href="/terms" className="hover:text-primary">
              {language === "kn" ? "ಸೇವಾ ನಿಯಮಗಳು" : "Terms of Service"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
