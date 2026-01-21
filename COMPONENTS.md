# Component Guide - FinanceHub Dashboard

## Overview

This document provides detailed information about each component in the FinanceHub application.

## Login Component

**File**: `src/app/pages/login/login.component.ts`

### Purpose
Handles user authentication with email/password validation and localStorage persistence.

### Features
- Email format validation
- Password length validation (min 6 chars)
- Loading state management
- Error display
- Responsive design with dark theme

### Inputs
None (standalone component)

### Outputs
None (uses Router to navigate on success)

### Key Methods
- `initializeForm()`: Creates FormGroup with validations
- `onSubmit()`: Validates and submits login request
- `getters`: emailControl, passwordControl for template access

### Usage
```typescript
// Automatically routed from app.routes.ts
// Access via: localhost:4200/login
```

### Styling Notes
- Uses dark theme variables from `globals.scss`
- Backdrop blur effect on background
- Animated card entry (slideUp)
- Gradient text for branding

---

## Dashboard Component

**File**: `src/app/pages/dashboard/dashboard.component.ts`

### Purpose
Main layout component that displays header and tab-switchable content (Overview/Transactions).

### Features
- User authentication check
- Tab navigation
- Logout functionality
- Responsive header

### Inputs
None (standalone)

### Outputs
None

### Child Components
- `HeaderComponent`
- `OverviewTabComponent`
- `TransactionsTabComponent`

### Key Methods
- `setActiveTab()`: Switches between Overview and Transactions
- `logout()`: Clears auth and redirects to login

### Template Structure
```html
<app-header></app-header>
<dashboard-content>
  <tab-controls></tab-controls>
  <tab-content></tab-content>
</dashboard-content>
```

### Styling Notes
- Uses flexible layout (no fixed sidebar)
- Padding for generous spacing
- Responsive dashboard-content adjusts on mobile

---

## Header Component

**File**: `src/app/pages/dashboard/components/header/header.component.ts`

### Purpose
Displays app logo, branding, and user profile menu.

### Features
- Logo with gradient text
- User avatar display
- Dropdown menu
- Logout button
- Responsive design

### Inputs
```typescript
@Input() currentUser: User | null = null;
```

### Outputs
```typescript
@Output() logout = new EventEmitter<void>();
```

### Key Methods
- `toggleUserMenu()`: Shows/hides user menu
- `onLogout()`: Emits logout event

### Menu Items
- Profile Settings
- Security
- Preferences
- (divider)
- Logout

### Styling Notes
- Sticky positioning
- Backdrop blur effect
- Smooth animations for menu
- Avatar border with accent color

---

## Overview Tab Component

**File**: `src/app/pages/dashboard/components/overview-tab/overview-tab.component.ts`

### Purpose
Displays financial overview with balance, income/expense, and recent activity.

### Features
- Total balance card with gradient
- Income/Expense indicator cards
- Expense breakdown visualization
- Recent activity feed
- Loading skeleton states

### Inputs
None

### Outputs
None

### Data Loaded From
`FinanceService.getDashboardData()`

### Key Methods
- `formatCurrency()`: Formats numbers as USD
- `formatDate()`: Formats dates

### Card Types

**Balance Card**
- Large centered amount
- Gradient background
- Trend indicator

**Income/Expense Cards**
- Icon and value display
- Color-coded (green/red)
- Hover elevation

**Savings Card**
- Calculated from income - expense
- Secondary accent color

**Activity List**
- 5 most recent transactions
- Icon indicators
- Status badges

### Styling Notes
- Animated fade-in on load
- Loading shimmer effect
- Gradient accents
- Hover elevation effects
- Color-coded amounts

### Responsive Behavior
- Grid layout adapts to screen size
- Mobile: Single column
- Tablet: 2-3 columns
- Desktop: Full layout

---

## Transactions Tab Component

**File**: `src/app/pages/dashboard/components/transactions-tab/transactions-tab.component.ts`

### Purpose
Displays filterable and sortable transaction list.

### Features
- Filter by type (All/Income/Expense)
- Sort by date or amount
- Status indicators
- Color-coded amounts
- Responsive table layout

### Inputs
None

### Outputs
None

### Data Loaded From
`FinanceService.getTransactions()`

### Key Methods
- `getFilteredTransactions()`: Returns filtered and sorted list
- `formatCurrency()`: Formats amounts
- `formatDate()`: Formats dates
- `setFilter()`: Updates filter selection
- `setSortBy()`: Updates sort selection

### Filter Buttons
- All: Shows all transactions
- Income: Shows only income
- Expense: Shows only expenses

### Sort Options
- By Date: Most recent first
- By Amount: Largest first

### Transaction Row Displays
```
[Icon] [Description + Category] [Date] [Amount] [Status]
```

### Status Badges
- Success (green): Completed
- Pending (amber): In progress
- Failed (red): Error

### Styling Notes
- Grid layout that adapts to screen size
- Hover effects with color change
- Loading skeleton animations
- Empty state with icon
- Responsive breakpoints for mobile

### Responsive Behavior
- Desktop: Full row layout
- Tablet: Adjusted columns
- Mobile: Stacked layout

---

## Authentication Service

**File**: `src/app/services/auth.service.ts`

### Purpose
Manages user authentication state and localStorage persistence.

### Observables
```typescript
isLoggedIn$: Observable<boolean>
currentUser$: Observable<User | null>
```

### Methods
```typescript
login(credentials: LoginCredentials): Observable<User>
logout(): void
```

### User Interface
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}
```

### Storage
- **authToken**: Generated token on successful login
- **currentUser**: User object (JSON stringified)

### Features
- Simulates 1 second login delay
- Auto-generates user avatar from email
- Persists session across page reloads
- Validates login status on service init

---

## Finance Service

**File**: `src/app/services/finance.service.ts`

### Purpose
Provides mock financial data for dashboard.

### Methods
```typescript
getDashboardData(): Observable<DashboardData>
getTransactions(): Observable<Transaction[]>
addTransaction(transaction): Observable<Transaction>
```

### Data Interfaces
```typescript
interface Transaction {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  date: Date;
  status: 'success' | 'pending' | 'failed';
  category: string;
}

interface DashboardData {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  transactions: Transaction[];
  expenseSplit: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
}
```

### Mock Data
- Total Balance: $24,580.50
- Monthly Income: $8,500
- Monthly Expense: $3,200
- 8 sample transactions
- 5 expense categories

### Network Simulation
- 500ms delay for dashboard data
- 400ms delay for transactions
- 500ms delay for adding transactions

---

## Routing

**File**: `src/app/app.routes.ts`

### Route Configuration
```
/ → /dashboard (redirect)
/login → LoginComponent
/dashboard → DashboardComponent
/** → /dashboard (fallback)
```

### Navigation Flow
1. App starts
2. If not logged in → redirect to /login
3. After login → navigate to /dashboard
4. Logout → navigate to /login

---

## Theme & Styling

**Files**: 
- `src/styles/theme.scss`: Variable definitions
- `src/styles/globals.scss`: Global styles and CSS variables
- `src/styles.scss`: Main entry point

### Color Palette
- **Primary**: #6C8BFF (Periwinkle)
- **Secondary**: #2DD4BF (Teal)
- **Success**: #22C55E (Green)
- **Danger**: #EF4444 (Red)
- **Backgrounds**: Varying dark navy shades

### Spacing Scale
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- xxl: 48px

### Border Radius
- sm: 8px
- md: 12px
- lg: 16px
- xl: 20px

### Shadows
- sm, md, lg, xl levels
- Based on depth and elevation

### Transitions
- fast: 0.15s
- base: 0.2s (default)
- slow: 0.3s

---

## Component Styling Patterns

### Dark Theme Cards
```scss
.card {
  background-color: $color-bg-surface;
  border: 1px solid rgba($color-text-primary, 0.08);
  border-radius: $border-radius-lg;
  box-shadow: $shadow-md;
  transition: $transition-base;

  &:hover {
    border-color: rgba($color-primary-accent, 0.2);
    transform: translateY(-4px);
    box-shadow: $shadow-lg;
  }
}
```

### Form Inputs
```scss
input {
  background-color: rgba($color-bg-surface, 0.7);
  border: 1px solid rgba($color-text-primary, 0.1);
  color: $color-text-primary;
  transition: $transition-base;

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
  box-shadow: $shadow-md;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: $shadow-lg;
  }
}
```

---

## Extending Components

### Adding a New Card
```typescript
// In component.ts
cardData: MyData;

// In component.html
<div class="card">
  <h3>{{ cardData.title }}</h3>
  <p class="card-value">{{ cardData.value }}</p>
</div>

// In component.scss
.card {
  @extend %card-base; // Reuse card styles
  // Add custom styles
}
```

### Creating a New Service
```typescript
@Injectable({
  providedIn: 'root',
})
export class MyService {
  constructor() {}

  getData(): Observable<MyData> {
    return of(mockData).pipe(delay(500));
  }
}
```

### Styling Best Practices
1. Always import theme at top of component SCSS
2. Use variables instead of hardcoded values
3. Use CSS variables in templates
4. Keep component styles isolated
5. Use utility classes for common patterns

---

## Testing Components

### Component Structure
```typescript
@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule, ...],
  templateUrl: './my-component.html',
  styleUrls: ['./my-component.scss'],
})
export class MyComponent {
  // Component logic
}
```

### Injectable Services
All services use `providedIn: 'root'` for singleton pattern.

### Template Syntax
- `*ngIf` for conditional rendering
- `*ngFor` for loops
- Event binding with `(event)="method()"`
- Property binding with `[property]="value"`
- Two-way binding with `[(ngModel)]="value"` (when using FormsModule)

---

## Performance Considerations

1. **OnPush Strategy**: Can be added for optimization
2. **Async Pipe**: Use in templates for automatic unsubscribe
3. **TrackBy**: Use in *ngFor loops with large lists
4. **Lazy Loading**: Routes support lazy loading
5. **CSS Containment**: Add to heavy-styled components

---

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast compliance (WCAG AA)
- Focus indicators on buttons and inputs

---

## Browser Support

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

Requires modern browser features:
- CSS custom properties
- ES2020+ JavaScript
- Flexbox/Grid layout

---

This guide provides a comprehensive overview of all components in the FinanceHub dashboard. For specific implementation details, refer to the component files and their inline documentation.
