import React, { createContext, useContext, useState } from 'react';
import { lightTheme, darkTheme } from '../constants/Colors';

interface ThemeContextType {
  theme: typeof darkTheme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: darkTheme,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [theme, setTheme] = useState(darkTheme);

  const toggleTheme = () => {
    setTheme(theme.dark ? lightTheme : darkTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
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