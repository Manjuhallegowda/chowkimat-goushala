import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionDivider, DecorativeBorder } from "@/components/SectionDivider";
import { motion } from "framer-motion";

// Import images
import templeExterior from "@/assets/images/temple-exterior.png";
import templeCows from "@/assets/images/temple-cows.png";
import oilLamps from "@/assets/images/oil-lamps.png";
import marigolds from "@/assets/images/marigolds.png";
import priestPuja from "@/assets/images/priest-puja.png";
import devotees from "@/assets/images/devotees.png";

export default function Gallery() {
  const { t } = useLanguage();

  const images = [
    { src: templeExterior, alt: "Temple Exterior", aspect: "aspect-video md:col-span-2 md:row-span-2" },
    { src: templeCows, alt: "Sacred Cows", aspect: "aspect-square" },
    { src: oilLamps, alt: "Oil Lamps", aspect: "aspect-square" },
    { src: marigolds, alt: "Marigolds", aspect: "aspect-[3/4]" },
    { src: priestPuja, alt: "Priest Puja", aspect: "aspect-[3/4]" },
    { src: devotees, alt: "Devotees", aspect: "aspect-video md:col-span-2" },
  ];

  return (
    <div className="w-full pt-24 pb-16">
      <DecorativeBorder />
      
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-serif text-5xl md:text-6xl text-primary mb-6">
              {t("Photo Gallery")}
            </h1>
            <p className="text-xl font-serif text-foreground/80 leading-relaxed max-w-2xl mx-auto mb-16">
              Glimpses of daily life, ancient rituals, and the serene beauty of our sanctuary.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[250px] gap-4">
            {images.map((img, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative overflow-hidden group ${img.aspect} bg-muted`}
              >
                <img 
                  src={img.src} 
                  alt={img.alt} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />
    </div>
  );
}
