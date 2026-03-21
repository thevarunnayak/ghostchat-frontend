const THEME_KEY = "neo-theme";

export const applyTheme = (theme: string) => {
  document.documentElement.className = theme;
};

export const setTheme = (theme: string) => {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
};

export const getTheme = () => {
  return localStorage.getItem(THEME_KEY) || "theme-green";
};