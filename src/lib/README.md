# 🎨 Theme System Documentation

## Overview

This centralized theme system ensures consistency across the entire Jade Property application. It provides a unified approach to colors, styling, and component theming.

## 📁 File Structure

```
src/lib/
├── theme.ts              # Core theme configuration
├── component-styles.ts   # Component-specific styling
└── README.md            # This documentation

src/contexts/
└── ThemeContext.tsx     # Theme provider and hooks
```

## 🎯 Key Features

### ✅ **Centralized Color Management**
- All colors defined in one place
- Consistent color palette across components
- Easy to maintain and update

### ✅ **Component Styling System**
- Pre-defined styling classes for all components
- Consistent hover, active, and focus states
- Reusable utility functions

### ✅ **Theme Provider**
- Light/Dark mode support
- System preference detection
- Persistent theme selection

### ✅ **Type Safety**
- Full TypeScript support
- IntelliSense for all theme properties
- Compile-time error checking

## 🚀 Usage Examples

### 1. Using Theme Colors

```typescript
import { colors } from '@/lib/theme';

// Access specific colors
const primaryColor = colors.jade[500]; // '#4a9b82'
const successColor = colors.success[500]; // '#22c55e'
```

### 2. Using Component Styles

```typescript
import { getButtonClasses, getCardClasses } from '@/lib/component-styles';

// Button with primary variant
const buttonClass = getButtonClasses('primary', 'lg');

// Card with glass effect and hover lift
const cardClass = getCardClasses('glass', 'lift');
```

### 3. Using Theme Context

```typescript
import { useTheme } from '@/contexts/ThemeContext';

function MyComponent() {
  const { mode, toggleMode, isDark } = useTheme();
  
  return (
    <button onClick={toggleMode}>
      {isDark ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
```

## 🎨 Color Palette

### Primary Colors (Jade Green)
```typescript
colors.jade = {
  50: '#f0fdf4',   // Lightest
  500: '#4a9b82',  // Main brand color
  950: '#0a1a15',  // Darkest
}
```

### Status Colors
```typescript
colors.success[500]  // Green: '#22c55e'
colors.warning[500]  // Orange: '#f59e0b'
colors.error[500]    // Red: '#ef4444'
colors.info[500]     // Blue: '#3b82f6'
```

## 🧩 Component Styling

### Navigation Components
```typescript
import { navigationStyles, getNavigationLinkClasses } from '@/lib/component-styles';

// Navigation container
<nav className={navigationStyles.container}>

// Navigation links with active state
<Link className={getNavigationLinkClasses(isActive)}>
```

### Button Components
```typescript
import { getButtonClasses } from '@/lib/component-styles';

// Primary button
<button className={getButtonClasses('primary', 'lg')}>

// Gradient button
<button className={getButtonClasses('gradient', 'default')}>
```

### Card Components
```typescript
import { getCardClasses } from '@/lib/component-styles';

// Glass card with hover effect
<div className={getCardClasses('glass', 'lift')}>

// Elevated card
<div className={getCardClasses('elevated')}>
```

## 🔄 Active States

### Navigation Links
- **Active**: `text-primary bg-primary/10 border-primary/20`
- **Inactive**: `text-muted-foreground hover:text-foreground hover:bg-accent/50`

### Buttons
- **Primary**: `bg-primary text-primary-foreground hover:bg-primary/90`
- **Outline**: `border border-input hover:bg-accent hover:text-accent-foreground`

### Cards
- **Interactive**: `cursor-pointer hover:border-primary/50 transition-all`
- **Selected**: `border-primary/50 bg-primary/5 shadow-lg shadow-primary/10`

## 🌙 Dark Mode Support

### Automatic Detection
```typescript
// System preference detection
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
```

### Manual Toggle
```typescript
import { useTheme } from '@/contexts/ThemeContext';

const { toggleMode, isDark } = useTheme();
```

### CSS Variables
```css
:root {
  --primary: 142 76% 36%;        /* Light mode */
}

.dark {
  --primary: 142 76% 36%;        /* Dark mode (same for consistency) */
}
```

## 📱 Responsive Design

### Breakpoints
```typescript
// Mobile first approach
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

### Spacing
```typescript
import { layoutClasses } from '@/lib/component-styles';

// Container with responsive padding
<div className={layoutClasses.container}>

// Section with consistent spacing
<section className={layoutClasses.section}>
```

## 🎭 Animation Classes

```typescript
import { animationClasses } from '@/lib/component-styles';

// Fade in animation
<div className={animationClasses.fadeIn}>

// Gradient animation
<div className={animationClasses.gradient}>

// Scale on hover
<div className={animationClasses.scale}>
```

## 🔧 Customization

### Adding New Colors
```typescript
// In theme.ts
export const colors = {
  // ... existing colors
  custom: {
    50: '#f0f9ff',
    500: '#0ea5e9',
    950: '#0c4a6e',
  },
};
```

### Creating New Component Styles
```typescript
// In component-styles.ts
export const customStyles = {
  base: 'base-classes',
  variant: 'variant-classes',
  hover: 'hover-classes',
};
```

## 🚨 Best Practices

### ✅ Do's
- Use centralized theme colors
- Use component styling functions
- Follow the established patterns
- Test in both light and dark modes

### ❌ Don'ts
- Don't hardcode colors in components
- Don't create inline styles
- Don't bypass the theme system
- Don't mix different styling approaches

## 🐛 Troubleshooting

### Common Issues

1. **Colors not updating**
   - Check if ThemeProvider is wrapping your app
   - Verify CSS variables are being applied

2. **Dark mode not working**
   - Ensure ThemeContext is imported
   - Check localStorage for theme preference

3. **Component styles not applying**
   - Verify component-styles import
   - Check if classes are being overridden

## 📚 Additional Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [React Context API](https://reactjs.org/docs/context.html)

---

**Last Updated**: October 2025  
**Version**: 1.0.0  
**Maintainer**: Jade Property Development Team

