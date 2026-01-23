# MCP Server Integration Guide

## Overview

Your FinanceHub MCP server can be integrated in **three ways**:

1. **Claude Desktop** (stdio) - For local AI assistant integration
2. **MCPJam Inspector** (HTTP) - For testing and debugging
3. **Production Deployment** - For live applications

---

## Method 1: Claude Desktop Integration (Recommended for MCPJam)

### Step 1: Build the Server

```bash
cd mcp-server
npm install
npm run build
```

### Step 2: Configure Claude Desktop

1. **Locate your Claude config file:**
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Linux: `~/.config/Claude/claude_desktop_config.json`

2. **Edit the config file** and add your MCP server:

```json
{
  "mcpServers": {
    "financehub": {
      "command": "node",
      "args": [
        "C:\\Users\\A2745203\\gpt-genesis\\GPT Genesis\\mcp-server\\dist\\stdio.js"
      ]
    }
  }
}
```

**Important:** Use the full absolute path to your `dist/stdio.js` file!

3. **Restart Claude Desktop completely** (quit and reopen)

### Step 3: Test in Claude

Open Claude Desktop and try these prompts:

```
"Show me my financial overview"
"What are my recent transactions?"
"Analyze my spending patterns"
"Give me budget recommendations"
```

Claude will automatically use your MCP server tools! 🎉

---

## Method 2: MCPJam Inspector Testing

### Option A: Using the HTTP Server (Current Setup)

```bash
# Terminal 1: Start your HTTP server
cd mcp-server
npm run dev
```

Server runs on: `http://localhost:8000`

```bash
# Terminal 2: Start MCPJam Inspector
npx @mcpjam/inspector@beta
```

Navigate to `http://localhost:3000` and connect to your server.

### Option B: Using stdio with MCPJam

MCPJam Inspector can also test stdio-based servers:

```bash
# Build first
npm run build

# Run MCPJam with stdio
npx @mcpjam/inspector@beta --server "node dist/stdio.js"
```

---

## Method 3: Smithery.ai Integration (For MCPJam Submission)

Smithery.ai is the official MCP server registry. To publish your server:

### Step 1: Create a smithery.yaml

Create `smithery.yaml` in your mcp-server directory:

```yaml
name: financehub-mcp-server
version: 1.0.0
description: Personal finance management MCP server with AI-powered insights
author: Your Name
homepage: https://github.com/yourusername/financehub
license: MIT

mcp:
  command: node
  args:
    - dist/stdio.js
  env: {}

capabilities:
  tools:
    - get_financial_overview
    - get_recent_transactions
    - get_expense_analysis
    - get_budget_recommendations
  resources:
    - finance://dashboard
```

### Step 2: Publish to Smithery

```bash
# Install Smithery CLI
npm install -g @smithery/cli

# Login to Smithery
smithery login

# Publish your server
smithery publish
```

### Step 3: Share Your Server URL

Your server will be available at:
```
smithery://financehub-mcp-server
```

Users can install it in Claude Desktop with:
```json
{
  "mcpServers": {
    "financehub": {
      "command": "npx",
      "args": ["-y", "@smithery/server", "smithery://financehub-mcp-server"]
    }
  }
}
```

---

## Testing Your Integration

### Test Checklist

- [ ] **Build succeeds**: `npm run build` completes without errors
- [ ] **Server starts**: `npm run dev:stdio` or `npm run dev` runs without errors
- [ ] **Tools work**: All 4 tools return valid JSON responses
- [ ] **Resources work**: Dashboard HTML loads correctly
- [ ] **Claude Desktop**: Server appears in Claude and responds to prompts
- [ ] **MCPJam**: Server connects and tools can be tested

### Test Each Tool

#### 1. get_financial_overview
**Expected Output:**
```json
{
  "totalBalance": 125450.5,
  "monthlyIncome": 8500,
  "monthlyExpense": 3200,
  "savingsRate": "62.35%"
}
```

#### 2. get_recent_transactions
**Expected Output:**
```json
[
  {
    "id": "1",
    "description": "Salary Deposit",
    "amount": 8500,
    "type": "income",
    "date": "2025-01-20"
  },
  ...
]
```

#### 3. get_expense_analysis
**Expected Output:**
```json
{
  "expenseBreakdown": {
    "Food & Dining": 450,
    "Transportation": 300,
    ...
  },
  "totalExpenses": "1550.00",
  "recommendations": [...]
}
```

#### 4. get_budget_recommendations
**Expected Output:**
```json
{
  "recommendations": [...],
  "summary": "You're doing great! Focus on starting investments."
}
```

---

## Troubleshooting

### "Server not found" in Claude Desktop

**Solution 1:** Verify the path in config
```bash
# Check your built file exists
ls "C:\Users\A2745203\gpt-genesis\GPT Genesis\mcp-server\dist\stdio.js"
```

**Solution 2:** Use forward slashes or escaped backslashes
```json
{
  "mcpServers": {
    "financehub": {
      "command": "node",
      "args": ["C:/Users/A2745203/gpt-genesis/GPT Genesis/mcp-server/dist/stdio.js"]
    }
  }
}
```

**Solution 3:** Restart Claude completely
- Windows: Right-click taskbar icon → Quit
- macOS: Cmd+Q
- Then reopen Claude Desktop

### "Cannot find module" error

```bash
# Rebuild the project
cd mcp-server
rm -rf dist node_modules
npm install
npm run build
```

### Port 8000 already in use (HTTP mode)

```bash
# Use a different port
PORT=8001 npm run dev
```

### MCPJam Inspector won't connect

1. Ensure server is running: `npm run dev`
2. Check the URL: `http://localhost:8000`
3. Try visiting: `http://localhost:8000/health`
4. Check firewall settings

---

## Next Steps for MCPJam

### 1. Record Demo Video

Show:
1. Server starting (`npm run dev:stdio`)
2. Claude Desktop recognizing the server
3. Testing each tool with natural language
4. Dashboard rendering
5. AI providing financial insights

### 2. Prepare Submission

Include:
- [ ] GitHub repository URL
- [ ] Demo video (YouTube/Loom)
- [ ] README with setup instructions
- [ ] Screenshots of working integration
- [ ] Smithery.ai link (optional but recommended)

### 3. Submit to MCPJam

Visit: **https://mcpjam.com** (or the official submission portal)

Required info:
- Project name: FinanceHub MCP Server
- Description: AI-powered personal finance management
- Category: Finance & Productivity
- Tech stack: TypeScript, MCP SDK, Claude Desktop
- Features: 4 tools, interactive dashboard, budget recommendations

---

## Advanced: Adding More Features

### Add a New Tool

1. Add to `tools` array in [stdio.ts](mcp-server/src/stdio.ts#L255)
2. Add case in `CallToolRequestSchema` handler
3. Rebuild: `npm run build`
4. Restart Claude Desktop

### Add Real Data Integration

Replace mock data with:
- Plaid API for bank connections
- CSV file imports
- Database integration (PostgreSQL/MongoDB)

### Deploy to Production

See [DEPLOYMENT.md](../DEPLOYMENT.md) for cloud deployment instructions.

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run dev` | Start HTTP server (port 8000) |
| `npm run dev:stdio` | Start stdio server (for testing) |
| `npm run start:stdio` | Run built stdio server |
| `npx @mcpjam/inspector@beta` | Launch MCPJam Inspector |

| File | Purpose |
|------|---------|
| `src/stdio.ts` | Stdio server (for Claude Desktop) |
| `src/index.ts` | HTTP server (for testing) |
| `dist/stdio.js` | Built stdio server (production) |
| `dist/index.js` | Built HTTP server (production) |

---

## Support

- **MCP Documentation:** https://modelcontextprotocol.io
- **Claude Desktop:** https://claude.ai/desktop
- **MCPJam:** https://mcpjam.com
- **Smithery:** https://smithery.ai

Good luck with MCPJam! 🚀
