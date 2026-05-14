import React from "react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionDivider, DecorativeBorder } from "@/components/SectionDivider";
import { motion } from "framer-motion";
import templeExterior from "@/assets/images/temple-exterior.png";
import templeCows from "@/assets/images/temple-cows.png";
import oilLamps from "@/assets/images/oil-lamps.png";
import marigolds from "@/assets/images/marigolds.png";
import priestPuja from "@/assets/images/priest-puja.png";

const announcements = [
  "Gomaata Pooja every Sunday at 6:00 AM  •  All are welcome",
  "Gau Daan drive — donate a cow and earn eternal blessings",
  "Annadanam served daily to 500+ devotees",
  "New cow shelter inauguration — Bhoomi Pooja on Karthika Pournami",
  "Monthly Satsang on every Ekadashi — join us for Hari Katha",
  "Volunteering opportunities available — contact us to seva",
];

const activities = [
  {
    title: "Cow Care & Welfare",
    titleKn: "ಗೋ ಸಂರಕ್ಷಣೆ",
    desc: "Over 500 cows receive daily medical care, nutritious feed, and sacred protection within our peaceful sanctuary.",
    descKn: "500ಕ್ಕೂ ಹೆಚ್ಚು ಗೋವುಗಳಿಗೆ ನಿತ್ಯ ವೈದ್ಯಕೀಯ ಆರೈಕೆ ಮತ್ತು ಪೋಷಣೆ ನೀಡಲಾಗುತ್ತದೆ.",
    icon: (
      <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
        <path d="M8 28 C8 20 16 10 20 8 C24 10 32 20 32 28 C32 34 26 38 20 38 C14 38 8 34 8 28Z" stroke="currentColor" strokeWidth="2" fill="none"/>
        <circle cx="14" cy="22" r="2.5" fill="currentColor"/>
        <circle cx="26" cy="22" r="2.5" fill="currentColor"/>
        <path d="M16 30 Q20 33 24 30" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: "Go-Pooja",
    titleKn: "ಗೋ-ಪೂಜೆ",
    desc: "Sacred rituals venerating the Gaumata every morning and evening, performed with Vedic mantras and flower offerings.",
    descKn: "ಪ್ರತಿ ಬೆಳಗ್ಗೆ ಮತ್ತು ಸಂಜೆ ವೈದಿಕ ಮಂತ್ರಗಳೊಂದಿಗೆ ಗೋ-ಪೂಜೆ ನಡೆಯುತ್ತದೆ.",
    icon: (
      <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
        <path d="M20 4 L20 36" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 12 Q20 8 28 12" stroke="currentColor" strokeWidth="2" fill="none"/>
        <circle cx="20" cy="20" r="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M8 36 Q14 28 20 26 Q26 28 32 36" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      </svg>
    ),
  },
  {
    title: "Annadanam",
    titleKn: "ಅನ್ನದಾನ",
    desc: "Free meals served daily to pilgrims, devotees and the needy — because feeding the hungry is the highest form of worship.",
    descKn: "ಭಕ್ತರಿಗೆ ಮತ್ತು ಅಗತ್ಯಸ್ಥರಿಗೆ ಪ್ರತಿ ದಿನ ಉಚಿತ ಭೋಜನ ನೀಡಲಾಗುತ್ತದೆ.",
    icon: (
      <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
        <path d="M10 20 Q10 12 20 10 Q30 12 30 20 L28 32 Q24 36 20 36 Q16 36 12 32Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M14 20 Q20 16 26 20" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M13 24 Q20 21 27 24" stroke="currentColor" strokeWidth="1.2" fill="none"/>
      </svg>
    ),
  },
  {
    title: "Vedic Education",
    titleKn: "ವೈದಿಕ ಶಿಕ್ಷಣ",
    desc: "Classes in Vedic scriptures, Sanskrit, and ancient traditions — preserving the spiritual knowledge for future generations.",
    descKn: "ವೈದಿಕ ಗ್ರಂಥಗಳು, ಸಂಸ್ಕೃತ ಮತ್ತು ಪ್ರಾಚೀನ ಸಂಪ್ರದಾಯಗಳಲ್ಲಿ ತರಗತಿಗಳು.",
    icon: (
      <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
        <rect x="8" y="8" width="24" height="28" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M13 16 L27 16" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M13 21 L27 21" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M13 26 L22 26" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M20 4 L20 10" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="20" cy="4" r="2" fill="currentColor"/>
      </svg>
    ),
  },
  {
    title: "Gau Daan",
    titleKn: "ಗೌ ದಾನ",
    desc: "Facilitate the sacred act of donating a cow — one of the most auspicious gifts in the Hindu tradition.",
    descKn: "ಗೌ ದಾನ — ಹಿಂದೂ ಸಂಪ್ರದಾಯದಲ್ಲಿ ಅತ್ಯಂತ ಮಂಗಳಕರ ದಾನ.",
    icon: (
      <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
        <path d="M6 20 C6 12 13 6 20 6 C27 6 34 12 34 20 C34 28 27 34 20 34 C13 34 6 28 6 20Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M14 20 L18 24 L26 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: "Spiritual Discourses",
    titleKn: "ಆಧ್ಯಾತ್ಮಿಕ ಪ್ರವಚನಗಳು",
    desc: "Monthly Satsang and Hari Katha sessions by learned scholars — nourishing the soul through divine knowledge.",
    descKn: "ವಿದ್ವಾಂಸರಿಂದ ಮಾಸಿಕ ಸತ್ಸಂಗ ಮತ್ತು ಹರಿ ಕಥಾ ಕಾರ್ಯಕ್ರಮಗಳು.",
    icon: (
      <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
        <path d="M8 30 Q8 14 20 8 Q32 14 32 30" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M14 30 Q14 18 20 14 Q26 18 26 30" stroke="currentColor" strokeWidth="1.2" fill="none"/>
        <path d="M8 30 L32 30" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
];


const stats = [
  { value: "500+", label: "Cows Protected", labelKn: "ರಕ್ಷಿಸಿದ ಗೋವುಗಳು" },
  { value: "25+", label: "Years of Service", labelKn: "ಸೇವಾ ವರ್ಷಗಳು" },
  { value: "10,000+", label: "Devotees Served", labelKn: "ಸೇವೆ ಸಲ್ಲಿಸಿದ ಭಕ್ತರು" },
  { value: "365", label: "Daily Rituals", labelKn: "ದೈನಂದಿನ ಆಚರಣೆಗಳು" },
];

function Marquee() {
  return (
    <div className="overflow-hidden bg-primary/10 border-y border-primary/20 py-3">
      <div className="marquee-track flex gap-16 whitespace-nowrap">
        {[...announcements, ...announcements].map((text, i) => (
          <span key={i} className="text-sm text-foreground/80 tracking-wide shrink-0 flex items-center gap-3">
            <span className="text-primary text-lg">✦</span>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}


const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Home() {
  const { t, language } = useLanguage();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[88vh] min-h-[580px] flex items-center justify-center overflow-hidden mt-20">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${templeExterior})` }}
          />
          <div className="absolute inset-0 bg-foreground/72" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/40 to-transparent" />
        </div>

        <div className="relative z-10 text-center text-background px-4 max-w-4xl mx-auto flex flex-col items-center justify-center pt-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <img
              src={"/kcm_logo.webp"}
              alt="Logo"
              className="mx-auto mb-6 h-28 w-28 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl mb-4 tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] leading-tight font-bold">
              {t("Welcome to Gosuala")}
            </h1>
            <p className="text-base md:text-lg font-medium mb-10 max-w-2xl mx-auto opacity-100 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {language === "kn"
                ? "ಕರ್ನಾಟಕದ ಹೃದಯದಲ್ಲಿ ಪವಿತ್ರ ಗೋವಿನ ಶಾಶ್ವತ ರಕ್ಷಣೆಗೆ ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಪರಂಪರೆಯ ಸಂರಕ್ಷಣೆಗೆ ಮೀಸಲಾದ ಪುಣ್ಯ ಕ್ಷೇತ್ರ."
                : "A sacred sanctuary in the heart of Karnataka, devoted to the eternal care of the holy cow and the preservation of our spiritual heritage."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/donate"
                data-testid="link-hero-donate"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded font-medium tracking-widest uppercase transition-all hover:-translate-y-1 shadow-lg text-sm"
              >
                {t("Make a Donation")}
              </Link>
              <Link
                href="/about"
                data-testid="link-hero-about"
                className="bg-transparent border border-background/40 hover:bg-background/10 text-background px-8 py-3 rounded font-medium tracking-widest uppercase transition-all text-sm"
              >
                {t("About Us")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Announcements Marquee */}
      <Marquee />

      <DecorativeBorder />

      {/* Mission Section */}
      <section className="pt-4 pb-12 px-4 bg-background">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-xs tracking-widest uppercase text-primary mb-3">{t("Our Mission")}</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground/90 leading-relaxed max-w-3xl mx-auto">
              {language === "kn"
                ? "\"ಗೌಮಾತೆಯ ಸೇವೆಯಲ್ಲಿ ದೈವತ್ವವನ್ನು ಕಾಣುವ ಪಾವನ ಸ್ಥಾನ.\""
                : "\"To protect, nourish, and revere the Gaumata — for in serving the gentle cow, we serve the divine presence within all living beings.\""}
            </h2>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* Stats Section */}
      <section className="py-10 px-4 bg-card">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center py-4"
                data-testid={`stat-${i}`}
              >
                <p className="font-serif text-4xl md:text-5xl text-primary font-semibold">{stat.value}</p>
                <p className="text-xs tracking-widest uppercase text-foreground/60 mt-2">
                  {language === "kn" ? stat.labelKn : stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* The Sacred Goshala — image + text */}
      <section className="py-10 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1">
              <img
                src={templeCows}
                alt="Sacred cows in courtyard"
                className="rounded-t-full shadow-xl w-full h-[420px] object-cover border-8 border-card"
              />
            </div>
            <motion.div
              className="order-1 md:order-2 space-y-4"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="text-xs tracking-widest uppercase text-primary">
                {language === "kn" ? "ಪವಿತ್ರ ಗೋಶಾಲಾ" : "The Sacred Goshala"}
              </p>
              <h3 className="font-serif text-3xl md:text-4xl text-foreground">
                {language === "kn" ? "ಗೋಮಾತೆಯ ಆಶ್ರಯ" : "A Haven for Gaumata"}
              </h3>
              <p className="text-foreground/70 leading-relaxed">
                {language === "kn"
                  ? "ನಮ್ಮ ಆಶ್ರಯ ಶಾಂತಿಯುತ ತೋಪುಗಳಲ್ಲಿ ವ್ಯಾಪಿಸಿದ್ದು, 500ಕ್ಕೂ ಹೆಚ್ಚು ಗೋವುಗಳಿಗೆ ಆಸರೆ ನೀಡುತ್ತದೆ."
                  : "Our sanctuary spans peaceful shaded acres, providing a haven for over 500 cows. Every day begins with reverent prayers and ends with gentle, loving care for each animal."}
              </p>
              <Link href="/gallery" data-testid="link-gallery" className="inline-block text-primary text-sm font-medium tracking-widest uppercase hover:underline underline-offset-4 pt-2">
                {t("Gallery")} &rarr;
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Our Activities */}
      <section className="py-10 px-4 bg-card">
        <div className="container mx-auto max-w-6xl">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-8">
            <p className="text-xs tracking-widest uppercase text-primary mb-2">{t("Our Activities")}</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground">
              {language === "kn" ? "ನಮ್ಮ ಸೇವಾ ಕಾರ್ಯಗಳು" : "How We Serve"}
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {activities.map((act, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                data-testid={`card-activity-${i}`}
                className="bg-background border border-border p-6 hover:border-primary/40 transition-colors group"
              >
                <div className="text-primary mb-4 group-hover:scale-110 transition-transform duration-300 w-fit">
                  {act.icon}
                </div>
                <h4 className="font-serif text-lg text-foreground mb-2">
                  {language === "kn" ? act.titleKn : act.title}
                </h4>
                <p className="text-sm text-foreground/65 leading-relaxed">
                  {language === "kn" ? act.descKn : act.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Eternal Devotion — image + text */}
      <section className="py-10 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <motion.div className="space-y-4" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <p className="text-xs tracking-widest uppercase text-primary">
                {language === "kn" ? "ಶಾಶ್ವತ ಭಕ್ತಿ" : "Eternal Devotion"}
              </p>
              <h3 className="font-serif text-3xl md:text-4xl text-foreground">
                {language === "kn" ? "ಆಚರಣೆ ಮತ್ತು ಅರ್ಪಣೆ" : "Rituals & Offerings"}
              </h3>
              <p className="text-foreground/70 leading-relaxed">
                {language === "kn"
                  ? "ಗೋಶಾಲಾದ ಲಯವನ್ನು ಪ್ರಾಚೀನ ಆಚರಣೆಗಳು ನಿರ್ಧರಿಸುತ್ತವೆ. ಬೆಳಗ್ಗೆ ಆರತಿಯಿಂದ ಸಂಜೆ ದೀಪ ಹಚ್ಚುವವರೆಗೆ ಪ್ರತಿ ಕ್ರಿಯೆಯೂ ದೈವಕ್ಕೆ ಅರ್ಪಣೆ."
                  : "The rhythm of the Goushala is set by ancient rituals. From the early morning Aarti to the lighting of oil lamps at dusk, every action is a meditation and an offering to the divine."}
              </p>
              <Link href="/about" data-testid="link-about-rituals" className="inline-block text-primary text-sm font-medium tracking-widest uppercase hover:underline underline-offset-4 pt-2">
                {t("Read More")} &rarr;
              </Link>
            </motion.div>
            <div>
              <div className="relative p-4 bg-card border border-border">
                <img
                  src={oilLamps}
                  alt="Glowing oil lamps"
                  className="w-full h-[360px] object-cover"
                />
                <div className="absolute inset-0 border border-primary/20 m-6 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Shloka / Scripture Quote */}
      <section className="py-10 px-4 bg-foreground text-background">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="font-serif text-2xl md:text-3xl italic opacity-90 leading-relaxed mb-4">
              "गावो विश्वस्य मातरः"
            </p>
            <p className="text-sm tracking-widest uppercase opacity-60 mb-2">Rigveda</p>
            <p className="opacity-75 text-base">
              {language === "kn"
                ? "\"ಗೋವುಗಳು ಇಡೀ ವಿಶ್ವದ ತಾಯಂದಿರು\""
                : "\"The cows are the mothers of the entire world\""}
            </p>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* Swamiji Section */}
      <section className="py-10 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Swamiji Photo Placeholder */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="relative w-72 h-96 border-8 border-card shadow-xl rounded-t-full overflow-hidden bg-muted flex items-end justify-center" data-testid="img-swamiji-placeholder">
                {/* Placeholder silhouette until real photo is added */}
                <svg viewBox="0 0 200 260" className="w-full h-full absolute inset-0 text-foreground/10" fill="currentColor">
                  <ellipse cx="100" cy="80" rx="40" ry="48" />
                  <path d="M20 260 C20 180 50 160 100 155 C150 160 180 180 180 260Z" />
                  {/* Simple robes suggestion */}
                  <ellipse cx="100" cy="72" rx="28" ry="36" fill="hsl(28 36% 44% / 0.3)" />
                </svg>
                <div className="relative z-10 w-full bg-gradient-to-t from-foreground/60 to-transparent pb-6 pt-12 text-center">
                  <p className="text-background/90 text-xs tracking-widest uppercase">
                    {language === "kn" ? "ಚಿತ್ರ ಶೀಘ್ರದಲ್ಲೇ" : "Photo coming soon"}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Swamiji Info */}
            <motion.div
              className="space-y-4"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="text-xs tracking-widest uppercase text-primary">
                {language === "kn" ? "ನಮ್ಮ ಮಾರ್ಗದರ್ಶಕರು" : "Our Spiritual Guide"}
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                {language === "kn" ? "ಪೂಜ್ಯ ಸ್ವಾಮೀಜಿ" : "Pujya Swamiji"}
              </h2>
              <div className="w-12 h-0.5 bg-primary" />
              <p className="text-foreground/70 leading-relaxed">
                {language === "kn"
                  ? "ಶ್ರೀ ಕಲ್ಯಾಣ ಚೌಕಿಮಠದ ಪೀಠಾಧಿಪತಿಗಳು ಗೋಶಾಲಾದ ಆಧ್ಯಾತ್ಮಿಕ ಸ್ಫೂರ್ತಿ. ತಮ್ಮ ಅಪಾರ ಜ್ಞಾನ ಮತ್ತು ಕರುಣೆಯಿಂದ ಸಹಸ್ರಾರು ಭಕ್ತರ ಹೃದಯವನ್ನು ಮುಟ್ಟಿದ್ದಾರೆ."
                  : "The Peethadhipati of Shree Kalyan Chowkimath is the spiritual heart of the Goushala. With profound wisdom rooted in Vedic tradition and boundless compassion for all living beings, Swamiji has guided thousands of devotees on the path of dharma."}
              </p>
              <p className="text-foreground/70 leading-relaxed">
                {language === "kn"
                  ? "ಅವರ ನೇತೃತ್ವದಲ್ಲಿ ಗೋಶಾಲಾ ಕೇವಲ ಗೋ ಸಂರಕ್ಷಣಾ ಕೇಂದ್ರವಲ್ಲ, ಬದಲಿಗೆ ಆಧ್ಯಾತ್ಮಿಕ ಜ್ಞಾನ ಮತ್ತು ಸೇವೆಯ ದೀಪಸ್ತಂಭ ಆಗಿದೆ."
                  : "Under his divine guidance, the Goushala has grown not just as a sanctuary for cows, but as a beacon of spiritual knowledge, selfless service, and devotion to Gaumata."}
              </p>
              <blockquote className="border-l-2 border-primary pl-4 italic text-foreground/60 font-serif text-lg mt-2">
                {language === "kn"
                  ? "\"ಗೋಮಾತೆಯ ಸೇವೆಯೇ ಶ್ರೇಷ್ಠ ತಪಸ್ಸು.\""
                  : "\"Serving the Gaumata is the highest form of tapasya.\""}
              </blockquote>
              <Link
                href="/about"
                data-testid="link-about-swamiji"
                className="inline-block text-primary text-sm font-medium tracking-widest uppercase hover:underline underline-offset-4 pt-2"
              >
                {t("Read More")} &rarr;
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Gallery Preview Strip */}
      <section className="py-10 px-4 bg-card">
        <div className="container mx-auto max-w-6xl">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-6">
            <p className="text-xs tracking-widest uppercase text-primary mb-2">{t("Photo Gallery")}</p>
            <h2 className="font-serif text-3xl text-foreground">
              {language === "kn" ? "ನಮ್ಮ ಗ್ಯಾಲರಿ" : "Glimpses of Goushala"}
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[templeExterior, marigolds, priestPuja, templeCows].map((src, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="overflow-hidden group cursor-pointer"
                data-testid={`img-gallery-preview-${i}`}
              >
                <img
                  src={src}
                  alt=""
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/gallery" data-testid="link-full-gallery" className="inline-block border border-primary text-primary px-8 py-3 text-sm tracking-widest uppercase hover:bg-primary hover:text-primary-foreground transition-colors">
              {language === "kn" ? "ಎಲ್ಲಾ ಚಿತ್ರಗಳನ್ನು ನೋಡಿ" : "View Full Gallery"} &rarr;
            </Link>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Donate CTA */}
      <section className="py-12 px-4 bg-background">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-xs tracking-widest uppercase text-primary mb-3">
              {language === "kn" ? "ನಮ್ಮನ್ನು ಬೆಂಬಲಿಸಿ" : "Support Our Cause"}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
              {language === "kn" ? "ನಿಮ್ಮ ದಾನದಿಂದ ಬದಲಾವಣೆ ತನ್ನಿ" : "Your Seva Makes a Difference"}
            </h2>
            <p className="text-foreground/65 mb-8 max-w-2xl mx-auto">
              {language === "kn"
                ? "ಗೋಮಾತೆಯ ಆರೈಕೆ, ಅನ್ನದಾನ, ಮತ್ತು ವೈದ್ಯಕೀಯ ಸೇವೆಗೆ ನಿಮ್ಮ ದಾನ ಸಹಕಾರಿ."
                : "Your donation helps us provide daily care for hundreds of cows, offer Annadanam, conduct sacred rituals, and preserve our ancient traditions."}
            </p>
            <Link href="/donate" data-testid="link-cta-donate" className="inline-block bg-primary text-primary-foreground px-10 py-4 font-medium tracking-widest uppercase hover:bg-primary/90 transition-all hover:-translate-y-1 shadow-lg text-sm">
              {t("Make a Donation")}
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
