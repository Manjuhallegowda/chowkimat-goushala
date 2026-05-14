import React from "react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionDivider, DecorativeBorder } from "@/components/SectionDivider";
import { motion } from "framer-motion";
import templeExterior from "@/assets/images/temple-exterior.png";
import templeCows from "@/assets/images/temple-cows.png";
import oilLamps from "@/assets/images/oil-lamps.png";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Arch Clip Path Background */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${templeExterior})` }}
          />
          <div className="absolute inset-0 bg-foreground/60 backdrop-blur-[2px]" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="relative z-10 text-center text-background px-4 max-w-4xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <svg width="60" height="60" viewBox="0 0 100 100" className="mx-auto mb-6 text-primary">
              <path d="M50 5C50 5 80 40 80 70C80 86.5685 66.5685 100 50 100C33.4315 100 20 86.5685 20 70C20 40 50 5 50 5Z" fill="currentColor"/>
            </svg>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-6 tracking-tight drop-shadow-lg">
              {t("Welcome to Gosuala")}
            </h1>
            <p className="text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto opacity-90 leading-relaxed">
              A sacred sanctuary in the heart of Karnataka, devoted to the eternal care of the holy cow and the preservation of our spiritual heritage.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/donate" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded font-medium tracking-widest uppercase transition-all hover:-translate-y-1 shadow-lg"
              >
                {t("Make a Donation")}
              </Link>
              <Link 
                href="/about" 
                className="bg-transparent border border-background/30 hover:bg-background/10 text-background px-8 py-4 rounded font-medium tracking-widest uppercase transition-all"
              >
                {t("About Us")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <DecorativeBorder />

      {/* Mission Section */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-4xl md:text-5xl text-primary mb-8">{t("Our Mission")}</h2>
            <p className="text-xl md:text-2xl font-serif text-foreground/80 leading-relaxed max-w-3xl mx-auto">
              "To protect, nourish, and revere the Gaumata. We believe that in serving the gentle cow, we serve the divine presence that dwells within all living beings."
            </p>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* Highlights Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <img 
                src={templeCows} 
                alt="Sacred cows in courtyard" 
                className="rounded-t-full shadow-xl w-full h-[500px] object-cover border-8 border-card"
              />
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <h3 className="font-serif text-3xl md:text-4xl text-foreground">The Sacred Goshala</h3>
              <p className="text-foreground/70 leading-relaxed text-lg">
                Our sanctuary spans across peaceful acres of shaded groves, providing a haven for over 500 cows. Every day begins with reverent prayers and ends with gentle care.
              </p>
              <Link href="/gallery" className="inline-block text-primary font-medium tracking-widest uppercase hover:underline underline-offset-4 pt-4">
                {t("Gallery")} &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Daily Rituals Section */}
      <section className="py-16 px-4 bg-card mb-16">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h3 className="font-serif text-3xl md:text-4xl text-foreground">Eternal Devotion</h3>
              <p className="text-foreground/70 leading-relaxed text-lg">
                The rhythm of Gosuala is set by ancient rituals. From the early morning Aarti to the lighting of oil lamps at dusk, every action is a meditation and an offering to the divine.
              </p>
              <Link href="/about" className="inline-block text-primary font-medium tracking-widest uppercase hover:underline underline-offset-4 pt-4">
                {t("Read More")} &rarr;
              </Link>
            </div>
            <div>
              <div className="relative p-4 bg-background border border-border">
                <img 
                  src={oilLamps} 
                  alt="Glowing oil lamps" 
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 border-[1px] border-primary/30 m-6 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
