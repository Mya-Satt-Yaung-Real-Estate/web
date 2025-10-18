/**
 * Centralized Component Styling System
 * 
 * This file provides consistent styling classes for all components
 * to ensure theme consistency across the application.
 */

import { cn } from '@/lib/utils';

// ============================================================================
// NAVIGATION STYLES
// ============================================================================

export const navigationStyles = {
  // Container
  container: 'fixed top-0 left-0 right-0 z-50 glass border-b border-border/50 backdrop-blur-xl bg-background/80',
  
  // Logo area
  logo: {
    container: 'flex items-center gap-3 group',
    image: 'relative w-10 h-10 rounded-xl shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-all group-hover:scale-105',
    text: 'bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent background-animate', // Figma gradient text
    subtitle: 'text-muted-foreground -mt-1',
  },
  
  // Navigation links
  link: {
    base: 'relative px-4 py-2 rounded-xl transition-all group',
    active: 'text-primary bg-primary/10 border-primary/20',
    inactive: 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
    hover: 'group-hover:translate-y-[-2px] inline-block transition-transform',
    background: 'absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl',
  },
  
  // Mobile menu
  mobile: {
    trigger: 'md:hidden p-2 rounded-xl hover:bg-accent/50 transition-colors',
    menu: 'fixed inset-0 z-50 md:hidden',
    overlay: 'fixed inset-0 bg-black/50 backdrop-blur-sm',
    content: 'fixed top-0 right-0 h-full w-80 bg-background border-l border-border/50 shadow-xl',
  },
  
  // Service sheet
  serviceSheet: {
    trigger: 'flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-accent/50 transition-colors',
    content: 'w-80 sm:w-96',
  },
} as const;

// ============================================================================
// BUTTON STYLES
// ============================================================================

export const buttonStyles = {
  // Base button
  base: 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  
  // Variants
  variants: {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30 hover:shadow-primary/50',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
    gradient: 'gradient-primary text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105', // Figma Sign In button
  },
  
  // Sizes
  sizes: {
    sm: 'h-9 rounded-md px-3',
    default: 'h-10 px-4 py-2',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  },
  
  // States
  states: {
    loading: 'opacity-50 cursor-not-allowed',
    disabled: 'opacity-50 pointer-events-none',
    active: 'bg-primary/10 text-primary border-primary/20',
  },
} as const;

// ============================================================================
// CARD STYLES
// ============================================================================

export const cardStyles = {
  // Base card
  base: 'rounded-xl border bg-card text-card-foreground shadow',
  
  // Variants
  variants: {
    default: 'bg-card text-card-foreground border-border',
    elevated: 'bg-card text-card-foreground border-border shadow-lg',
    glass: 'bg-card/50 backdrop-blur-sm border-border/50',
    gradient: 'bg-gradient-to-br from-card to-card/80 border-border/50',
  },
  
  // Hover effects
  hover: {
    lift: 'hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1',
    scale: 'hover:scale-105 transition-transform duration-300',
    glow: 'hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300',
  },
  
  // Interactive states
  interactive: 'cursor-pointer hover:border-primary/50 transition-all duration-300',
  selected: 'border-primary/50 bg-primary/5 shadow-lg shadow-primary/10',
} as const;

// ============================================================================
// INPUT STYLES
// ============================================================================

export const inputStyles = {
  // Base input
  base: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  
  // States
  states: {
    focus: 'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    error: 'border-destructive focus-visible:ring-destructive',
    success: 'border-success focus-visible:ring-success',
  },
  
  // Variants
  variants: {
    default: 'border-input bg-background',
    filled: 'bg-muted border-muted',
    outlined: 'border-2 border-input bg-transparent',
  },
} as const;

// ============================================================================
// BADGE STYLES
// ============================================================================

export const badgeStyles = {
  // Base badge
  base: 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  
  // Variants
  variants: {
    default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
    secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
    outline: 'text-foreground',
    success: 'border-transparent bg-success text-white hover:bg-success/80',
    warning: 'border-transparent bg-warning text-white hover:bg-warning/80',
    info: 'border-transparent bg-info text-white hover:bg-info/80',
  },
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get navigation link classes
 */
export function getNavigationLinkClasses(isActive: boolean, className?: string): string {
  return cn(
    navigationStyles.link.base,
    isActive ? navigationStyles.link.active : navigationStyles.link.inactive,
    className
  );
}

/**
 * Get button classes
 */
export function getButtonClasses(
  variant: keyof typeof buttonStyles.variants = 'primary',
  size: keyof typeof buttonStyles.sizes = 'default',
  className?: string
): string {
  return cn(
    buttonStyles.base,
    buttonStyles.variants[variant],
    buttonStyles.sizes[size],
    className
  );
}

/**
 * Get card classes
 */
export function getCardClasses(
  variant: keyof typeof cardStyles.variants = 'default',
  hover?: keyof typeof cardStyles.hover,
  className?: string
): string {
  return cn(
    cardStyles.base,
    cardStyles.variants[variant],
    hover && cardStyles.hover[hover],
    className
  );
}

/**
 * Get input classes
 */
export function getInputClasses(
  variant: keyof typeof inputStyles.variants = 'default',
  state?: keyof typeof inputStyles.states,
  className?: string
): string {
  return cn(
    inputStyles.base,
    inputStyles.variants[variant],
    state && inputStyles.states[state],
    className
  );
}

/**
 * Get badge classes
 */
export function getBadgeClasses(
  variant: keyof typeof badgeStyles.variants = 'default',
  className?: string
): string {
  return cn(
    badgeStyles.base,
    badgeStyles.variants[variant],
    className
  );
}

// ============================================================================
// ANIMATION CLASSES
// ============================================================================

export const animationClasses = {
  fadeIn: 'animate-fade-in',
  slideIn: 'animate-slide-in',
  scaleIn: 'animate-scale-in',
  gradient: 'background-animate',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
  spin: 'animate-spin',
} as const;

// ============================================================================
// LAYOUT CLASSES
// ============================================================================

export const layoutClasses = {
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  section: 'py-16 px-4 sm:px-6 lg:px-8',
  grid: {
    cols1: 'grid-cols-1',
    cols2: 'grid-cols-2',
    cols3: 'grid-cols-3',
    cols4: 'grid-cols-4',
    responsive: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  },
  flex: {
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    start: 'flex items-center justify-start',
    end: 'flex items-center justify-end',
  },
} as const;
