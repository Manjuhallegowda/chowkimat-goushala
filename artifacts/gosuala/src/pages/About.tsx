import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionDivider, DecorativeBorder } from "@/components/SectionDivider";
import { motion } from "framer-motion";
import templeCows from "@/assets/images/temple-cows.png";
import priestPuja from "@/assets/images/priest-puja.png";

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="w-full pt-24 pb-16">
      <DecorativeBorder />
      
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-serif text-5xl md:text-6xl text-primary mb-6">
              {t("About Us")}
            </h1>
            <p className="text-xl font-serif text-foreground/80 leading-relaxed max-w-3xl mx-auto mb-12">
              For generations, Gosuala has stood as a beacon of compassion and spiritual devotion in Karnataka, safeguarding the divine presence of the Gaumata.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-card px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <img 
                src={priestPuja} 
                alt="Priest performing puja" 
                className="w-full h-[600px] object-cover rounded-t-[100px] border-8 border-background shadow-lg"
              />
            </div>
            <div className="space-y-8">
              <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                {t("History & Origins")}
              </h2>
              <div className="space-y-4 text-foreground/80 leading-relaxed">
                <p>
                  Established over a century ago by visionary spiritual leaders, our goshala began with a modest herd of native Hallikar cows. Today, it has grown into a sprawling sanctuary, yet remains rooted in its foundational ethos of selfless service.
                </p>
                <p>
                  The ancient scriptures teach us that the cow is the embodiment of all deities. By nurturing them, we believe we are cultivating peace and harmony within our wider community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-12">
          <h2 className="font-serif text-3xl md:text-4xl text-primary">
            {t("Our Values")}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Compassion (Daya)", desc: "Unconditional love and care for all beings." },
              { title: "Service (Seva)", desc: "Dedicated daily effort without expectation of reward." },
              { title: "Devotion (Bhakti)", desc: "Seeing the divine in our daily duties." }
            ].map((value, idx) => (
              <div key={idx} className="p-8 bg-card border border-border/50 hover:border-primary/30 transition-colors">
                <h3 className="font-serif text-2xl text-foreground mb-4">{value.title}</h3>
                <p className="text-foreground/70">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
