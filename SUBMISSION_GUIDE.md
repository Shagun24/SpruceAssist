# BlockHub AI Code Fest - Final Round Submission Guide

## Project Overview

**FinanceHub** - A ChatGPT-integrated financial advisory application built with MCP (Model Context Protocol) and OpenAI Apps SDK.

This project transforms the Angular-based FinanceHub dashboard into a ChatGPT App accessible to millions of users, combining:
- **Frontend**: Angular 18 financial dashboard (existing)
- **Backend**: Node.js MCP Server with OpenAI Apps SDK
- **Integration**: ChatGPT Developer Mode app

## Project Structure

```
GPT Genesis/
├── src/                          # Angular frontend application
│   ├── app/
│   │   ├── pages/dashboard/     # Main financial dashboard
│   │   ├── services/            # Auth & Finance services
│   │   └── app.routes.ts        # Routing configuration
│   └── styles/
│
├── mcp-server/                  # MCP Server for ChatGPT integration
│   ├── src/index.ts             # MCP server + Apps SDK implementation
│   ├── package.json             # Node.js dependencies
│   └── README.md                # Detailed setup instructions
│
├── package.json                 # Angular dependencies
├── angular.json                 # Angular build config
└── Documentation files
```

## Quick Start - Local Testing

### 1. Set Up MCP Server

```bash
# Navigate to mcp-server directory
cd mcp-server

# Install dependencies
npm install

# Start the server (runs on port 8000)
npm run dev
```

### 2. Test with MCPJam Inspector

In a new terminal:
```bash
# Start MCPJam Inspector beta
npx -y @mcpjam/inspector@beta
```

- Navigate to `http://localhost:3000`
- Connect to MCP server at `http://localhost:8000/mcp`
- Test tools and view the dashboard widget

### 3. (Optional) Run Angular Frontend

```bash
# Back in main project directory
npm install
ng serve
# Open http://localhost:4200
```

## Available MCP Tools (Callable by ChatGPT)

### 1. `get_financial_overview`
Returns comprehensive financial status:
```json
{
  "totalBalance": 125450.50,
  "monthlyIncome": 8500,
  "monthlyExpense": 3200,
  "savingsRate": "62.35%"
}
```

### 2. `get_recent_transactions`
Retrieves transaction history with optional limit:
```json
[
  {
    "id": "1",
    "description": "Salary Deposit",
    "amount": 8500,
    "type": "income",
    "date": "2025-01-20"
  }
]
```

### 3. `get_expense_analysis`
Provides expense breakdown and recommendations:
```json
{
  "expenseBreakdown": {
    "Food & Dining": 450,
    "Transportation": 300,
    "Utilities": 250
  },
  "recommendations": ["Reduce entertainment by 15%", ...]
}
```

### 4. `render_dashboard`
Displays interactive financial dashboard widget

## Data & Security

✅ **Uses Mock Data Only** - All financial data is simulated and hardcoded
✅ **No Production Connection** - Does not connect to H&R Block systems
✅ **Safe for Testing** - Realistic sample data for demonstration

## Deployment Instructions

### For Testing/Demo

**Option 1: Local Testing**
- Run MCP server on localhost:8000
- Test with MCPJam Inspector
- Perfect for development and demo video

**Option 2: Cloud Deployment**

Recommended platforms:
- **Vercel** (easiest for Node.js apps)
- **Railway** (simple deployment)
- **Render** (free tier available)
- **AWS/Azure** (enterprise option)

Example Vercel deployment:
```bash
npm install -g vercel
cd mcp-server
vercel
```

## ChatGPT Developer Mode Integration

### Setup Steps

1. **Enable Developer Mode**
   - Subscribe to ChatGPT Go (free for 1 year)
   - Navigate to Settings → Developer Mode → Enable

2. **Create App in ChatGPT**
   - Go to "Apps" → "Create App"
   - Configure MCP Server endpoint
   - Point to your deployed server URL
   - (e.g., `https://your-deployment.vercel.app/mcp`)

3. **Test Integration**
   - Ask ChatGPT to access FinanceHub tools
   - Examples:
     - "Show me my financial overview"
     - "Analyze my spending patterns"
     - "Display the financial dashboard"

## Project Evaluation Criteria

### 1. Use Case Relevance to H&R Block (25%)
- ✅ Demonstrates financial advisory functionality
- ✅ Shows integration with financial data systems
- ✅ Applicable to tax prep and financial planning

### 2. Technical Implementation & Design (30%)
- ✅ Proper MCP server implementation
- ✅ OpenAI Apps SDK widget integration
- ✅ RESTful API design
- ✅ Production-ready code structure

### 3. Ability to Convert to Live Use Case (25%)
- ✅ Modular architecture - easily swap mock data for real APIs
- ✅ Environment-based configuration
- ✅ Security considerations documented
- ✅ Scalable to production systems

### 4. Future Scope & Innovation (20%)
- ✅ Multi-user support capability
- ✅ Real-time data integration ready
- ✅ Extensible tool framework
- ✅ Advanced AI-driven recommendations

## Submission Checklist

- [ ] Code repository: ✅ `/mcp-server` directory
- [ ] Documentation: ✅ Setup and integration guides
- [ ] Demo Video: (prepare locally with `npm run dev`)
- [ ] Presentation Deck: (outline below)

### Demo Video Recording

Record a 5-10 minute demo:
1. Start MCP server with `npm run dev`
2. Show MCPJam Inspector connection
3. Call each tool and show results
4. Demonstrate dashboard widget rendering
5. Show code structure and architecture

## File Manifest

| File | Purpose |
|------|---------|
| `mcp-server/src/index.ts` | MCP server implementation |
| `mcp-server/package.json` | Dependencies & scripts |
| `mcp-server/README.md` | Server setup guide |
| `src/` | Angular frontend (existing) |
| `SUBMISSION_GUIDE.md` | This file |

## Important Notes

⚠️ **Security Reminders:**
- No live H&R Block data connected
- Mock data only for demonstration
- Keep app in Developer Mode (not public store)
- Test environment variables properly

💡 **Best Practices:**
- Start MCP server before testing
- Use MCPJam Inspector for debugging
- Test all tools before demo video
- Monitor server logs for errors

## Support & Resources

### MCP Server
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)

### OpenAI Apps SDK
- [Official Documentation](https://developers.openai.com/apps-sdk)
- [Apps SDK Examples](https://github.com/openai/openai-apps-sdk-examples)
- [MCPJam Inspector](https://www.mcpjam.com/)

### Angular Frontend
- Existing dashboard: `src/app/pages/dashboard/`
- Services: `src/app/services/`
- Styles: `src/styles/`

## Next Steps

1. ✅ **Set up & test locally** → `cd mcp-server && npm run dev`
2. **Test with MCPJam** → Use inspector to verify all tools
3. **Record demo video** → Show MCP server in action
4. **Deploy to cloud** → Optional, for live testing
5. **Create presentation** → Highlight use case and innovation
6. **Submit** → Push code to repository by Jan 23, 6 PM

---

**Good luck with the BlockHub AI Code Fest Final Round! 🚀**

For questions: Contact BlockHub team or join the MCP community Discord.
