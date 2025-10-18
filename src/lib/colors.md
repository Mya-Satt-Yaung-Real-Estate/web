# 🎨 Jade Property Color System

## **Primary Colors**

### **Primary Color (Main Brand)**
- **Hex**: `#36846E`
- **Usage**: Main brand color, primary buttons, active states, "Jade Property" text
- **CSS Variable**: `--primary`
- **Tailwind Class**: `text-primary`, `bg-primary`, `border-primary`

### **Secondary Color (Light Gray)**
- **Hex**: `#f1f5f9`
- **Usage**: Secondary backgrounds, subtle elements, cards
- **CSS Variable**: `--secondary`
- **Tailwind Class**: `text-secondary`, `bg-secondary`, `border-secondary`

### **Gradient Colors (For Buttons)**
- **From**: `#36846E` (Primary)
- **To**: `#4a9b82` (Light Jade)
- **Usage**: Sign In button, gradient backgrounds
- **CSS Class**: `gradient-primary`

## **Color Usage Guidelines**

### **Text Colors**
```css
/* Primary text (brand elements) */
.text-primary { color: hsl(var(--primary)); }

/* Secondary text (accents) */
.text-secondary { color: hsl(var(--secondary)); }

/* Muted text (subtle elements) */
.text-muted-foreground { color: hsl(var(--muted-foreground)); }
```

### **Background Colors**
```css
/* Primary background */
.bg-primary { background-color: hsl(var(--primary)); }

/* Secondary background */
.bg-secondary { background-color: hsl(var(--secondary)); }

/* Gradient background */
.gradient-primary { 
  background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%); 
}
```

### **Border Colors**
```css
/* Primary border */
.border-primary { border-color: hsl(var(--primary)); }

/* Secondary border */
.border-secondary { border-color: hsl(var(--secondary)); }
```

## **Component Usage**

### **Navigation**
- **"Jade Property" Text**: `text-primary` (solid jade green)
- **Active Links**: `text-primary` (jade green)
- **Sign In Button**: `gradient-primary` (primary to secondary gradient)

### **Buttons**
- **Primary Button**: `bg-primary text-primary-foreground`
- **Secondary Button**: `bg-secondary text-secondary-foreground`
- **Gradient Button**: `gradient-primary text-white`

### **Cards**
- **Primary Card**: `border-primary` for emphasis
- **Secondary Card**: `border-secondary` for subtle emphasis

## **Color Accessibility**

### **Contrast Ratios**
- **Primary on White**: 4.5:1 (WCAG AA compliant)
- **White on Primary**: 4.5:1 (WCAG AA compliant)
- **Secondary on White**: 3.5:1 (WCAG AA compliant)

### **Usage Rules**
1. **Always use primary for main brand elements**
2. **Use secondary for accents and gradients**
3. **Ensure sufficient contrast for readability**
4. **Test with color blindness simulators**

## **Implementation**

### **CSS Variables**
```css
:root {
  --primary: 142 76% 36%;        /* #36846E */
  --primary-foreground: 210 40% 98%; /* White */
  --secondary: 142 76% 50%;      /* #4a9b82 */
  --secondary-foreground: 210 40% 98%; /* White */
}
```

### **Tailwind Classes**
```html
<!-- Primary text -->
<span class="text-primary">Jade Property</span>

<!-- Primary button -->
<button class="bg-primary text-primary-foreground">Sign In</button>

<!-- Gradient button -->
<button class="gradient-primary text-white">Sign In</button>

<!-- Secondary accent -->
<div class="bg-secondary text-secondary-foreground">Content</div>
```

## **Design System Integration**

### **Theme Provider**
The color system is integrated with our theme provider for consistent usage across components.

### **Component Styling**
All components use the centralized color system for consistency.

### **Responsive Design**
Colors work across all screen sizes and devices.

---

**Last Updated**: October 2025  
**Version**: 1.0.0  
**Maintainer**: Jade Property Development Team
