# Design System Documentation

## Overview

This portfolio implements a comprehensive design system built with Tailwind CSS, featuring dark/light mode support, accessibility compliance, and modern UI patterns.

## 🎨 Color Palette

### Primary Colors (Blues)
- **Primary-50**: `#eff6ff` - Lightest blue background
- **Primary-500**: `#3b82f6` - Main blue for buttons and links
- **Primary-600**: `#2563eb` - Darker blue for hover states
- **Primary-900**: `#1e3a8a` - Darkest blue for emphasis

### Secondary Colors (Greens)
- **Secondary-500**: `#22c55e` - Main green for accents
- **Secondary-600**: `#16a34a` - Darker green for hover states
- **Secondary-900**: `#14532d` - Darkest green for emphasis

### Semantic Colors
- **Background**: Dynamic based on theme
- **Foreground**: Text color based on theme
- **Border**: Subtle borders and dividers
- **Ring**: Focus ring color for accessibility

## 🌙 Dark/Light Mode

### Implementation
- Uses `next-themes` for theme management
- Default theme: Dark mode
- Supports system preference detection
- Persists user preference in localStorage

### Theme Toggle
- Located in the header component
- Uses Lucide React icons (Sun/Moon)
- Smooth transitions between themes
- Accessible with proper ARIA labels

### CSS Custom Properties
```css
:root {
  --background: 0 0% 100%; /* Light mode */
  --foreground: 0 0% 9%;
  --primary-500: 217 91% 60%;
  --secondary-500: 142 76% 36%;
}

.dark {
  --background: 0 0% 4%; /* Dark mode */
  --foreground: 0 0% 98%;
  --primary-500: 217 91% 60%;
  --secondary-500: 142 76% 36%;
}
```

## 📝 Typography

### Font Stack
- **Primary**: Inter (Google Fonts)
- **Monospace**: Fira Code for code snippets
- **Fallback**: System fonts

### Type Scale
- **xs**: 0.75rem (12px)
- **sm**: 0.875rem (14px)
- **base**: 1rem (16px)
- **lg**: 1.125rem (18px)
- **xl**: 1.25rem (20px)
- **2xl**: 1.5rem (24px)
- **3xl**: 1.875rem (30px)
- **4xl**: 2.25rem (36px)
- **5xl**: 3rem (48px)
- **6xl**: 3.75rem (60px)

### Line Heights
- **Tight**: 1.2 for headings
- **Normal**: 1.6 for body text
- **Relaxed**: 1.7 for prose content

## 🎯 Accessibility

### WCAG 2.1 AA Compliance
- **Color Contrast**: All text meets minimum 4.5:1 ratio
- **Focus Indicators**: Visible focus rings on all interactive elements
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and landmarks

### Focus Management
```css
*:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}
```

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 🧩 Components

### Button Component
```tsx
import { Button } from "@/components/ui/button";

<Button variant="default" size="default">
  Click me
</Button>
```

**Variants:**
- `default`: Primary blue button
- `secondary`: Green accent button
- `outline`: Bordered button
- `ghost`: Minimal button

**Sizes:**
- `sm`: Small button
- `default`: Standard button
- `lg`: Large button
- `icon`: Square icon button

### Section Component
```tsx
import { Section } from "@/components/ui/section";

<Section id="about" className="bg-background-secondary">
  Content here
</Section>
```

### Theme Toggle
```tsx
import { ThemeToggle } from "@/components/ui/theme-toggle";

<ThemeToggle />
```

## 📐 Layout & Spacing

### Container System
- **Max Width**: `max-w-6xl` (72rem/1152px)
- **Padding**: `px-4 md:px-8` for responsive padding
- **Section Spacing**: `py-16 md:py-24` for consistent vertical rhythm

### Grid System
- **Mobile First**: Responsive design starting from mobile
- **Breakpoints**: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- **Flexible Grids**: CSS Grid and Flexbox for layouts

### Spacing Scale
- **4**: 1rem (16px) - Base spacing unit
- **8**: 2rem (32px) - Component spacing
- **16**: 4rem (64px) - Section spacing
- **24**: 6rem (96px) - Large section spacing

## 🎭 Animations

### Framer Motion Integration
- **Staggered Animations**: Sequential element animations
- **Scroll-triggered**: `whileInView` for scroll animations
- **Hover Effects**: Subtle scale and color transitions
- **Reduced Motion**: Respects user preferences

### Animation Classes
```css
.animate-fade-in { animation: fadeIn 0.5s ease-in-out; }
.animate-slide-up { animation: slideUp 0.3s ease-out; }
.animate-scale-in { animation: scaleIn 0.2s ease-out; }
```

## 🎨 Shadows & Effects

### Shadow System
```css
.shadow-soft {
  box-shadow: 0 2px 15px -3px rgba(0, 0, 0, 0.07), 
              0 10px 20px -2px rgba(0, 0, 0, 0.04);
}

.shadow-soft-lg {
  box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 
              0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
```

### Border Radius
- **sm**: 0.25rem (4px) - Small elements
- **md**: 0.5rem (8px) - Cards and buttons
- **lg**: 0.75rem (12px) - Large cards
- **xl**: 1rem (16px) - Hero sections
- **2xl**: 1.5rem (24px) - Large containers
- **4xl**: 2rem (32px) - Extra large elements

## 🔧 Configuration

### Tailwind Config
```typescript
// tailwind.config.ts
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: { /* Custom color palette */ },
      fontFamily: { /* Typography */ },
      animation: { /* Custom animations */ },
      // ... other extensions
    },
  },
  plugins: [/* Custom plugins */],
};
```

### PostCSS Config
```javascript
// postcss.config.mjs
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

## 📱 Responsive Design

### Breakpoints
- **sm**: 640px - Small tablets
- **md**: 768px - Tablets
- **lg**: 1024px - Laptops
- **xl**: 1280px - Desktops
- **2xl**: 1536px - Large screens

### Mobile-First Approach
- Start with mobile styles
- Add responsive modifiers for larger screens
- Use `container` class for consistent max-widths

## 🚀 Performance

### Optimizations
- **Font Loading**: `display: swap` for Inter font
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic with Next.js
- **Tree Shaking**: Tailwind JIT removes unused styles

### Bundle Size
- **Target**: <200kb gzipped
- **Current**: ~234kb (includes all dependencies)
- **Optimization**: Ongoing with component lazy loading

## 🧪 Testing

### Accessibility Testing
- **Lighthouse**: >90 score across all categories
- **axe-core**: Automated accessibility testing
- **Manual Testing**: Keyboard navigation and screen readers

### Browser Support
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile**: iOS Safari, Chrome Mobile
- **Fallbacks**: Graceful degradation for older browsers

## 📚 Usage Guidelines

### Component Development
1. Use semantic HTML elements
2. Include proper ARIA attributes
3. Test with keyboard navigation
4. Ensure color contrast compliance
5. Add hover and focus states

### Styling Best Practices
1. Use design system tokens (colors, spacing, typography)
2. Prefer utility classes over custom CSS
3. Use responsive design patterns
4. Implement proper focus management
5. Test in both light and dark modes

### Animation Guidelines
1. Respect `prefers-reduced-motion`
2. Keep animations subtle and purposeful
3. Use consistent timing and easing
4. Test performance on lower-end devices

## 🔄 Maintenance

### Regular Tasks
- Update dependencies monthly
- Review accessibility compliance
- Test across different devices and browsers
- Monitor performance metrics
- Update documentation as needed

### Version Control
- Semantic versioning for design system changes
- Changelog for breaking changes
- Migration guides for major updates

---

This design system provides a solid foundation for building accessible, performant, and visually appealing web applications while maintaining consistency across all components and pages.
