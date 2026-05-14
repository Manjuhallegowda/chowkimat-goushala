import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionDivider, DecorativeBorder } from "@/components/SectionDivider";
import { motion } from "framer-motion";

export default function Donate() {
  const { t } = useLanguage();

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
              {t("Support Our Cause")}
            </h1>
            <p className="text-xl font-serif text-foreground/80 leading-relaxed max-w-2xl mx-auto">
              Your generous contributions ensure the continuous care, feeding, and medical attention for our sacred herd.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Tiers */}
            <div className="space-y-6">
              <h2 className="font-serif text-3xl text-foreground mb-6">Donation Categories</h2>
              
              {[
                { name: "Daily Fodder (Grasa)", amount: "₹1,001", desc: "Provides fresh green fodder and nutritional supplements for one day." },
                { name: "Medical Fund (Chikitsa)", amount: "₹5,001", desc: "Supports veterinary care and medicines for ailing cows." },
                { name: "Lifelong Care (Nirantara)", amount: "₹51,000", desc: "Sponsors the complete care of one cow for its entire lifetime." }
              ].map((tier, idx) => (
                <div key={idx} className="p-6 border border-border bg-card hover:border-primary/50 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-serif text-xl text-primary group-hover:text-foreground transition-colors">{tier.name}</h3>
                    <span className="font-medium text-lg">{tier.amount}</span>
                  </div>
                  <p className="text-foreground/70 text-sm">{tier.desc}</p>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="bg-card p-8 border border-border shadow-sm">
              <h2 className="font-serif text-3xl text-foreground mb-6">{t("Make a Donation")}</h2>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">{t("Amount")}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50 font-medium">₹</span>
                    <input 
                      type="number" 
                      className="w-full bg-background border border-border p-3 pl-8 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="Enter amount"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">PAN Number (for Tax Receipt)</label>
                  <input 
                    type="text" 
                    className="w-full bg-background border border-border p-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all uppercase"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 font-medium tracking-widest uppercase transition-all mt-4"
                >
                  Proceed to Pay
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
