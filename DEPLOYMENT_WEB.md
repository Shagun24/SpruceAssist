# FinanceHub MCP Server - Deployment Guide

## 🎯 Overview

This guide covers deploying your FinanceHub MCP server to various platforms and integrating with ChatGPT.

---

## 📦 What Was Added

### Deployment Files
- ✅ **Dockerfile** - Container deployment
- ✅ **Procfile** - Heroku deployment
- ✅ **.dockerignore** - Optimize Docker builds
- ✅ **.env.example** - Environment configuration template
- ✅ **openapi.yaml** - API specification for ChatGPT
- ✅ **azure-deploy.yml** - GitHub Actions for Azure

### Security Features
- ✅ **API Key Authentication** - Protect your endpoints
- ✅ **CORS Configuration** - Control access origins
- ✅ **Environment Variables** - Secure configuration

### New API Endpoints
- ✅ `/health` - Health check (no auth)
- ✅ `/api/financial-overview` - Get financial overview
- ✅ `/api/transactions` - Get transactions
- ✅ `/api/expense-analysis` - Get expense analysis
- ✅ `/api/budget-recommendations` - Get recommendations
- ✅ `/mcp/tools` - List available tools
- ✅ `/mcp/call` - Execute MCP tools

---

## 🔧 Setup Instructions

### 1. Environment Configuration

Create `.env` file in `mcp-server/` directory:

```bash
cd mcp-server
cp .env.example .env
```

Edit `.env` with your settings:
```env
PORT=8000
NODE_ENV=production
API_KEY=your-secure-api-key-here
ALLOWED_ORIGINS=https://your-frontend.com,https://chat.openai.com
```

### 2. Install Dependencies

```bash
cd mcp-server
npm install
```

### 3. Build the Project

```bash
npm run build
```

### 4. Test Locally

```bash
npm start
```

Test endpoints:
```bash
# Health check (no auth)
curl http://localhost:8000/health

# Financial overview (with API key)
curl -H "X-API-Key: your-api-key" http://localhost:8000/api/financial-overview
```

---

## 🚀 Deployment Options

## Option 1: Azure Web App (Recommended)

### Via Azure Portal

1. **Create Azure Web App**
   - Go to Azure Portal
   - Create new Web App
   - Select Node 18 LTS runtime

2. **Configure Environment Variables**
   - Go to Configuration → Application Settings
   - Add:
     - `API_KEY` = your-secure-key
     - `ALLOWED_ORIGINS` = your-domains
     - `NODE_ENV` = production

3. **Deploy**
   ```bash
   # Install Azure CLI
   az login
   
   # Build and deploy
   cd mcp-server
   npm run build
   az webapp up --name financehub-mcp --runtime "NODE:18-lts"
   ```

### Via GitHub Actions (Automated)

1. **Get Publish Profile**
   - In Azure Portal, go to your Web App
   - Download publish profile

2. **Add to GitHub Secrets**
   - Go to GitHub repo → Settings → Secrets
   - Add `AZURE_WEBAPP_PUBLISH_PROFILE`

3. **Push to Master**
   - GitHub Actions will auto-deploy on push
   - Check `.github/workflows/azure-deploy.yml`

---

## Option 2: Heroku

### Deploy to Heroku

```bash
cd mcp-server

# Login to Heroku
heroku login

# Create app
heroku create financehub-mcp

# Set environment variables
heroku config:set API_KEY=your-secure-api-key
heroku config:set ALLOWED_ORIGINS=https://your-frontend.com
heroku config:set NODE_ENV=production

# Deploy
git push heroku master

# Open app
heroku open
```

---

## Option 3: Docker Container

### Build Docker Image

```bash
cd mcp-server

# Build image
docker build -t financehub-mcp .

# Run locally
docker run -p 8000:8000 \
  -e API_KEY=your-api-key \
  -e ALLOWED_ORIGINS=http://localhost:4200 \
  financehub-mcp

# Test
curl http://localhost:8000/health
```

### Deploy to Azure Container Instances

```bash
# Login to Azure
az login

# Create resource group
az group create --name financehub-rg --location eastus

# Create container registry
az acr create --resource-group financehub-rg \
  --name financehubregistry --sku Basic

# Build and push image
az acr build --registry financehubregistry \
  --image financehub-mcp:v1 .

# Deploy container
az container create \
  --resource-group financehub-rg \
  --name financehub-mcp \
  --image financehubregistry.azurecr.io/financehub-mcp:v1 \
  --dns-name-label financehub-mcp \
  --ports 8000 \
  --environment-variables \
    API_KEY=your-api-key \
    NODE_ENV=production
```

---

## Option 4: Railway

1. **Go to** https://railway.app
2. **New Project** → Deploy from GitHub
3. **Connect Repository**
4. **Configure**:
   - Root Directory: `mcp-server`
   - Build Command: `npm install && npm run build`
   - Start Command: `node dist/index.js`
5. **Add Environment Variables**:
   - `API_KEY`
   - `ALLOWED_ORIGINS`
   - `NODE_ENV=production`

---

## Option 5: Render

1. **Go to** https://render.com
2. **New Web Service**
3. **Connect Repository**
4. **Configure**:
   - Root Directory: `mcp-server`
   - Build Command: `npm install && npm run build`
   - Start Command: `node dist/index.js`
5. **Environment Variables**:
   - Add `API_KEY`, `ALLOWED_ORIGINS`, `NODE_ENV`

---

## 🤖 ChatGPT Integration

### Method 1: Custom GPT with Actions

1. **Go to ChatGPT** → Create Custom GPT

2. **Configure Actions**:
   - Click "Create new action"
   - Upload `openapi.yaml` file
   - Or paste the OpenAPI spec

3. **Add Authentication**:
   - Type: API Key
   - Header Name: `X-API-Key`
   - API Key: Your actual API key

4. **Test Tools**:
   - "Get my financial overview"
   - "Show my recent transactions"
   - "Analyze my expenses"

### Method 2: OpenAI API with Function Calling

```javascript
const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    { role: "user", content: "What's my financial overview?" }
  ],
  functions: [
    {
      name: "get_financial_overview",
      description: "Get user's financial overview",
      parameters: { type: "object", properties: {} }
    }
  ]
});

// If function call is requested
if (response.choices[0].message.function_call) {
  // Call your deployed API
  const result = await fetch('https://your-app.azurewebsites.net/api/financial-overview', {
    headers: { 'X-API-Key': 'your-api-key' }
  });
}
```

---

## 🔐 Security Best Practices

### 1. API Key Management
```bash
# Generate strong API key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Store in environment variable, never in code
```

### 2. CORS Configuration
```typescript
// Restrict origins in production
ALLOWED_ORIGINS=https://your-frontend.com,https://chat.openai.com
```

### 3. Rate Limiting (Optional)
```bash
npm install express-rate-limit
```

Add to `src/index.ts`:
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 4. HTTPS Only
- Always use HTTPS in production
- Azure/Heroku provide this automatically
- For custom domains, use Let's Encrypt

---

## 🧪 Testing Your Deployment

### 1. Health Check
```bash
curl https://your-app.azurewebsites.net/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "FinanceHub MCP Server",
  "timestamp": "2026-01-23T...",
  "version": "1.0.0"
}
```

### 2. Test API Endpoints
```bash
# Financial overview
curl -H "X-API-Key: your-api-key" \
  https://your-app.azurewebsites.net/api/financial-overview

# Transactions
curl -H "X-API-Key: your-api-key" \
  https://your-app.azurewebsites.net/api/transactions?limit=5

# Expense analysis
curl -H "X-API-Key: your-api-key" \
  https://your-app.azurewebsites.net/api/expense-analysis

# Budget recommendations
curl -H "X-API-Key: your-api-key" \
  https://your-app.azurewebsites.net/api/budget-recommendations
```

### 3. Test MCP Endpoints
```bash
# List tools
curl -H "X-API-Key: your-api-key" \
  https://your-app.azurewebsites.net/mcp/tools

# Call tool
curl -X POST \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"name":"get_financial_overview","arguments":{}}' \
  https://your-app.azurewebsites.net/mcp/call
```

---

## 📊 Monitoring & Logs

### Azure
```bash
# Stream logs
az webapp log tail --name financehub-mcp --resource-group your-rg

# View logs in portal
# Go to your Web App → Monitoring → Log stream
```

### Heroku
```bash
heroku logs --tail --app financehub-mcp
```

### Docker
```bash
docker logs -f <container-id>
```

---

## 🔄 Updates & Maintenance

### Update Code
```bash
# Make changes
git add .
git commit -m "Update API endpoints"
git push origin master

# For Azure with GitHub Actions - auto-deploys
# For Heroku:
git push heroku master
```

### Update Environment Variables
```bash
# Azure
az webapp config appsettings set --name financehub-mcp \
  --settings API_KEY=new-key

# Heroku
heroku config:set API_KEY=new-key
```

---

## 🆘 Troubleshooting

### Server Won't Start
```bash
# Check logs
npm start 2>&1 | tee error.log

# Verify Node version
node --version  # Should be v18+

# Rebuild
npm install
npm run build
```

### 401 Unauthorized Errors
- Check API key in request headers
- Verify `.env` file has correct `API_KEY`
- Test with: `curl -H "X-API-Key: your-key" ...`

### CORS Errors
- Add your frontend domain to `ALLOWED_ORIGINS`
- Include protocol: `https://`, not just domain
- Restart server after changing environment variables

### ChatGPT Can't Connect
- Verify server is publicly accessible
- Check firewall/security groups allow inbound port 8000
- Test with curl from external machine
- Verify OpenAPI spec matches actual endpoints

---

## 📚 Additional Resources

- **OpenAPI Spec**: See `openapi.yaml` for full API documentation
- **MCP Documentation**: https://modelcontextprotocol.io
- **Azure Docs**: https://docs.microsoft.com/azure
- **Heroku Docs**: https://devcenter.heroku.com
- **Docker Docs**: https://docs.docker.com

---

## ✅ Deployment Checklist

- [ ] Create `.env` file with secure API key
- [ ] Build project: `npm run build`
- [ ] Test locally: `npm start`
- [ ] Choose deployment platform
- [ ] Set environment variables on platform
- [ ] Deploy code
- [ ] Test health endpoint
- [ ] Test API endpoints with authentication
- [ ] Upload `openapi.yaml` to ChatGPT
- [ ] Configure ChatGPT authentication
- [ ] Test ChatGPT integration
- [ ] Monitor logs
- [ ] Set up alerts (optional)

---

**Your MCP server is now ready for production deployment!** 🚀
