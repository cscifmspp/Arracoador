// context/ThemeContext.tsx - TUDO EM UM ARQUIVO
import React, { createContext, useContext, useState, useCallback } from 'react';

// COLES ESTAS CORES DIRETAMENTE AQUI:
const StaticColors = {
  primary: "#007C91",
  secondary: "#A4FF73",
  accent: "#B2EBF2", 
  danger: "#FF5E5E",
  success: "#A4FF73",
};

const lightTheme = {
  ...StaticColors,
  background: "#F5F5F5",
  surface: "#FFFFFF",
  textPrimary: "#333333",
  textSecondary: "#666666",
  border: "#E0E0E0",
};

const darkTheme = {
  ...StaticColors,
  background: "#2F2F2F",
  surface: "#3C3C3C",
  textPrimary: "#F4F9F9",
  textSecondary: "#B2EBF2",
  border: "#444",
};
// FIM DAS CORES

interface ThemeContextType {
  theme: typeof darkTheme | typeof lightTheme;
  toggleTheme: () => void;
  isDark: boolean;
}
const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  toggleTheme: () => {},
  isDark: false,
});

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
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