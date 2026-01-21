# FinanceHub - Modern Dark Theme Finance Dashboard

A premium, fintech-inspired Angular finance dashboard with a modern dark theme. Built with responsive design, smooth animations, and production-quality UI.

## Features

✨ **Dark Theme Design**
- Modern color palette with gradients
- Smooth shadows and transitions
- Responsive layout
- Accessibility-first approach

💰 **Dashboard Features**
- Total Balance Overview
- Monthly Income & Expense Tracking
- Expense Breakdown Visualization
- Recent Activity Feed
- Transaction Management

🔐 **Authentication**
- Login Page with Form Validation
- Session Management
- localStorage-based State Persistence
- User Avatar & Profile Menu

📊 **Data Visualization**
- Card-based Layout
- Status Pills & Indicators
- Color-coded Transactions (Income/Expense)
- Responsive Tables

## Project Structure

```
src/
├── app/
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── finance.service.ts
│   ├── pages/
│   │   ├── login/
│   │   │   ├── login.component.ts
│   │   │   ├── login.component.html
│   │   │   └── login.component.scss
│   │   └── dashboard/
│   │       ├── dashboard.component.ts
│   │       ├── dashboard.component.html
│   │       ├── dashboard.component.scss
│   │       └── components/
│   │           ├── header/
│   │           ├── overview-tab/
│   │           └── transactions-tab/
│   ├── app.component.ts
│   ├── app.routes.ts
│   └── app.config.ts
├── styles/
│   ├── theme.scss      (Color palette & typography)
│   └── globals.scss    (Global styles & CSS variables)
├── styles.scss         (Main styles entry point)
├── main.ts
└── index.html
```

## Theme Color Palette

| Element | Color | Hex |
|---------|-------|-----|
| App Background | Dark Navy | #0B0F1A |
| Surface | Elevated Navy | #131A2A |
| Elevated Cards | Deep Navy | #1B2338 |
| Primary Accent | Periwinkle | #6C8BFF |
| Secondary Accent | Turquoise | #2DD4BF |
| Text Primary | White | #FFFFFF |
| Text Secondary | Slate | #A1A8C3 |
| Success | Green | #22C55E |
| Danger | Red | #EF4444 |

## Styling Guidelines

### CSS Variables
All colors and values are defined as CSS variables in `globals.scss`:
- `--color-*` for colors
- `--spacing-*` for margins/padding
- `--border-radius-*` for border radii
- `--shadow-*` for shadows
- `--transition-*` for animations

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Typography
- Font Family: System UI (Inter-like)
- Font Weights: 400 (regular), 500 (medium), 600 (semi-bold), 700 (bold)
- Base Font Size: 14px

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

Development server runs at `http://localhost:4200`

### Login Credentials (Demo)
- Email: any valid email
- Password: at least 6 characters

## Key Components

### Login Page
- Centered dark card design
- Email and password validation
- Loading state with spinner
- Error handling
- Responsive mobile layout

### Dashboard
- Header with logo and user profile menu
- Tab navigation (Overview & Transactions)
- Smooth tab transitions
- Responsive sidebar-free layout

### Overview Tab
- Total Balance card with gradient
- Income/Expense indicator cards
- Expense breakdown with pie chart
- Recent activity feed with status pills

### Transactions Tab
- Filterable transaction list
- Sort by date or amount
- Color-coded amounts
- Status badges
- Responsive table layout

## Customization

### Changing Colors
Edit `src/styles/theme.scss` to modify the color palette:

```scss
$color-primary-accent: #6C8BFF;  // Change primary blue
$color-danger: #EF4444;          // Change red
```

### Adjusting Spacing
Modify spacing variables in `src/styles/theme.scss`:

```scss
$spacing-lg: 24px;     // Change large spacing
$spacing-md: 16px;     // Change medium spacing
```

### Adding New Components
New components automatically use SCSS styling:

```bash
ng generate component pages/new-page --style=scss
```

## Browser Support
- Chrome/Edge: Latest
- Firefox: Latest
- Safari: Latest
- Mobile browsers: iOS Safari, Chrome Mobile

## Performance Optimizations
- Standalone Components (no module bundle overhead)
- Lazy loading ready
- Optimized animations (GPU acceleration)
- Efficient CSS selectors
- Minimal reflows/repaints

## Accessibility
- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance
- Focus indicators on interactive elements

## License

MIT License - Feel free to use for personal and commercial projects.

---

Built with ❤️ using Angular 18 and SCSS

# Build and Test
TODO: Describe and show how to build your code and run the tests. 

# Contribute
TODO: Explain how other users and developers can contribute to make your code better. 

If you want to learn more about creating good readme files then refer the following [guidelines](https://docs.microsoft.com/en-us/azure/devops/repos/git/create-a-readme?view=azure-devops). You can also seek inspiration from the below readme files:
- [ASP.NET Core](https://github.com/aspnet/Home)
- [Visual Studio Code](https://github.com/Microsoft/vscode)
- [Chakra Core](https://github.com/Microsoft/ChakraCore)