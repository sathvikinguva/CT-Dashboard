import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeColor = 'blue' | 'emerald' | 'purple' | 'rose';

interface ThemeContextType {
  color: ThemeColor;
  setColor: (color: ThemeColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [color, setColor] = useState<ThemeColor>('blue');

  useEffect(() => {
    const savedColor = localStorage.getItem('theme-color') as ThemeColor;
    if (savedColor) setColor(savedColor);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme-color', color);
    document.documentElement.setAttribute('data-theme', color);
    document.documentElement.classList.add('dark');
  }, [color]);

  return (
    <ThemeContext.Provider value={{ color, setColor }}>
      {children}
    </ThemeContext.Provider>
  );
};