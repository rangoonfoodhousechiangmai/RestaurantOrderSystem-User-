import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'eng');

  // Save language to localStorage whenever language changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'eng' ? 'mm' : 'eng');
  };

  return (
    <LanguageContext.Provider value={{
      language,
      toggleLanguage
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
