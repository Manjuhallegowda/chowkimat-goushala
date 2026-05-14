import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Menu, X } from "lucide-react";

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
          ? "bg-background/95 backdrop-blur-md border-border/50 shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <svg width="32" height="32" viewBox="0 0 100 100" className="text-primary group-hover:scale-105 transition-transform duration-300">
              <path d="M50 5C50 5 80 40 80 70C80 86.5685 66.5685 100 50 100C33.4315 100 20 86.5685 20 70C20 40 50 5 50 5Z" fill="currentColor" opacity="0.8"/>
              <circle cx="50" cy="75" r="10" fill="var(--background)" />
            </svg>
            <span className="font-serif text-2xl md:text-3xl font-semibold tracking-wide text-foreground">
              {t("Gosuala")}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-widest uppercase transition-colors hover:text-primary ${
                  location === link.href ? "text-primary font-medium" : "text-foreground/80"
                }`}
              >
                {t(link.label)}
              </Link>
            ))}
            
            <button
              onClick={toggleLanguage}
              className="ml-4 flex items-center justify-center w-12 h-8 rounded-full border border-border/60 text-sm font-medium hover:bg-secondary/10 transition-colors"
              aria-label="Toggle language"
            >
              {language === "en" ? "ಕ" : "EN"}
            </button>
          </nav>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={toggleLanguage}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-border/60 text-sm font-medium"
            >
              {language === "en" ? "ಕ" : "EN"}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-foreground"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg py-4 px-4 flex flex-col gap-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-3 text-lg font-serif border-b border-border/30 last:border-0 ${
                location === link.href ? "text-primary" : "text-foreground"
              }`}
            >
              {t(link.label)}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
