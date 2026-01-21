# Quick Reference Guide - FinanceHub Dashboard

## Quick Start (5 Minutes)

```bash
# 1. Navigate to project
cd "c:\Users\A2745203\gpt-genesis\GPT Genesis"

# 2. Install dependencies
npm install

# 3. Start development server
npm start

# 4. Open browser
# http://localhost:4200

# 5. Login with any email and password (6+ chars)
```

## Key Directories

```
src/
├── app/
│   ├── services/           # Data services (Auth, Finance)
│   ├── pages/              # Main page components
│   │   ├── login/         # Login page
│   │   └── dashboard/     # Dashboard + subcomponents
│   └── app.routes.ts      # Route configuration
├── styles/
│   ├── theme.scss         # Color palette & tokens
│   └── globals.scss       # Global styles & CSS variables
└── styles.scss            # Main entry point
```

## Color Palette (Quick Copy)

```
Primary:      #6C8BFF
Secondary:    #2DD4BF
Success:      #22C55E
Danger:       #EF4444
Warning:      #F59E0B
BG Dark:      #0B0F1A
BG Surface:   #131A2A
Text:         #FFFFFF
Text Muted:   #A1A8C3
```

## Common Commands

```bash
# Start development
npm start

# Build for production
npm run build

# Check for errors
ng build

# Generate new component
ng generate component pages/my-page --style=scss

# Generate new service
ng generate service services/my-service
```

## Component Quick Reference

### Login Component
- **Path**: `src/app/pages/login/`
- **Features**: Email/password form, validation, loading state
- **Route**: `/login`

### Dashboard Component
- **Path**: `src/app/pages/dashboard/`
- **Features**: Header, tab navigation
- **Route**: `/dashboard`

### Header Component
- **Path**: `src/app/pages/dashboard/components/header/`
- **Features**: Logo, user menu, logout

### Overview Tab
- **Path**: `src/app/pages/dashboard/components/overview-tab/`
- **Features**: Balance cards, activity feed

### Transactions Tab
- **Path**: `src/app/pages/dashboard/components/transactions-tab/`
- **Features**: Filterable/sortable transactions

## Service Quick Reference

### AuthService
```typescript
login(credentials): Observable<User>
logout(): void
isLoggedIn$: Observable<boolean>
currentUser$: Observable<User | null>
```

### FinanceService
```typescript
getDashboardData(): Observable<DashboardData>
getTransactions(): Observable<Transaction[]>
addTransaction(transaction): Observable<Transaction>
```

## Styling Quick Tips

### Use Variables in SCSS
```scss
@import '../../styles/theme.scss';

.element {
  color: $color-text-primary;
  padding: $spacing-lg;
  border-radius: $border-radius-lg;
}
```

### Use CSS Variables in HTML
```html
<div style="background: var(--color-bg-surface); padding: var(--spacing-lg);">
```

### Create a Card
```scss
.card {
  background-color: $color-bg-surface;
  border: 1px solid rgba($color-text-primary, 0.08);
  border-radius: $border-radius-lg;
  padding: $spacing-lg;
  transition: $transition-base;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-lg;
  }
}
```

## Common Customizations

### Change Primary Color
1. Edit `src/styles/theme.scss`
2. Update `$color-primary-accent: #YOUR_COLOR;`
3. Save and browser auto-refreshes

### Add New Card to Overview
1. Edit `overview-tab.component.html`
2. Add new card div with class "card"
3. Bind data from `dashboardData` object

### Add New Transaction Filter
1. Edit `transactions-tab.component.ts`
2. Add new filter type to `filterType` property
3. Add button to HTML template
4. Update `getFilteredTransactions()` method

### Change Spacing
1. Edit `src/styles/theme.scss`
2. Modify spacing variables (lg, md, sm, etc.)
3. All components automatically update

## Routing Quick Reference

```typescript
// Current routes
'' → /dashboard (redirect)
'/login' → LoginComponent
'/dashboard' → DashboardComponent
'**' → /dashboard (fallback)
```

### Add New Route
```typescript
// In app.routes.ts
{
  path: 'my-page',
  component: MyPageComponent,
}
```

### Navigate Programmatically
```typescript
constructor(private router: Router) {}

goToLogin() {
  this.router.navigate(['/login']);
}
```

## Form Validation Patterns

### Email Validation
```typescript
email: ['', [Validators.required, Validators.email]]
```

### Password Validation
```typescript
password: ['', [Validators.required, Validators.minLength(6)]]
```

### Check if Valid
```html
<button [disabled]="form.invalid">
```

### Show Error
```html
<span *ngIf="emailControl?.invalid && emailControl?.touched">
  Error message
</span>
```

## Debugging Tips

### Check Console
Press F12 in browser → Console tab

### View localStorage
```javascript
// In browser console
localStorage.getItem('authToken')
localStorage.getItem('currentUser')
localStorage.clear() // Clear all
```

### Check Component State
```typescript
// In component
console.log(this.dashboardData);
console.log(this.currentUser);
```

### Monitor Network Requests
F12 → Network tab → Refresh page

## Performance Tips

1. **Use trackBy in *ngFor**
   ```html
   <div *ngFor="let item of items; trackBy: trackByFn">
   ```

2. **Unsubscribe from Observables**
   ```typescript
   ngOnDestroy() {
     this.subscription.unsubscribe();
   }
   ```

3. **Use OnPush Change Detection**
   ```typescript
   @Component({
     changeDetection: ChangeDetectionStrategy.OnPush
   })
   ```

## Responsive Design Cheat Sheet

```scss
// Mobile (default)
.element {
  font-size: 14px;
}

// Tablet and up
@media (min-width: 768px) {
  .element {
    font-size: 16px;
  }
}

// Desktop
@media (min-width: 1024px) {
  .element {
    font-size: 18px;
  }
}
```

## Angular Syntax Quick Ref

```html
<!-- Property Binding -->
<div [property]="value"></div>

<!-- Event Binding -->
<button (click)="onClick()"></button>

<!-- Two-way Binding -->
<input [(ngModel)]="variable">

<!-- Conditional -->
<div *ngIf="condition">Content</div>

<!-- Loop -->
<div *ngFor="let item of items">{{ item }}</div>

<!-- Switch -->
<div [ngSwitch]="value">
  <div *ngSwitchCase="'a'">A</div>
  <div *ngSwitchDefault>Default</div>
</div>

<!-- Class Binding -->
<div [class.active]="isActive"></div>

<!-- Style Binding -->
<div [style.color]="myColor"></div>

<!-- Interpolation -->
<p>{{ variable }}</p>

<!-- Pipe -->
<p>{{ date | date: 'short' }}</p>
```

## SCSS Features Quick Ref

```scss
// Variables
$color-primary: #6C8BFF;

// Nesting
.parent {
  color: red;
  
  .child {
    color: blue;
  }
}

// Mixins
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.element {
  @include flex-center;
}

// Functions
.lighter-color {
  color: lighten($color-primary, 10%);
}

// Extend
.btn {
  padding: 10px;
}

.btn-primary {
  @extend .btn;
  background: blue;
}

// Import
@import 'variables.scss';
```

## Useful Browser Extensions

- **Angular DevTools**: Debug Angular apps
- **Redux DevTools**: State management debugging
- **Lighthouse**: Performance auditing
- **WAVE**: Accessibility checker

## File Quick Navigation (VS Code)

```
Ctrl+P        → Quick file open
Ctrl+Shift+P  → Command palette
Ctrl+H        → Find and replace
Ctrl+/        → Toggle comment
Alt+Up/Down   → Move line up/down
Ctrl+D        → Select next occurrence
```

## Testing Checklist

- [ ] Can login with any email
- [ ] Password validation works (< 6 chars shows error)
- [ ] Loading spinner appears during login
- [ ] Dashboard loads after login
- [ ] User avatar displays correctly
- [ ] Logout button works
- [ ] Overview tab shows all cards
- [ ] Transactions tab shows filtered list
- [ ] Sort and filter work
- [ ] Responsive on mobile (shrink window)
- [ ] No console errors
- [ ] All links work

## Common Error Messages

| Error | Solution |
|-------|----------|
| **Port 4200 in use** | `ng serve --port 4201` |
| **Module not found** | `npm install` |
| **SCSS compilation error** | Check SCSS syntax, reload |
| **Component not loading** | Check route in app.routes.ts |
| **Styles not applying** | Check @import statement |
| **Data not displaying** | Check browser console, service |

## Production Checklist

- [ ] npm run build succeeds
- [ ] No console warnings/errors
- [ ] Remove mock data or mark as mock
- [ ] Add proper error handling
- [ ] Test on production URL
- [ ] Check responsive design
- [ ] Enable GZIP compression
- [ ] Set up analytics
- [ ] Configure CORS if needed
- [ ] Test security

## Useful Resources

| Resource | Link |
|----------|------|
| **Angular Docs** | https://angular.io/docs |
| **TypeScript Handbook** | https://www.typescriptlang.org/docs/ |
| **SCSS Documentation** | https://sass-lang.com/documentation |
| **MDN Web Docs** | https://developer.mozilla.org/ |
| **Angular Material** | https://material.angular.io/ |

## Next Steps

1. **Add Backend**
   - Connect AuthService to real API
   - Update FinanceService for real data

2. **Add More Features**
   - Analytics/charts
   - Budget planning
   - Bill reminders
   - Investment tracking

3. **Improve Styling**
   - Add animations library (Framer Motion)
   - Add chart library (Chart.js, D3.js)
   - Custom icons library

4. **Deploy to Production**
   - Follow SETUP_DEPLOYMENT.md
   - Configure environment variables
   - Set up CI/CD pipeline

---

**Last Updated**: January 21, 2026
**Version**: 1.0.0
**Status**: Production Ready ✅
