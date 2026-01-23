# FinanceHub MCP Server - Quick Test Guide

## 🎯 Test Your Deployment

Your MCP server is now running with **API Key authentication** and **ChatGPT-ready endpoints**!

---

## 🔑 Authentication

All endpoints (except `/health`) require API key authentication:

**Header:**
```
X-API-Key: dev-api-key-12345
```

**Or Query Parameter:**
```
?apiKey=dev-api-key-12345
```

---

## 🧪 Test Commands

### 1. Health Check (No Auth Required)
```bash
curl http://localhost:8000/health
```

Expected Response:
```json
{
  "status": "ok",
  "service": "FinanceHub MCP Server",
  "timestamp": "2026-01-23T...",
  "version": "1.0.0"
}
```

### 2. Financial Overview
```bash
curl -H "X-API-Key: dev-api-key-12345" \
  http://localhost:8000/api/financial-overview
```

Expected Response:
```json
{
  "totalBalance": 125450.5,
  "monthlyIncome": 8500,
  "monthlyExpense": 3200,
  "savingsRate": 62.35,
  "lastUpdated": "2026-01-23T..."
}
```

### 3. Recent Transactions
```bash
curl -H "X-API-Key: dev-api-key-12345" \
  "http://localhost:8000/api/transactions?limit=5"
```

### 4. Expense Analysis
```bash
curl -H "X-API-Key: dev-api-key-12345" \
  http://localhost:8000/api/expense-analysis
```

### 5. Budget Recommendations
```bash
curl -H "X-API-Key: dev-api-key-12345" \
  http://localhost:8000/api/budget-recommendations
```

### 6. List MCP Tools
```bash
curl -H "X-API-Key: dev-api-key-12345" \
  http://localhost:8000/mcp/tools
```

### 7. Call MCP Tool
```bash
curl -X POST \
  -H "X-API-Key: dev-api-key-12345" \
  -H "Content-Type: application/json" \
  -d '{"name":"get_financial_overview","arguments":{}}' \
  http://localhost:8000/mcp/call
```

### 8. Dashboard (HTML)
```bash
# Open in browser
start http://localhost:8000/dashboard?apiKey=dev-api-key-12345
```

---

## 🚫 Test Authentication Failure

Try without API key (should return 401):
```bash
curl http://localhost:8000/api/financial-overview
```

Expected Response:
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing API key"
}
```

---

## 🌐 Test with Browser

### Using Postman/Insomnia:
1. **URL:** `http://localhost:8000/api/financial-overview`
2. **Method:** GET
3. **Headers:** Add `X-API-Key` with value `dev-api-key-12345`
4. **Send**

### Using Browser (Query Parameter):
```
http://localhost:8000/api/financial-overview?apiKey=dev-api-key-12345
```

---

## 🤖 Test with ChatGPT

### Option 1: Import OpenAPI Spec

1. Go to ChatGPT → Create Custom GPT
2. Click "Create new action"
3. Upload or paste content from `openapi.yaml`
4. Configure authentication:
   - Type: **API Key**
   - Header Name: **X-API-Key**
   - API Key: **dev-api-key-12345** (or your production key)

### Option 2: Manual Action Configuration

Add this to your Custom GPT Actions:

```yaml
openapi: 3.0.0
info:
  title: FinanceHub API
  version: 1.0.0
servers:
  - url: http://localhost:8000  # Change to your deployed URL
paths:
  /api/financial-overview:
    get:
      summary: Get financial overview
      operationId: getFinancialOverview
      responses:
        '200':
          description: Success
```

### Test Prompts in ChatGPT:
- "Get my financial overview"
- "Show my recent transactions"
- "Analyze my expenses"
- "Give me budget recommendations"

---

## 📊 Expected API Responses

### Financial Overview
```json
{
  "totalBalance": 125450.5,
  "monthlyIncome": 8500,
  "monthlyExpense": 3200,
  "savingsRate": 62.35,
  "lastUpdated": "2026-01-23T12:00:00.000Z"
}
```

### Transactions
```json
{
  "transactions": [
    {
      "id": "1",
      "description": "Salary Deposit",
      "amount": 8500,
      "type": "income",
      "date": "2025-01-20"
    }
  ],
  "total": 10,
  "limit": 5
}
```

### Expense Analysis
```json
{
  "categories": [
    {
      "name": "Housing",
      "amount": 1800,
      "percentage": 56.25
    }
  ],
  "totalExpenses": 3200,
  "insights": [
    "Housing is your largest expense at 56.25% of total spending"
  ]
}
```

### Budget Recommendations
```json
{
  "recommendations": [
    {
      "category": "Transportation",
      "currentSpending": 300,
      "recommendedSpending": 200,
      "savingsPotential": 100,
      "advice": "Consider carpooling or using public transport"
    }
  ],
  "totalSavingsPotential": 250
}
```

---

## ⚡ PowerShell Test Script

Save as `test-api.ps1`:

```powershell
$apiKey = "dev-api-key-12345"
$baseUrl = "http://localhost:8000"
$headers = @{ "X-API-Key" = $apiKey }

Write-Host "Testing FinanceHub API..." -ForegroundColor Cyan

# Health check
Write-Host "`n1. Health Check:" -ForegroundColor Yellow
Invoke-RestMethod "$baseUrl/health" | ConvertTo-Json

# Financial overview
Write-Host "`n2. Financial Overview:" -ForegroundColor Yellow
Invoke-RestMethod "$baseUrl/api/financial-overview" -Headers $headers | ConvertTo-Json

# Transactions
Write-Host "`n3. Transactions:" -ForegroundColor Yellow
Invoke-RestMethod "$baseUrl/api/transactions?limit=3" -Headers $headers | ConvertTo-Json

# Expense analysis
Write-Host "`n4. Expense Analysis:" -ForegroundColor Yellow
Invoke-RestMethod "$baseUrl/api/expense-analysis" -Headers $headers | ConvertTo-Json

# Budget recommendations
Write-Host "`n5. Budget Recommendations:" -ForegroundColor Yellow
Invoke-RestMethod "$baseUrl/api/budget-recommendations" -Headers $headers | ConvertTo-Json

Write-Host "`nAll tests completed!" -ForegroundColor Green
```

Run it:
```powershell
.\test-api.ps1
```

---

## 🔄 Update API Key

### For Development (.env):
```env
API_KEY=your-new-key-here
```

### For Production:
```bash
# Azure
az webapp config appsettings set \
  --name financehub-mcp \
  --settings API_KEY=your-production-key

# Heroku
heroku config:set API_KEY=your-production-key
```

---

## ✅ Checklist

- [ ] Server starts without errors
- [ ] Health check works (no auth)
- [ ] API endpoints require authentication
- [ ] All 4 financial endpoints work
- [ ] MCP tools endpoint works
- [ ] MCP call endpoint works
- [ ] Dashboard loads in browser
- [ ] Invalid API key returns 401
- [ ] CORS allows your frontend origin
- [ ] Ready for ChatGPT integration

---

**Your MCP server is ready for ChatGPT integration!** 🚀
