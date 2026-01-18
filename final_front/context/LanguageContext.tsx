
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const dictionary: Translations = {
  // Navbar & Global
  nav_gateway: { en: 'National Identity Gateway', hi: 'राष्ट्रीय पहचान गेटवे' },
  nav_design_system: { en: 'Government Design System', hi: 'सरकारी डिज़ाइन प्रणाली' },
  nav_sovereign: { en: 'Sovereign Shard', hi: 'संप्रभु शार्ड' },
  nav_access: { en: 'ACCESS', hi: 'पहुंच' },
  
  // Sidebar
  side_hub: { en: 'National Hub', hi: 'राष्ट्रीय हब' },
  side_dash: { en: 'Portal Dashboard', hi: 'पोर्टल डैशबोर्ड' },
  side_requests: { en: 'Verify Requests', hi: 'अनुरोध सत्यापित करें' },
  side_assets: { en: 'Manage Identity', hi: 'पहचान प्रबंधित करें' },
  side_history: { en: 'Access History', hi: 'पहुंच इतिहास' },
  
  // Landing Page
  land_sovereignty: { en: 'Identity Sovereignty Hub', hi: 'पहचान संप्रभुता हब' },
  land_entrance: { en: 'Portal Entrance', hi: 'पोर्टल प्रवेश' },
  land_enroll: { en: 'Enrollment', hi: 'नामांकन' },
  land_citizen: { en: 'Citizen Portal', hi: 'नागरिक पोर्टल' },
  land_dept: { en: 'Departmental Hub', hi: 'विभागीय हब' },
  land_infra: { en: 'Infrastructure', hi: 'आधारभूत संरचना' },
  
  // Login
  log_signin: { en: 'Sign in to your sovereign node', hi: 'अपने संप्रभु नोड में साइन इन करें' },
  log_identifier: { en: 'Identifier / DID', hi: 'पहचानकर्ता / डीआईडी' },
  log_secure_phrase: { en: 'Secure Phrase', hi: 'सुरक्षित वाक्यांश' },
  log_access_shard: { en: 'Access Shard', hi: 'शार्ड तक पहुंचें' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('idtrust_lang') as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('idtrust_lang', language);
  }, [language]);

  const t = (key: string) => {
    return dictionary[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
