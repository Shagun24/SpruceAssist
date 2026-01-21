# Dark Theme Finance Dashboard - SCSS Architecture

## File Organization

```
src/
├── styles/
│   ├── theme.scss          # SCSS variables and theme configuration
│   └── globals.scss        # Global styles, typography, utilities
└── styles.scss             # Main entry point
```

## SCSS Variable System

### Colors (from theme.scss)
- `$color-bg-app`: #0B0F1A (darkest background)
- `$color-bg-surface`: #131A2A (card surfaces)
- `$color-bg-elevated`: #1B2338 (elevated elements)
- `$color-primary-accent`: #6C8BFF (primary blue)
- `$color-secondary-accent`: #2DD4BF (teal)
- `$color-text-primary`: #FFFFFF (main text)
- `$color-text-secondary`: #A1A8C3 (muted text)
- `$color-success`: #22C55E (green)
- `$color-danger`: #EF4444 (red)
- `$color-warning`: #F59E0B (amber)

### Spacing Scale
- `$spacing-xs`: 4px
- `$spacing-sm`: 8px
- `$spacing-md`: 16px
- `$spacing-lg`: 24px
- `$spacing-xl`: 32px
- `$spacing-xxl`: 48px

### Border Radius
- `$border-radius-sm`: 8px
- `$border-radius-md`: 12px
- `$border-radius-lg`: 16px
- `$border-radius-xl`: 20px

### Shadows
- `$shadow-sm`: 0 4px 12px rgba(0, 0, 0, 0.15)
- `$shadow-md`: 0 8px 24px rgba(0, 0, 0, 0.25)
- `$shadow-lg`: 0 10px 30px rgba(0, 0, 0, 0.35)
- `$shadow-xl`: 0 20px 40px rgba(0, 0, 0, 0.45)

### Transitions
- `$transition-fast`: all 0.15s ease
- `$transition-base`: all 0.2s ease
- `$transition-slow`: all 0.3s ease

## Global Styles Structure

### 1. CSS Variables (from globals.scss)
All SCSS variables are exported as CSS custom properties for dynamic use:
```scss
:root {
  --color-bg-app: #0B0F1A;
  --spacing-md: 16px;
  --transition-base: all 0.2s ease;
  /* ... more variables */
}
```

### 2. Base Styles
- HTML/Body defaults
- Font family and smoothing
- Overflow handling

### 3. Typography
- Heading hierarchy (h1-h6)
- Paragraph and link styling
- Font weights and sizes

### 4. Form Elements
- Input field styling
- Placeholder colors
- Focus states with accent borders
- Disabled states

### 5. Buttons
- Primary button (gradient background)
- Secondary button (transparent with border)
- Ghost button (minimal style)
- Hover and active states
- Disabled states

### 6. Scrollbar Styling
- Custom webkit scrollbar
- Hover effects

### 7. Utility Classes
- Flexbox helpers (`.flex-center`, `.flex-between`)
- Text utilities (`.text-muted`, `.text-success`, etc.)
- Spacing utilities (`.mt-1`, `.mb-2`, `.ml-3`, etc.)

## Component Styling Patterns

### Card Components
```scss
.card {
  background-color: $color-bg-surface;
  border: 1px solid rgba($color-text-primary, 0.08);
  border-radius: $border-radius-lg;
  padding: $spacing-lg;
  transition: $transition-base;

  &:hover {
    border-color: rgba($color-primary-accent, 0.2);
    transform: translateY(-4px);
    box-shadow: $shadow-md;
  }
}
```

### Input Fields
```scss
input {
  background-color: rgba($color-bg-surface, 0.7);
  border: 1px solid rgba($color-text-primary, 0.1);
  
  &:focus {
    border-color: $color-primary-accent;
    box-shadow: 0 0 0 3px rgba($color-primary-accent, 0.1);
  }
}
```

### Buttons
```scss
.btn-primary {
  background: linear-gradient(135deg, $color-primary-accent, lighten($color-primary-accent, 10%));
  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-lg;
  }
}
```

## CSS Variables in HTML/Components

Use CSS variables in component templates:
```html
<div style="background-color: var(--color-bg-surface); padding: var(--spacing-lg);">
  Content
</div>
```

Or in component SCSS:
```scss
.element {
  background-color: var(--color-bg-surface);
  padding: var(--spacing-lg);
  transition: var(--transition-base);
}
```

## Responsive Design

### Mobile-First Approach
```scss
.element {
  // Default mobile styles
  font-size: 14px;
  
  // Tablet and up
  @media (min-width: 768px) {
    font-size: 16px;
  }
  
  // Desktop
  @media (min-width: 1024px) {
    font-size: 18px;
  }
}
```

## Animation Guidelines

### Smooth Transitions
- Use `$transition-base` (0.2s) for most interactions
- Use `$transition-fast` (0.15s) for quick feedback
- Use `$transition-slow` (0.3s) for page transitions

### Keyframe Animations
```scss
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## Color Usage Guide

### Primary Accent (#6C8BFF)
- CTA buttons
- Links
- Active states
- Accent borders
- Status indicators

### Secondary Accent (#2DD4BF)
- Savings indicators
- Highlights
- Secondary CTAs

### Success Green (#22C55E)
- Income amounts
- Success messages
- Positive indicators

### Danger Red (#EF4444)
- Expense amounts
- Error messages
- Danger alerts

### Text Colors
- Primary (#FFFFFF): Headlines, important text
- Secondary (#A1A8C3): Body text, metadata, labels

## Performance Considerations

1. **Minimize Repaints**: Use `transform` for animations, not `top`/`left`
2. **GPU Acceleration**: Apply `will-change` sparingly
3. **CSS Variables**: Modern browsers handle them efficiently
4. **Specificity**: Keep selectors simple and efficient
5. **Media Queries**: Use desktop-first or mobile-first consistently

## Customization Tips

### Change Accent Color
Edit `theme.scss`:
```scss
$color-primary-accent: #YOUR_COLOR;
```

### Adjust Spacing
Edit spacing scale in `theme.scss`:
```scss
$spacing-lg: 28px; // Increased from 24px
```

### Modify Border Radius
Edit `theme.scss`:
```scss
$border-radius-lg: 20px; // Increased from 16px
```

### Update Shadows
Edit shadow definitions in `theme.scss`:
```scss
$shadow-lg: 0 15px 40px rgba(0, 0, 0, 0.4);
```

## Browser Compatibility

- Modern CSS custom properties (IE 11 not supported)
- Modern SCSS features (mixins, functions)
- Flexbox and Grid support required
- Transform and transitions supported

## Best Practices

1. Always use variables instead of hardcoded values
2. Maintain consistent spacing using the scale
3. Use semantic color names
4. Apply transitions consistently
5. Test responsive breakpoints
6. Keep component styles isolated
7. Avoid specificity wars with proper nesting
8. Use SCSS functions for color adjustments (lighten, darken)
