import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "kn";

interface Translations {
  [key: string]: {
    en: string;
    kn: string;
  };
}

const dictionary: Translations = {
  "SiteName": { en: "Shree Kalyan Chowkimath Kamadhenu Goushala", kn: "ಶ್ರೀ ಕಲ್ಯಾಣ ಚೌಕಿಮಠ ಕಾಮಧೇನು ಗೋಶಾಲಾ" },
  "SiteNameShort": { en: "Kamadhenu Goushala", kn: "ಕಾಮಧೇನು ಗೋಶಾಲಾ" },
  "SiteSubtitle": { en: "Seva Trust", kn: "ಸೇವಾ ಟ್ರಸ್ಟ್" },
  "Gosuala": { en: "Kamadhenu Goushala", kn: "ಕಾಮಧೇನು ಗೋಶಾಲಾ" },
  "Home": { en: "Home", kn: "ಮನೆ" },
  "About": { en: "About", kn: "ನಮ್ಮ ಬಗ್ಗೆ" },
  "Gallery": { en: "Gallery", kn: "ಗ್ಯಾಲರಿ" },
  "Donate": { en: "Donate", kn: "ದಾನ" },
  "Contact": { en: "Contact", kn: "ಸಂಪರ್ಕ" },
  "Welcome to Gosuala": { en: "Shree Kalyan Chowkimath Kamadhenu Goushala", kn: "ಶ್ರೀ ಕಲ್ಯಾಣ ಚೌಕಿಮಠ ಕಾಮಧೇನು ಗೋಶಾಲಾ" },
  "Our Mission": { en: "Our Mission", kn: "ನಮ್ಮ ಧ್ಯೇಯ" },
  "About Us": { en: "About Us", kn: "ನಮ್ಮ ಬಗ್ಗೆ" },
  "Make a Donation": { en: "Make a Donation", kn: "ದಾನ ಮಾಡಿ" },
  "Contact Us": { en: "Contact Us", kn: "ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ" },
  "Submit": { en: "Submit", kn: "ಸಲ್ಲಿಸು" },
  "Name": { en: "Name", kn: "ಹೆಸರು" },
  "Email": { en: "Email", kn: "ಇಮೇಲ್" },
  "Message": { en: "Message", kn: "ಸಂದೇಶ" },
  "Amount": { en: "Amount", kn: "ಮೊತ್ತ" },
  "Read More": { en: "Read More", kn: "ಇನ್ನಷ್ಟು ಓದಿ" },
  "History & Origins": { en: "History & Origins", kn: "ಇತಿಹಾಸ ಮತ್ತು ಮೂಲಗಳು" },
  "Our Values": { en: "Our Values", kn: "ನಮ್ಮ ಮೌಲ್ಯಗಳು" },
  "Photo Gallery": { en: "Photo Gallery", kn: "ಚಿತ್ರ ಗ್ಯಾಲರಿ" },
  "Support Our Cause": { en: "Support Our Cause", kn: "ನಮ್ಮ ಉದ್ದೇಶವನ್ನು ಬೆಂಬಲಿಸಿ" },
  "Get in Touch": { en: "Get in Touch", kn: "ಸಂಪರ್ಕದಲ್ಲಿರಿ" },
  "Send Message": { en: "Send Message", kn: "ಸಂದೇಶ ಕಳುಹಿಸಿ" },
  "Donation Tier": { en: "Donation Tier", kn: "ದಾನದ ಹಂತ" },
  "Custom Amount": { en: "Custom Amount", kn: "ಕಸ್ಟಮ್ ಮೊತ್ತ" },
  "Phone": { en: "Phone", kn: "ದೂರವಾಣಿ" },
  "Address": { en: "Address", kn: "ವಿಳಾಸ" },
  "Monthly Support": { en: "Monthly Support", kn: "ಮಾಸಿಕ ಬೆಂಬಲ" },
  "One-time Gift": { en: "One-time Gift", kn: "ಒಂದು ಬಾರಿಯ ಉಡುಗೊರೆ" },
  "Our Activities": { en: "Our Activities", kn: "ನಮ್ಮ ಚಟುವಟಿಕೆಗಳು" },
  "Upcoming Events": { en: "Upcoming Events", kn: "ಮುಂಬರುವ ಕಾರ್ಯಕ್ರಮಗಳು" },
  "Announcements": { en: "Announcements", kn: "ಪ್ರಕಟಣೆಗಳು" },
  "Our Impact": { en: "Our Impact", kn: "ನಮ್ಮ ಪ್ರಭಾವ" },
  "Cows Protected": { en: "Cows Protected", kn: "ರಕ್ಷಿಸಿದ ಗೋವುಗಳು" },
  "Years of Service": { en: "Years of Service", kn: "ಸೇವಾ ವರ್ಷಗಳು" },
  "Devotees Served": { en: "Devotees Served", kn: "ಸೇವೆ ಸಲ್ಲಿಸಿದ ಭಕ್ತರು" },
  "Daily Rituals": { en: "Daily Rituals", kn: "ದೈನಂದಿನ ಆಚರಣೆಗಳು" },
  "Cow Care & Welfare": { en: "Cow Care & Welfare", kn: "ಗೋ ಸಂರಕ್ಷಣೆ" },
  "Go-Pooja": { en: "Go-Pooja", kn: "ಗೋ-ಪೂಜೆ" },
  "Gau Daan": { en: "Gau Daan", kn: "ಗೌ ದಾನ" },
  "Annadanam": { en: "Annadanam", kn: "ಅನ್ನದಾನ" },
  "Spiritual Discourses": { en: "Spiritual Discourses", kn: "ಆಧ್ಯಾತ್ಮಿಕ ಪ್ರವಚನಗಳು" },
  "Vedic Education": { en: "Vedic Education", kn: "ವೈದಿಕ ಶಿಕ್ಷಣ" },
};

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "kn" : "en"));
  };

  const t = (key: string) => {
    if (dictionary[key]) {
      return dictionary[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      <div className={language === "kn" ? "font-kannada" : ""}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
