# FinanceHub ChatGPT App - MCP Server Setup Guide

## Overview

This MCP Server converts the FinanceHub Angular dashboard into a ChatGPT App using the OpenAI Apps SDK. It provides financial data and interactive widgets accessible through ChatGPT.

## Prerequisites

- Node.js 18+ 
- npm or yarn
- ChatGPT Developer Mode access (via ChatGPT Go subscription)
- MCPJam Inspector for local testing

## Project Structure

```
mcp-server/
├── src/
│   └── index.ts           # MCP server implementation with Apps SDK widgets
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## Installation

1. Navigate to the mcp-server directory:
```bash
cd mcp-server
```

2. Install dependencies:
```bash
npm install
```

3. Build the TypeScript:
```bash
npm run build
```

## Running Locally

### Start the MCP Server

```bash
npm run dev
```

The server will start on `http://localhost:8000`

**Endpoints:**
- Health check: `http://localhost:8000/health`
- Dashboard: `http://localhost:8000/dashboard`
- MCP endpoint: `http://localhost:8000/mcp`

### Test with MCPJam Inspector

1. In another terminal, start MCPJam Inspector:
```bash
npx -y @mcpjam/inspector@beta
```

2. Open the inspector in your browser (usually `http://localhost:3000`)

3. Connect to the MCP server:
   - Protocol: SSE (Server-Sent Events)
   - URL: `http://localhost:8000/mcp`

4. Go to the Tools tab and test:
   - `get_financial_overview` - Get balance and income/expense summary
   - `get_recent_transactions` - Retrieve transaction list
   - `get_expense_analysis` - Get expense breakdown with recommendations
   - `render_dashboard` - Display the interactive dashboard widget

5. View the rendered dashboard in the widget preview below

## Features

### MCP Tools (Available to ChatGPT)

1. **get_financial_overview**
   - Returns: Total balance, monthly income, expenses, savings rate
   - Use case: Quick financial status check

2. **get_recent_transactions**
   - Parameters: limit (number of transactions)
   - Returns: List of recent transactions with dates and amounts
   - Use case: Transaction history and review

3. **get_expense_analysis**
   - Returns: Expense breakdown by category + recommendations
   - Use case: Financial planning and budgeting advice

4. **render_dashboard**
   - Returns: Interactive financial dashboard widget
   - Use case: Visual overview in ChatGPT

### MCP Resources (UI Widgets)

- **finance-dashboard.html** - Interactive dashboard with real-time financial data visualization

## Integration with ChatGPT

### For ChatGPT Developer Mode

1. Enable ChatGPT Developer Mode (requires ChatGPT Go subscription)
2. Navigate to "Apps" section
3. Create new app using OpenAI Apps SDK
4. Configure MCP Server endpoint pointing to your deployed server
5. Test the app integration

### Deployment Considerations

**For Testing (DO NOT USE LIVE DATA):**
- Current implementation uses mock data
- Replace `/mock-data/` with test data only
- Never connect to H&R Block production systems

**Recommended Hosting:**
- Vercel (Next.js compatible)
- Railway (Node.js ready)
- Render
- Heroku
- AWS EC2/Lightsail

## Mock Data

The server includes realistic mock financial data:
- **Total Balance**: $125,450.50
- **Monthly Income**: $8,500
- **Monthly Expenses**: $3,200
- **Recent Transactions**: 4 sample transactions
- **Expense Breakdown**: 5 categories

All data is hardcoded for demo purposes.

## Environment Variables

Create a `.env` file (optional):
```
PORT=8000
NODE_ENV=development
```

## Documentation for Submission

When submitting to BlockHub:

1. **Code Repository**: All files in the `mcp-server/` directory
2. **Build Process**: `npm install && npm run build`
3. **Start Command**: `npm run dev` (or `npm start` for production)
4. **Testing**: Use MCPJam Inspector with SSE endpoint

## Troubleshooting

**Port already in use:**
```bash
PORT=8001 npm run dev
```

**MCP connection fails:**
- Ensure server is running on `http://localhost:8000`
- Check CORS settings (should allow all origins for testing)
- Verify firewall allows port 8000

**Widget not rendering:**
- Check browser console for errors
- Verify HTML is valid in the dashboard endpoint
- Test directly: `http://localhost:8000/dashboard`

## Next Steps

1. ✅ Local testing with MCPJam Inspector
2. Deploy server to hosting platform
3. Configure ChatGPT Developer Mode app
4. Create demo video showing App in action
5. Prepare presentation materials

## References

- [OpenAI Apps SDK Documentation](https://developers.openai.com/apps-sdk)
- [MCPJam Inspector](https://www.mcpjam.com/blog/apps-sdk)
- [Model Context Protocol](https://modelcontextprotocol.io/)

## Support

For issues or questions:
- Check MCP Server logs for errors
- Test endpoints manually with curl or Postman
- Use MCPJam Inspector's debug interface
- Review OpenAI Apps SDK documentation
