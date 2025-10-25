/**
 * Theme Configuration
 * 
 * Theme-related configuration and utilities.
 */

// ============================================================================
// THEME CONFIGURATION
// ============================================================================

export const theme = {
  colors: {
    primary: '#4a9b82',
    secondary: '#6b7280',
    accent: '#f59e0b',
    background: '#ffffff',
    foreground: '#0f172a',
    muted: '#f1f5f9',
    border: '#e2e8f0',
  },
  fonts: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    serif: ['Georgia', 'serif'],
    mono: ['Fira Code', 'monospace'],
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },
  cssVariables: {
    '--primary': '#4a9b82',
    '--secondary': '#6b7280',
    '--accent': '#f59e0b',
    '--background': '#ffffff',
    '--foreground': '#0f172a',
    '--muted': '#f1f5f9',
    '--border': '#e2e8f0',
  },
} as const;

// ============================================================================
// THEME UTILITIES
// ============================================================================

export function getThemeColor(color: keyof typeof theme.colors): string {
  return theme.colors[color];
}

export function getBreakpoint(breakpoint: keyof typeof theme.breakpoints): string {
  return theme.breakpoints[breakpoint];
}

export function getSpacing(size: keyof typeof theme.spacing): string {
  return theme.spacing[size];
}
