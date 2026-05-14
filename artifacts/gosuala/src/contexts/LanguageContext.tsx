import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "kn";

interface Translations {
  [key: string]: {
    en: string;
    kn: string;
  };
}

// Comprehensive dictionary for the app
const dictionary: Translations = {
  "Gosuala": { en: "Gosuala", kn: "ಗೋಶಾಲೆ" },
  "Home": { en: "Home", kn: "ಮನೆ" },
  "About": { en: "About", kn: "ನಮ್ಮ ಬಗ್ಗೆ" },
  "Gallery": { en: "Gallery", kn: "ಗ್ಯಾಲರಿ" },
  "Donate": { en: "Donate", kn: "ದಾನ" },
  "Contact": { en: "Contact", kn: "ಸಂಪರ್ಕ" },
  "Welcome to Gosuala": { en: "Welcome to Gosuala", kn: "ಗೋಶಾಲೆಗೆ ಸ್ವಾಗತ" },
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
