// constants/Colors.ts
// Cores estáticas que não mudam com o tema
export const StaticColors = {
  primary: "#007C91",
  secondary: "#A4FF73",
  accent: "#B2EBF2",
  danger: "#FF5E5E",
  success: "#A4FF73",
};

// Temas claro e escuro
export const lightTheme = {
  ...StaticColors,
  background: "#F5F5F5",
  surface: "#FFFFFF",
  textPrimary: "#333333",
  textSecondary: "#666666",
  border: "#E0E0E0",
};

export const darkTheme = {
  ...StaticColors,
  background: "#2F2F2F",
  surface: "#3C3C3C",
  textPrimary: "#F4F9F9",
  textSecondary: "#B2EBF2",
  border: "#444",
};

// Tema padrão para compatibilidade
export default darkTheme;