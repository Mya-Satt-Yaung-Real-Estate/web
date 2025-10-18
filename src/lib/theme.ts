/**
 * Centralized Theme Configuration
 * 
 * This file defines all theme colors, variants, and utilities
 * to ensure consistency across the entire application.
 */

// ============================================================================
// COLOR PALETTE
// ============================================================================

export const colors = {
  // Primary Jade Green Palette
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // Main primary
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  
  // Jade Green (Brand Color)
  jade: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#4a9b82', // Brand jade
    600: '#2d6b5a',
    700: '#1f4a3d',
    800: '#1a3d32',
    900: '#143128',
    950: '#0a1a15',
  },
  
  // Secondary Purple Palette
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
    950: '#3b0764',
  },
  
  // Neutral Grays
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },
  
  // Status Colors
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },
  
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },
  
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
  
  info: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
} as const;

// ============================================================================
// THEME CONFIGURATION
// ============================================================================

export const theme = {
  colors,
  
  // CSS Custom Properties for Tailwind (Light Mode Only) - matching Figma exactly
  cssVariables: {
    '--font-size': '16px',
    '--background': '#fafafa',
    '--foreground': '#0a0a0a',
    '--card': '#ffffff',
    '--card-foreground': '#0a0a0a',
    '--popover': '#ffffff',
    '--popover-foreground': '#0a0a0a',
    '--primary': '#36846E', // Jade green from Figma
    '--primary-foreground': '#ffffff',
    '--secondary': '#f1f5f9', // Light gray from Figma
    '--secondary-foreground': '#0f172a',
    '--muted': '#f1f5f9',
    '--muted-foreground': '#64748b',
    '--accent': '#f8fafc',
    '--accent-foreground': '#0f172a',
    '--destructive': '#ef4444',
    '--destructive-foreground': '#ffffff',
    '--border': '#e2e8f0',
    '--input': '#e2e8f0',
    '--input-background': '#ffffff',
    '--switch-background': '#cbd5e1',
    '--font-weight-medium': '600',
    '--font-weight-normal': '400',
    '--ring': '#36846E',
    '--chart-1': '#36846E',
    '--chart-2': '#4a9b82',
    '--chart-3': '#2d6b5a',
    '--chart-4': '#5eb396',
    '--chart-5': '#73c5aa',
    '--radius': '0.75rem',
    '--sidebar': '#ffffff',
    '--sidebar-foreground': '#0a0a0a',
    '--sidebar-primary': '#36846E',
    '--sidebar-primary-foreground': '#ffffff',
    '--sidebar-accent': '#f8fafc',
    '--sidebar-accent-foreground': '#0f172a',
    '--sidebar-border': '#e2e8f0',
    '--sidebar-ring': '#36846E',
  },
  
  // Component-specific theme variants
  variants: {
    // Button variants
    button: {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
    },
    
    // Navigation variants
    navigation: {
      active: 'text-primary bg-primary/10',
      inactive: 'text-muted-foreground hover:text-foreground',
      hover: 'hover:bg-accent/50',
    },
    
    // Card variants
    card: {
      default: 'bg-card text-card-foreground border-border',
      elevated: 'bg-card text-card-foreground border-border shadow-lg',
      glass: 'bg-card/50 backdrop-blur-sm border-border/50',
    },
    
    // Input variants
    input: {
      default: 'border-input bg-background',
      focus: 'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    },
  },
  
  // Animation configurations
  animations: {
    gradient: 'background-size: 200% 200%; animation: gradient 3s ease infinite;',
    fadeIn: 'animation: fadeIn 0.5s ease-in;',
    scale: 'transition-transform hover:scale-105',
    translate: 'transition-transform hover:translate-y-[-2px]',
  },
  
  // Spacing and sizing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  
  // Border radius
  radius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get theme color with opacity
 */
export function getColorWithOpacity(color: string, opacity: number): string {
  return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
}

/**
 * Generate gradient classes
 */
export function getGradientClasses(
  from: string,
  via?: string,
  to?: string,
  direction: 'r' | 'l' | 't' | 'b' | 'br' | 'bl' | 'tr' | 'tl' = 'r'
): string {
  const directionClass = `bg-gradient-to-${direction}`;
  const fromClass = `from-${from}`;
  const viaClass = via ? `via-${via}` : '';
  const toClass = to ? `to-${to}` : `to-${from}`;
  
  return `${directionClass} ${fromClass} ${viaClass} ${toClass}`.trim();
}

/**
 * Get active state classes
 */
export function getActiveStateClasses(isActive: boolean): string {
  return isActive 
    ? 'text-primary bg-primary/10 border-primary/20' 
    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50';
}

/**
 * Get hover state classes
 */
export function getHoverStateClasses(): string {
  return 'transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-primary/20';
}

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type ThemeMode = 'light' | 'dark';
export type ColorVariant = keyof typeof colors;
export type ComponentVariant = keyof typeof theme.variants;

// Export theme as default
export default theme;
