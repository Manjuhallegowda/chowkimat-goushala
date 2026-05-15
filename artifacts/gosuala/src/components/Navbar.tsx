import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Menu, X } from "lucide-react";
import logoImg from "@assets/kcm_1778773778796.webp";

export function Navbar() {
  const { t, language, toggleLanguage } = useLanguage();
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/gallery", label: "Gallery" },
    { href: "/donate", label: "Donate" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent ${
        scrolled
          ? "bg-background/97 backdrop-blur-md border-border/50 shadow-sm py-2"
          : "bg-background/80 backdrop-blur-sm py-3"
      }`}
    >
      <div className="w-full px-4 md:px-10">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 md:gap-3 group min-w-0 flex-1" data-testid="link-home-logo">
            <img
              src={logoImg}
              alt="Shree Kalyan Chowkimath Kamadhenu Goushala Logo"
              className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 object-contain group-hover:scale-105 transition-transform duration-300 shrink-0"
            />
            <div className="flex flex-col leading-tight min-w-0">
              <span className="font-serif text-[12px] sm:text-sm md:text-base font-semibold tracking-wide text-foreground leading-snug truncate sm:whitespace-normal">
                {t("SiteName")}
              </span>
              <span className="text-[9px] sm:text-[10px] md:text-xs text-primary tracking-widest uppercase mt-0.5">
                {t("SiteSubtitle")}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-testid={`link-nav-${link.label.toLowerCase()}`}
                className={`text-xs tracking-widest uppercase transition-colors hover:text-primary ${
                  location === link.href ? "text-primary font-medium" : "text-foreground/80"
                }`}
              >
                {t(link.label)}
              </Link>
            ))}

            <button
              onClick={toggleLanguage}
              data-testid="button-language-toggle"
              className="ml-2 flex items-center justify-center px-3 h-8 rounded-full border border-border/60 text-xs font-medium hover:bg-secondary/10 transition-colors"
              aria-label="Toggle language"
            >
              {language === "en" ? "ಕನ್ನಡ" : "EN"}
            </button>
          </nav>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-foreground"
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 w-full bg-background/95 backdrop-blur-xl border-b border-border shadow-2xl py-4 px-6 flex flex-col gap-3 lg:hidden z-50 origin-top animate-in slide-in-from-top-2 fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              data-testid={`link-mobile-${link.label.toLowerCase()}`}
              className={`block py-3 text-lg font-serif border-b border-border/20 last:border-0 ${
                location === link.href ? "text-primary font-medium" : "text-foreground/90"
              }`}
            >
              {t(link.label)}
            </Link>
          ))}
          
          {/* Language Toggle Inside Mobile Menu */}
          <button
            onClick={() => {
              toggleLanguage();
              setMobileMenuOpen(false);
            }}
            data-testid="button-language-toggle-mobile-inside"
            className="mt-2 flex items-center justify-center w-full py-3 rounded-lg border border-border/50 bg-secondary/10 text-base font-medium text-foreground hover:bg-secondary/20 transition-colors"
          >
            {language === "en" ? "ಕನ್ನಡಕ್ಕೆ ಬದಲಿಸಿ (Kannada)" : "Switch to English"}
          </button>
        </div>
      )}
    </header>
  );
}
