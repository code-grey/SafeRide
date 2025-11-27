import React, { createContext, useState, useContext, ReactNode } from 'react';

interface MobileMenuContextType {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

const MobileMenuContext = createContext<MobileMenuContextType | undefined>(undefined);

export const useMobileMenu = () => {
  const context = useContext(MobileMenuContext);
  if (!context) {
    throw new Error('useMobileMenu must be used within a MobileMenuProvider');
  }
  return context;
};

export const MobileMenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <MobileMenuContext.Provider value={{ isMenuOpen, toggleMenu }}>
      {children}
    </MobileMenuContext.Provider>
  );
};
