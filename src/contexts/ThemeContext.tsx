import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { theme } from '@/lib/theme';

interface ThemeContextType {
  // Simplified theme context for light mode only
  isLight: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Apply light mode theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove any dark mode classes
    root.classList.remove('dark');
    root.classList.add('light');
    
    // Apply CSS variables for light mode
    Object.entries(theme.cssVariables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ isLight: true }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
