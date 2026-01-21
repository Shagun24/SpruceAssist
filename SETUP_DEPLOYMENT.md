# Setup & Deployment Guide - FinanceHub

## System Requirements

### Minimum Requirements
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **OS**: Windows, macOS, or Linux
- **Browser**: Chrome, Firefox, Safari, or Edge (latest versions)

### Recommended Setup
- **Node.js**: 20.x LTS
- **npm**: 10.x
- **Visual Studio Code**: Latest version
- **Extensions**: Angular Language Service

## Initial Setup

### 1. Install Node.js and npm

**Windows:**
```bash
# Download from https://nodejs.org/
# Run installer and follow prompts
# Verify installation
node --version
npm --version
```

**macOS (using Homebrew):**
```bash
brew install node
node --version
npm --version
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install nodejs npm
node --version
npm --version
```

### 2. Clone or Extract Project

```bash
# Navigate to your workspace
cd "c:\Users\A2745203\gpt-genesis\GPT Genesis"

# Verify directory contains src/, package.json, etc.
ls -la
```

### 3. Install Dependencies

```bash
# Install all npm packages
npm install

# This may take 2-5 minutes
# You should see: added XXXX packages
```

### 4. Verify Installation

```bash
# Check Angular CLI version
ng version

# Check key dependencies
npm list @angular/core
npm list typescript
```

## Development Workflow

### Starting Development Server

```bash
# Start the application
npm start

# Server will start on http://localhost:4200
# Watches for file changes and auto-reloads
```

### File Structure for Development

```
GPT Genesis/
├── src/
│   ├── app/                  # Angular components and services
│   ├── styles/              # SCSS theme files
│   ├── main.ts              # Application entry point
│   ├── index.html           # HTML template
│   └── styles.scss          # Main styles file
├── angular.json             # Angular CLI config
├── tsconfig.json            # TypeScript config
├── package.json             # Dependencies
├── README.md                # Project overview
├── DEVELOPMENT.md           # Development guide
├── STYLING.md               # Styling documentation
├── COMPONENTS.md            # Component documentation
└── DESIGN_SYSTEM.md         # Design tokens reference
```

### Development Best Practices

1. **Keep Terminal Open**
   - Development server must run continuously
   - Press Ctrl+C to stop

2. **Use VS Code**
   - Install Angular Language Service extension
   - Enables TypeScript intellisense

3. **Test Changes Locally**
   - Modify files and save
   - Browser auto-refreshes
   - Check console for errors

4. **Follow Naming Conventions**
   - Components: `feature.component.ts`
   - Services: `feature.service.ts`
   - Styles: `feature.component.scss`

## Building for Production

### Create Production Build

```bash
# Build with optimization
npm run build

# Output directory: dist/finance-dashboard/
# Ready for deployment
```

### Build Options

```bash
# Development build (faster, larger)
npm run build -- --configuration development

# Production build (slower, optimized)
npm run build -- --configuration production

# Watch mode (rebuilds on changes)
npm run watch
```

### Build Output

```
dist/finance-dashboard/
├── index.html              # Main HTML file
├── favicon.ico             # App icon
├── assets/                 # Static assets
├── main.HASH.js           # Main application bundle
├── polyfills.HASH.js      # Browser polyfills
├── runtime.HASH.js        # Angular runtime
├── scripts.HASH.js        # Third-party scripts
└── styles.HASH.css        # Global styles
```

## Local Testing of Production Build

### Test Production Build Locally

```bash
# Install http-server globally (one time)
npm install -g http-server

# Navigate to project root
cd "c:\Users\A2745203\gpt-genesis\GPT Genesis"

# Serve the production build
npx http-server dist/finance-dashboard/ -p 8080

# Open browser to http://localhost:8080
```

### Testing Checklist
- [ ] App loads without errors
- [ ] Login page displays correctly
- [ ] Can log in with any valid email
- [ ] Dashboard displays all tabs
- [ ] All interactive elements work
- [ ] Responsive design works on mobile
- [ ] Console shows no errors

## Deployment Options

### Option 1: Netlify (Easiest)

1. **Build locally first**
   ```bash
   npm run build
   ```

2. **Connect to Netlify**
   - Go to https://netlify.com
   - Sign up or log in
   - Click "Add new site" → "Deploy manually"
   - Drag and drop `dist/finance-dashboard/` folder

3. **Auto-deploy from Git (Optional)**
   - Connect GitHub repository
   - Select branch to deploy
   - Builds automatically on push

### Option 2: Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Follow interactive prompts**

### Option 3: GitHub Pages

1. **Update angular.json**
   ```json
   "baseHref": "/gpt-genesis/"
   ```

2. **Build**
   ```bash
   npm run build
   ```

3. **Deploy**
   ```bash
   # Install gh-pages
   npm install --save-dev gh-pages
   
   # Add to package.json scripts
   "deploy": "ng build --base-href='/gpt-genesis/' && gh-pages -d dist/finance-dashboard"
   
   # Run deploy
   npm run deploy
   ```

### Option 4: Traditional Web Server

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Upload dist/finance-dashboard/ contents to**
   - FTP server
   - Cloud storage (AWS S3, Azure Blob)
   - Web hosting provider

3. **Configure server**
   - Set `index.html` as default document
   - Enable gzip compression
   - Configure CORS if needed

## Environment Configuration

### Development Environment

```typescript
// No .env file needed for development
// Mock data is used automatically
```

### Production Environment

```typescript
// Add environment files if connecting to backend:
// src/environments/environment.ts
// src/environments/environment.prod.ts

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
};
```

## Troubleshooting

### Issue: npm install fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Port 4200 already in use

**Solution:**
```bash
# Use different port
ng serve --port 4201

# Or kill process using port 4200
# Windows:
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:4200 | xargs kill -9
```

### Issue: Changes not reflecting in browser

**Solution:**
1. Check terminal for compilation errors
2. Hard refresh browser (Ctrl+Shift+R)
3. Clear browser cache
4. Restart development server

### Issue: TypeScript compilation errors

**Solution:**
```bash
# Verify TypeScript version
npm list typescript

# Rebuild everything
rm -rf dist node_modules/.cache
npm run build
```

### Issue: Styles not loading

**Solution:**
```bash
# Ensure SCSS is being compiled
# Check angular.json has "styles": ["src/styles.scss"]

# Restart dev server
# Ctrl+C and npm start again
```

## Performance Optimization

### Build Size Analysis

```bash
# Check bundle size
npm run build -- --stats-json

# Analyze with webpack-bundle-analyzer
npm install -g webpack-bundle-analyzer
webpack-bundle-analyzer dist/finance-dashboard/stats.json
```

### Optimization Tips

1. **Enable gzip compression on server**
   ```
   Before: ~500KB
   After: ~150KB
   ```

2. **Use CDN for static assets**
   - Reduces server load
   - Faster delivery globally

3. **Enable production mode**
   - Minification
   - Tree shaking
   - Dead code elimination

4. **Lazy load routes**
   ```typescript
   {
     path: 'dashboard',
     loadComponent: () => import('./pages/dashboard').then(m => m.DashboardComponent)
   }
   ```

## Continuous Integration (CI/CD)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist/finance-dashboard
```

## Security Considerations

### Before Deploying to Production

1. **Remove mock authentication**
   - Connect to real backend API
   - Implement secure JWT tokens
   - Use HTTPS only

2. **Add CSP headers**
   ```
   Content-Security-Policy: default-src 'self'
   ```

3. **Enable CORS properly**
   - Only allow trusted origins
   - Validate credentials

4. **Sanitize inputs**
   - Angular has built-in XSS protection
   - Never use `bypassSecurityTrustHtml`

5. **Secure localStorage**
   - Don't store sensitive data
   - Use HttpOnly cookies for tokens

6. **Environment variables**
   ```bash
   # Use environment files
   export API_URL=https://api.example.com
   ```

## Monitoring & Analytics

### Suggested Tools

1. **Error Tracking**: Sentry, LogRocket
2. **Analytics**: Google Analytics, Mixpanel
3. **Performance**: Lighthouse, Web Vitals
4. **Uptime**: UptimeRobot, StatusPage

### Add Google Analytics

```html
<!-- In src/index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

## Maintenance

### Regular Tasks

**Weekly:**
- Test authentication
- Check for console errors
- Verify responsive design

**Monthly:**
- Update dependencies: `npm update`
- Run security audit: `npm audit`
- Check performance

**Quarterly:**
- Major dependency updates
- Review and refactor code
- Update documentation

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update safely
npm update

# For major versions (breaking changes)
npm install @angular/core@latest
```

## Support & Resources

### Angular Documentation
- https://angular.io/docs
- https://angular.io/guide/typescript-configuration

### TypeScript Documentation
- https://www.typescriptlang.org/docs/

### SCSS Documentation
- https://sass-lang.com/documentation

### Node.js & npm
- https://nodejs.org/docs/
- https://docs.npmjs.com/

## Getting Help

1. **Check the documentation files**
   - README.md
   - DEVELOPMENT.md
   - COMPONENTS.md
   - STYLING.md

2. **Check browser console**
   - Press F12
   - Look for error messages

3. **Check Angular CLI errors**
   - Look at terminal output
   - Common issues listed in troubleshooting

4. **Online communities**
   - Stack Overflow (tag: angular)
   - Angular Discord
   - Reddit: r/Angular

---

Congratulations! You now have a complete, production-ready Angular finance dashboard with modern dark theme styling. Happy coding! 🎉
