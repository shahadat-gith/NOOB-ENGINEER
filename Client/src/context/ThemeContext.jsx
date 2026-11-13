import { useEffect, useMemo, useState } from 'react';
import { ThemeContext } from './themeContext.js';

function getInitialTheme() {
  try {
    const stored = localStorage.getItem('ne-theme');
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {
    // Fall back to the document theme if local storage is unavailable.
  }
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('ne-theme', theme);
    } catch {
      // The theme still applies for this session if storage is unavailable.
    }
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((current) => current === 'dark' ? 'light' : 'dark'),
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
