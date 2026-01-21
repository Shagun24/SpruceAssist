# FinanceHub - Development Guide

## Project Setup

### Quick Start
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Architecture Overview

### Standalone Components
All components are standalone Angular components (no NgModule needed).

### Service Layer
- `AuthService`: Handles login/logout, manages user state in localStorage
- `FinanceService`: Provides dashboard data and transaction management

### File Structure
```
src/app/
├── services/
│   ├── auth.service.ts
│   └── finance.service.ts
├── pages/
│   ├── login/
│   │   ├── login.component.ts
│   │   ├── login.component.html
│   │   └── login.component.scss
│   └── dashboard/
│       ├── dashboard.component.ts
│       ├── dashboard.component.html
│       ├── dashboard.component.scss
│       └── components/
│           ├── header/
│           │   ├── header.component.ts
│           │   ├── header.component.html
│           │   └── header.component.scss
│           ├── overview-tab/
│           │   ├── overview-tab.component.ts
│           │   ├── overview-tab.component.html
│           │   └── overview-tab.component.scss
│           └── transactions-tab/
│               ├── transactions-tab.component.ts
│               ├── transactions-tab.component.html
│               └── transactions-tab.component.scss
├── app.component.ts
├── app.routes.ts
└── app.config.ts
```

## Data Flow

### Authentication Flow
1. User enters credentials on Login page
2. AuthService processes login and stores token + user in localStorage
3. User redirected to Dashboard
4. On page reload, AuthService checks localStorage for auth token
5. If token exists, user is automatically logged in

### Finance Data Flow
1. Dashboard loads Overview/Transactions components
2. Components inject FinanceService
3. Service returns mock JSON data with simulated network delay
4. Components format and display data

## Key Features

### Login Page
- Email validation (format check)
- Password validation (min 6 characters)
- Loading state with spinner
- Error handling
- Session persistence in localStorage
- Responsive dark theme

### Dashboard Layout
- Sticky header with logo and user menu
- Tab navigation (Overview/Transactions)
- Smooth tab transitions
- Full responsive layout

### Overview Tab
- Total Balance card (gradient design)
- Income/Expense cards (color-coded)
- Savings available calculation
- Expense breakdown visualization
- Recent transaction activity list

### Transactions Tab
- Filterable list (All/Income/Expense)
- Sortable by date or amount
- Responsive table layout
- Status badges (Success/Pending/Failed)
- Color-coded amounts

## Component Communication

### Input/Output Pattern
```typescript
// Parent Component
<app-header
  [currentUser]="currentUser"
  (logout)="logout()"
></app-header>

// Child Component
@Input() currentUser: User | null = null;
@Output() logout = new EventEmitter<void>();
```

## State Management

### localStorage
- `authToken`: User's authentication token
- `currentUser`: User profile object (JSON)

### Component State
- Uses RxJS Observables via services
- Subscriptions cleaned up on component destroy

## Styling System

### CSS Variables
All colors, spacing, and transitions available as CSS custom properties:
```scss
.element {
  background: var(--color-bg-surface);
  padding: var(--spacing-lg);
  transition: var(--transition-base);
}
```

### SCSS Variables
Used in component stylesheets for type-safe customization:
```scss
@import '../../styles/theme.scss';

.card {
  background-color: $color-bg-surface;
  border-radius: $border-radius-lg;
}
```

## Responsive Breakpoints

```scss
// Mobile first
@media (min-width: 640px) { /* Small devices */ }
@media (min-width: 768px) { /* Tablets */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1280px) { /* Large desktop */ }
```

## Adding New Features

### Create a New Component
```bash
ng generate component pages/new-page --style=scss
```

### Create a New Service
```bash
ng generate service services/new-service
```

### Styling Guidelines
1. Import theme: `@import '../../styles/theme.scss';`
2. Use SCSS variables for values
3. Use CSS custom properties in HTML
4. Keep component styles in component.scss file
5. Don't use !important

## Testing the App

### Manual Testing Scenarios

**Login Page**
- Enter valid email and 6+ char password → Login succeeds
- Invalid email format → Shows error
- Short password → Shows error
- Submit form → Shows loading spinner

**Dashboard**
- Login with any valid email → Lands on Dashboard
- Click user avatar → Menu appears with logout option
- Click Overview/Transactions tabs → Tab switches with animation
- Logout → Redirected to login page

**Overview Tab**
- Cards display with correct colors
- Recent activity shows 5 latest transactions
- Income amounts shown in green
- Expense amounts shown in red

**Transactions Tab**
- Filter buttons work (All/Income/Expense)
- Sort dropdown works (Date/Amount)
- Status badges correctly colored
- Amounts color-coded by type

## Common Customizations

### Change Primary Color
Edit `src/styles/theme.scss`:
```scss
$color-primary-accent: #YOUR_COLOR;
```

### Add New Transaction Type
Edit `FinanceService` and update components to handle new types.

### Modify Mock Data
Edit `FinanceService` constructor to change default data.

### Change Card Styling
Edit component `.scss` files or global `globals.scss`.

## Performance Tips

1. **Lazy Load Components**: Update routes to use lazy loading
2. **OnPush Strategy**: Add `ChangeDetectionStrategy.OnPush` to components
3. **Unsubscribe**: Use `takeUntilDestroyed()` or `ngOnDestroy` hook
4. **Optimize Images**: Use responsive images with srcset
5. **CSS in JS Minimization**: Keep inline styles minimal

## Browser DevTools Tips

### Debug localStorage
```javascript
localStorage.getItem('authToken')
localStorage.getItem('currentUser')
localStorage.clear() // Clear all data
```

### Performance Profiling
1. Open DevTools → Performance tab
2. Record interactions
3. Look for jank or long tasks
4. Optimize identified bottlenecks

## Common Issues & Solutions

### Issue: Components not updating
**Solution**: Ensure services return Observables and components subscribe properly

### Issue: Styles not applying
**Solution**: Check SCSS import order, ensure variables are imported before use

### Issue: Responsive layout breaks
**Solution**: Test all breakpoints, adjust media queries as needed

### Issue: localStorage not persisting
**Solution**: Check browser security settings, ensure not in private mode

## Build & Deployment

### Development Build
```bash
npm start
```

### Production Build
```bash
npm run build
```
Output in `dist/finance-dashboard/`

### Serve Production Build Locally
```bash
npx http-server dist/finance-dashboard/
```

## Further Resources

- Angular Docs: https://angular.io/docs
- SCSS Guide: https://sass-lang.com/guide
- TypeScript Handbook: https://www.typescriptlang.org/docs/

## Support & Contributing

For questions or improvements, refer to the main README.md
