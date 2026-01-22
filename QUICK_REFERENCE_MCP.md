# ⚡ Quick Reference Card

## Start Here

```bash
cd mcp-server
npm install
npm run dev
```

Server runs on: `http://localhost:8000`

## Test the Server

```bash
# In a new terminal
npx -y @mcpjam/inspector@beta
```

Navigate to `http://localhost:3000` and connect to `http://localhost:8000/mcp`

## Available Tools

1. **get_financial_overview** → Shows balance, income, expenses
2. **get_recent_transactions** → Shows last 4 transactions
3. **get_expense_analysis** → Shows spending breakdown
4. **render_dashboard** → Shows interactive dashboard

## Project Structure

```
mcp-server/
├── src/index.ts           ← All server code here
├── package.json           ← Dependencies
└── README.md              ← Setup guide
```

## Key Files to Know

| File | Purpose |
|------|---------|
| `MCP_SETUP_SUMMARY.md` | Overview of what was created |
| `SUBMISSION_GUIDE.md` | How to submit to BlockHub |
| `DEPLOYMENT.md` | How to deploy to cloud |
| `mcp-server/README.md` | Technical details |

## All Scripts

```bash
npm run server:setup    # Install deps
npm run server:dev      # Start server
npm run server:start    # Start production
npm run test:mcp        # Launch MCPJam
```

## Common Ports

- **4200**: Angular app (if running)
- **8000**: MCP server
- **3000**: MCPJam Inspector

## Data Included

- Balance: $125,450.50
- Income: $8,500/month
- Expenses: $3,200/month
- 4 sample transactions
- 5 expense categories

**All mock data - safe to demo!**

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 8000 in use | `PORT=8001 npm run dev` |
| Install fails | `rm -rf node_modules && npm install` |
| Can't connect | Check server is running on 8000 |
| Widget not showing | Visit `http://localhost:8000/dashboard` |

## BlockHub Deadline

**Jan 23, 2026 @ 6 PM**

Need to submit:
- Code ✅ (ready)
- Demo video 📹
- Presentation 📊
- Documentation ✅ (ready)

## Next: Record Demo

1. Start server: `npm run dev`
2. Start MCPJam: `npm run test:mcp`
3. Screen record showing:
   - Server running
   - MCPJam connected
   - Tools being called
   - Dashboard rendering
4. Keep under 10 minutes

---

**Everything is ready. Just run the commands above and you're good to go!** 🚀

