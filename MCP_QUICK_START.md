# MCP Server - Quick Setup for Claude Desktop

## ✅ What's Ready

Your MCP server is now built and ready to integrate with:
- **Claude Desktop** (for MCPJam evaluation)
- **MCPJam Inspector** (for testing)
- **Smithery.ai** (for publishing)

## 🚀 Quick Start: Claude Desktop Integration

### Step 1: Find Your Claude Config

**Windows (Your OS):**
```
%APPDATA%\Claude\claude_desktop_config.json
```

Open this file in a text editor (create it if it doesn't exist).

### Step 2: Add This Configuration

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

⚠️ **Important:** If you have other MCP servers, keep them and just add the `financehub` entry.

### Step 3: Restart Claude Desktop

- Close Claude completely (Right-click → Quit)
- Reopen Claude Desktop

### Step 4: Test It!

Try these prompts in Claude:

```
"Show me my financial overview"
"What are my recent transactions?"
"Analyze my expenses and give recommendations"
"Show me budget recommendations"
```

Claude will use your MCP server tools automatically! 🎉

---

## 🧪 Alternative: Test with MCPJam Inspector

### Option 1: HTTP Mode (Easy Testing)

```bash
# Terminal 1: Start HTTP server
npm run dev

# Terminal 2: Start MCPJam
npx @mcpjam/inspector@beta
```

Navigate to http://localhost:3000 and connect to http://localhost:8000

### Option 2: stdio Mode (Production Testing)

```bash
npx @mcpjam/inspector@beta --server "node dist/stdio.js"
```

---

## 📦 Your Server Provides

### 4 Tools:
1. **get_financial_overview** - Balance, income, expenses, savings rate
2. **get_recent_transactions** - Last 4 transactions with details  
3. **get_expense_analysis** - Spending breakdown by category
4. **get_budget_recommendations** - AI-powered budget advice

### 1 Resource:
- **finance://dashboard** - Interactive HTML dashboard

---

## 📊 For MCPJam Submission

### What to Demo:

1. ✅ Server running with Claude Desktop
2. ✅ All 4 tools working via natural language
3. ✅ Dashboard resource accessible
4. ✅ AI providing meaningful financial insights

### Recording Your Demo:

```
1. Show Claude Desktop with your server configured
2. Type: "Show me my complete financial status"
3. Show Claude calling get_financial_overview tool
4. Type: "What should I do to improve my finances?"
5. Show Claude using multiple tools to provide comprehensive advice
6. Show the dashboard resource rendering
```

Keep it under 5 minutes for best impact!

---

## 🎯 Full Path Reference

Your built server is located at:
```
C:\Users\A2745203\gpt-genesis\GPT Genesis\mcp-server\dist\stdio.js
```

If the path has issues, try:
```json
"args": ["C:/Users/A2745203/gpt-genesis/GPT Genesis/mcp-server/dist/stdio.js"]
```

---

## ❓ Troubleshooting

**Server not showing in Claude?**
- Verify the path exists: `dir "C:\Users\A2745203\gpt-genesis\GPT Genesis\mcp-server\dist\stdio.js"`
- Check for typos in claude_desktop_config.json
- Restart Claude completely (Quit, not just close window)

**Tools not working?**
- Check Claude's developer console for errors
- Verify the build succeeded: `npm run build`
- Try the HTTP mode first to verify functionality

**Need help?**
- See [MCP_INTEGRATION_GUIDE.md](MCP_INTEGRATION_GUIDE.md) for detailed docs
- Check MCP documentation: https://modelcontextprotocol.io

---

## 🏆 Next Steps

1. Configure Claude Desktop (Steps above)
2. Test all 4 tools
3. Record demo video
4. Submit to MCPJam
5. (Optional) Publish to Smithery.ai

**You're ready for MCPJam! Good luck! 🚀**
