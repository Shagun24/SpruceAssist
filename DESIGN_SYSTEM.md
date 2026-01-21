# Design System - FinanceHub Dark Theme

## Color Palette Reference

### Primary Colors
```
┌─────────────────────────────┬────────┬─────────────────────┐
│ Name                        │ Hex    │ RGB                 │
├─────────────────────────────┼────────┼─────────────────────┤
│ App Background (Darkest)    │ #0B0F1A│ rgb(11, 15, 26)     │
│ Surface / Cards             │ #131A2A│ rgb(19, 26, 42)     │
│ Elevated Cards              │ #1B2338│ rgb(27, 35, 56)     │
│ Primary Accent (Blue)       │ #6C8BFF│ rgb(108, 139, 255)  │
│ Secondary Accent (Teal)     │ #2DD4BF│ rgb(45, 212, 191)   │
└─────────────────────────────┴────────┴─────────────────────┘
```

### Text Colors
```
┌─────────────────────────────┬────────┬─────────────────────┐
│ Name                        │ Hex    │ RGB                 │
├─────────────────────────────┼────────┼─────────────────────┤
│ Text Primary (Headlines)    │ #FFFFFF│ rgb(255, 255, 255) │
│ Text Secondary (Body)       │ #A1A8C3│ rgb(161, 168, 195) │
└─────────────────────────────┴────────┴─────────────────────┘
```

### Status Colors
```
┌─────────────────────────────┬────────┬─────────────────────┐
│ Name                        │ Hex    │ RGB                 │
├─────────────────────────────┼────────┼─────────────────────┤
│ Success (Income)            │ #22C55E│ rgb(34, 197, 94)    │
│ Danger (Expense)            │ #EF4444│ rgb(239, 68, 68)    │
│ Warning (Pending)           │ #F59E0B│ rgb(245, 158, 11)   │
└─────────────────────────────┴────────┴─────────────────────┘
```

## Typography

### Font Family
- Primary: System UI (Inter-like)
- Fallback: Segoe UI, Roboto, Helvetica Neue, sans-serif

### Type Scale
```
H1: 32px / 700 weight / 1.2 line-height
H2: 24px / 600 weight / 1.2 line-height
H3: 20px / 600 weight / 1.2 line-height
H4: 16px / 600 weight / 1.2 line-height
H5: 14px / 600 weight / 1.6 line-height
H6: 12px / 600 weight / 1.2 line-height

Body: 14px / 400 weight / 1.6 line-height
Small: 12px / 400 weight / 1.4 line-height
XSmall: 11px / 500 weight / 1.4 line-height
```

### Font Weights
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

## Spacing System

### Scale
```
xs:  4px
sm:  8px
md:  16px  (base)
lg:  24px  (standard card padding)
xl:  32px  (section padding)
xxl: 48px  (large spacing)
```

### Usage
- **Card padding**: lg (24px)
- **Inner spacing**: md (16px)
- **List items**: md (16px)
- **Section gaps**: lg (24px)
- **Page padding**: xl (32px)

## Border Radius

### Scale
```
sm: 8px   (buttons, small elements)
md: 12px  (form inputs)
lg: 16px  (cards, main elements)
xl: 20px  (hero sections)
```

### Usage
- **Buttons**: md (12px)
- **Input fields**: md (12px)
- **Cards**: lg (16px)
- **Major components**: lg (16px)

## Shadows

### System
```
sm: 0 4px 12px rgba(0, 0, 0, 0.15)       → Hover states
md: 0 8px 24px rgba(0, 0, 0, 0.25)       → Elevated cards
lg: 0 10px 30px rgba(0, 0, 0, 0.35)      → Modals, overlays
xl: 0 20px 40px rgba(0, 0, 0, 0.45)      → Maximum depth
```

### Application
- **Card default**: md shadow
- **Card hover**: lg shadow
- **Modal**: xl shadow
- **Dropdown**: lg shadow

## Component Design

### Cards
```css
Background: $color-bg-surface
Border: 1px solid rgba(255, 255, 255, 0.08)
Padding: 24px
Border Radius: 16px
Shadow: 0 8px 24px rgba(0, 0, 0, 0.25)
Transition: 0.2s ease
```

**Hover State**
```css
Background: $color-bg-elevated
Border Color: rgba(108, 139, 255, 0.2)
Transform: translateY(-4px)
Shadow: 0 10px 30px rgba(0, 0, 0, 0.35)
```

### Buttons

**Primary Button (CTA)**
```css
Background: linear-gradient(135deg, #6C8BFF, #7DA3FF)
Color: white
Padding: 12px 24px
Height: 44px
Border Radius: 12px
Font Weight: 600
Shadow: 0 8px 24px rgba(0, 0, 0, 0.25)
Transition: 0.2s ease
```

**Hover State**
```css
Transform: translateY(-2px)
Shadow: 0 10px 30px rgba(0, 0, 0, 0.35)
Background: Lighter gradient
```

**Secondary Button**
```css
Background: rgba(45, 212, 191, 0.1)
Color: #2DD4BF
Border: 1px solid #2DD4BF
Padding: 12px 24px
```

**Ghost Button**
```css
Background: transparent
Color: $color-text-secondary
Border: 1px solid rgba(255, 255, 255, 0.1)
Padding: 12px 24px
```

### Input Fields
```css
Background: rgba(19, 26, 42, 0.7)
Border: 1px solid rgba(255, 255, 255, 0.1)
Padding: 12px 16px
Border Radius: 12px
Color: white
Font Size: 14px
```

**Focus State**
```css
Border Color: #6C8BFF
Background: #131A2A
Box Shadow: 0 0 0 3px rgba(108, 139, 255, 0.1)
```

### Status Indicators

**Success (Income)**
```css
Background: rgba(34, 197, 94, 0.1)
Color: #22C55E
Border: Optional 1px solid #22C55E
```

**Danger (Expense)**
```css
Background: rgba(239, 68, 68, 0.1)
Color: #EF4444
Border: Optional 1px solid #EF4444
```

**Pending (Warning)**
```css
Background: rgba(245, 158, 11, 0.1)
Color: #F59E0B
Border: Optional 1px solid #F59E0B
```

## Animations

### Transitions
```
Fast:  all 0.15s ease   → Quick feedback
Base:  all 0.2s ease    → Standard interactions
Slow:  all 0.3s ease    → Page transitions
```

### Entrance Animations
```
Fade In:      0.3s ease, opacity 0→1
Slide Up:     0.5s ease, translateY(20px)→(0)
Scale In:     0.3s ease, scale(0.95)→(1)
```

### Hover Effects
```
Cards:        translateY(-4px), shadow elevation
Buttons:      translateY(-2px), shadow elevation
Links:        color change, slight scale
```

## Responsive Design

### Breakpoints
```
Mobile:   < 640px
Tablet:   640px - 1024px
Desktop:  > 1024px
```

### Responsive Adjustments
- **Typography**: Scales down on mobile
- **Spacing**: Reduces on mobile (24px → 16px)
- **Grid**: Adapts from multi-column to single on mobile
- **Cards**: Full-width on mobile, fixed width on desktop

## Layout Grid

### Spacing Units
- Base unit: 4px
- Grid: 8px increments
- Max width: 1280px on desktop
- Padding: 32px on desktop, 16px on mobile

## Accessibility

### Color Contrast
- **Text on BG**: 15:1+ ratio (white on dark navy)
- **Accent on BG**: 7:1+ ratio (blue on dark navy)
- **Status colors**: Sufficient contrast with text

### Focus States
```css
Outline: 2px solid $color-primary-accent
Offset: 2px
Transition: smooth
```

### Interactive Elements
- Minimum touch target: 44px (mobile)
- Keyboard accessible
- ARIA labels where needed
- Focus indicators visible

## Gradient Definitions

### Primary Gradient
```
Direction: 135deg (bottom-left to top-right)
Colors: #6C8BFF → #7DA3FF
Usage: Buttons, text, accents
```

### Brand Gradient
```
Direction: 135deg
Colors: #6C8BFF → #2DD4BF
Usage: Logo, major headings
```

## Dark Mode Optimization

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### High Contrast Mode
- Ensure sufficient color contrast
- Don't rely solely on color
- Use pattern or icons for status

## Theme Customization Examples

### Warm Accent (Orange instead of Blue)
```scss
$color-primary-accent: #FF9A56;  // Orange
$color-secondary-accent: #FFB86D; // Light Orange
```

### Cool Accent (Purple instead of Blue)
```scss
$color-primary-accent: #A78BFF;   // Purple
$color-secondary-accent: #B8A3FF; // Light Purple
```

### Light Status Colors
```scss
$color-success: #34D399;  // Lighter green
$color-danger: #F87171;   // Lighter red
```

## UI Patterns

### Card Section Pattern
```html
<div class="section">
  <div class="section-header">
    <h3>Section Title</h3>
  </div>
  <div class="card-container">
    <!-- Cards go here -->
  </div>
</div>
```

### Status Badge Pattern
```html
<span class="status-badge" class="status-{type}">
  {{ status }}
</span>
```

### Amount Pattern (Income/Expense)
```html
<span class="amount" class="amount-{type}">
  {{ sign }}{{ amount }}
</span>
```

## Design Tokens Summary

| Category | Token | Value |
|----------|-------|-------|
| **Color - BG** | bg-app | #0B0F1A |
| | bg-surface | #131A2A |
| | bg-elevated | #1B2338 |
| **Color - Text** | text-primary | #FFFFFF |
| | text-secondary | #A1A8C3 |
| **Color - Accent** | accent-primary | #6C8BFF |
| | accent-secondary | #2DD4BF |
| **Color - Status** | success | #22C55E |
| | danger | #EF4444 |
| | warning | #F59E0B |
| **Spacing** | base-unit | 4px |
| | standard | 16px |
| | section | 24px |
| **Border Radius** | card | 16px |
| | input | 12px |
| | button | 12px |
| **Shadow** | card-default | 0 8px 24px rgba(0,0,0,0.25) |
| **Typography** | font-family | System UI |
| | base-size | 14px |
| | heading-h1 | 32px / 700 |

---

This design system ensures consistency across all components and provides a comprehensive reference for extending or customizing the theme.
