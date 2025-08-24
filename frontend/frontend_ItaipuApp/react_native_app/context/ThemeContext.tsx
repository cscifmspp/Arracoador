import React, { createContext, useContext, useState, useCallback } from 'react';
import { lightTheme, darkTheme } from '../constants/Colors';

interface ThemeContextType {
  theme: typeof darkTheme | typeof lightTheme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme, // Mudei para lightTheme como padrão
  toggleTheme: () => {},
  isDark: false, // Adicionei esta propriedade
});

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isDark, setIsDark] = useState(false); // false = tema claro como padrão
  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};