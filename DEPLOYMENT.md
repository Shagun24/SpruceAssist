# Deployment Guide for BlockHub AI Code Fest

## Quick Reference

**Project**: FinanceHub ChatGPT App
**Submission Deadline**: Jan 23, 2026 @ 6 PM
**Primary Deliverable**: MCP Server + ChatGPT Apps SDK Integration

## Local Development (Immediate)

### Get Up and Running in 3 Steps

```bash
# 1. Install dependencies
cd mcp-server
npm install

# 2. Start the MCP server
npm run dev
# Server running at http://localhost:8000

# 3. Test with MCPJam (in another terminal)
npx -y @mcpjam/inspector@beta
# Inspector at http://localhost:3000
```

**That's it!** Your MCP server is ready for testing.

## For Demo Purposes

If you just need to show the app working locally (recommended for first demo):

### No Cloud Deployment Needed
- Run server locally: `npm run dev`
- Record demo video showing:
  - Terminal with running server
  - MCPJam Inspector connected
  - Tools being called
  - Dashboard widget rendering
- This is sufficient for BlockHub submission

## If You Want to Deploy to Cloud

Choose ONE option below based on your preference:

### Option 1: Vercel (Easiest) ⭐

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to mcp-server
cd mcp-server

# Deploy
vercel
```

**Pros**: 
- Automatic deployments from git
- Free tier covers your needs
- Can show live running server
- One command deployment

**Cons**: 
- Requires account setup

### Option 2: Railway (Very Simple)

1. Go to [railway.app](https://railway.app)
2. Connect GitHub repo
3. Railway auto-detects Node.js project
4. Click "Deploy"

**Pros**: 
- Automatic from git
- No config needed
- Environment variables built-in
- Free tier sufficient

### Option 3: Render (Free Tier)

1. Go to [render.com](https://render.com)
2. Create new "Web Service"
3. Connect GitHub
4. Build command: `npm install && npm run build`
5. Start command: `npm start`

**Pros**: 
- Good free tier
- Simple UI
- Auto-deploys on git push

### Option 4: Docker + Any Host

Create [mcp-server/Dockerfile](./mcp-server/Dockerfile):

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8000
CMD ["npm", "start"]
```

Then deploy to your preferred cloud host.

## Deployment Checklist

- [ ] Code pushed to repository ✅
- [ ] MCP server runs locally without errors
- [ ] All 4 tools callable and working
- [ ] Dashboard widget renders properly
- [ ] MCPJam Inspector successfully connects
- [ ] Demo video recorded (optional but recommended)
- [ ] README.md in mcp-server updated with your deployment URL

## Testing Your Deployment

After deploying, verify:

```bash
# Check if server is running
curl https://your-deployed-url/health

# Should return:
# {"status":"ok","service":"FinanceHub MCP Server"}

# View dashboard
# Open https://your-deployed-url/dashboard in browser
```

## Environment Variables for Deployment

Add to your cloud platform's environment config:

```
PORT=8000
NODE_ENV=production
```

## Important: Do NOT Deploy With

❌ Real financial data
❌ Production H&R Block credentials
❌ Personal information
❌ API keys or secrets

Use only mock data as included in the codebase.

## Troubleshooting Deployment

### Server doesn't start
- Check Node.js version (needs 18+)
- Verify `npm install` completes
- Check logs in cloud platform

### Port binding error
- Cloud platforms assign PORT automatically
- Code uses `process.env.PORT` - already configured ✅

### CORS issues
- CORS is enabled in server code ✅
- Should work fine with ChatGPT

### Not accessible from ChatGPT
- Verify HTTPS (required by OpenAI)
- Check domain/URL is correct
- Test endpoint manually with curl

## For BlockHub Submission

You need to provide:

1. **GitHub Repository Link** ✅ (already pushing code)
2. **Live Server URL** (optional)
   - Can be local: `http://localhost:8000`
   - Or deployed URL if available
3. **Setup Instructions** ✅ (in mcp-server/README.md)
4. **Demo Video** (recommended)
5. **Presentation** (slides showing the app)

## Timeline Recommendations

- **Now**: Get running locally ✅
- **Today**: Record demo video
- **Tomorrow**: Deploy to cloud (optional)
- **Jan 22**: Final testing & documentation
- **Jan 23 @ 6 PM**: Submit everything

## Key Resources

- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app/)
- [Render Docs](https://render.com/docs)
- [OpenAI Apps SDK](https://developers.openai.com/apps-sdk)

---

**Start with local testing.** That's the fastest path to a working demo. Deploy only if you want to show a live running server on the internet.

Good luck! 🚀
