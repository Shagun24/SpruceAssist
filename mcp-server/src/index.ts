import Anthropic from "@anthropic-ai/sdk";
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import { Server } from "@modelcontextprotocol/sdk/server";
import {
  StdioServerTransport,
} from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  Tool,
  Resource,
  TextContent,
  ImageContent,
  Prompt,
  CallToolResult,
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Load environment variables
import dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 8000;
const API_KEY = process.env.API_KEY || "dev-api-key-12345";
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:4200"];

// Load mock data from JSON files
const loadMockData = (filename: string) => {
  try {
    const dataPath = path.join(process.cwd(), '..', 'src', 'assets', 'mock-data', filename);
    if (fs.existsSync(dataPath)) {
      return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    }
  } catch (error) {
    console.warn(`Could not load ${filename}, using fallback data`);
  }
  return null;
};

const budgetsData = loadMockData('budgets.json');
const savingsData = loadMockData('savings_account.json');
const spendingData = loadMockData('spending_accounts.json');

// Extract budget data
const userBudgets = budgetsData?.[0]?.budgets || {
  dining: { monthly_limit: 500, description: "Restaurants and takeout" },
  groceries: { monthly_limit: 600, description: "Supermarket and food shopping" },
  travel: { monthly_limit: 300, description: "Flights, hotels, and trips" },
  bills: { monthly_limit: 1200, description: "Rent, utilities, subscriptions" },
  entertainment: { monthly_limit: 200, description: "Movies, concerts, events" },
  shopping: { monthly_limit: 350, description: "Clothing, electronics, misc" },
  healthcare: { monthly_limit: 200, description: "Medical expenses and pharmacy" },
  transportation: { monthly_limit: 300, description: "Gas, car maintenance, parking" }
};

// Extract savings goals
const savingsGoals = savingsData?.[0]?.goals || [];
const savingsBalance = savingsData?.[0]?.current_balance || 2500.75;
const spendingBalance = spendingData?.[0]?.current_balance || 2500.75;

// Calculate total balance and monthly budget
const totalBalance = savingsBalance + spendingBalance;
const monthlyIncome = 8500;
const monthlyBudgetTotal = Object.values(userBudgets).reduce((sum: number, budget: any) => sum + budget.monthly_limit, 0);

// API Key Authentication Middleware
const authenticateApiKey = (req: Request, res: Response, next: NextFunction) => {
  // Skip auth for health check
  if (req.path === "/health") {
    return next();
  }

  const apiKey = req.headers["x-api-key"] || req.query.apiKey;
  
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ 
      error: "Unauthorized", 
      message: "Invalid or missing API key" 
    });
  }
  
  next();
};

// Mock financial data for the app
interface FinancialData {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  recentTransactions: Array<{
    id: string;
    description: string;
    amount: number;
    type: "income" | "expense";
    date: string;
  }>;
  expenseBreakdown: Record<string, number>;
}

const mockFinancialData: FinancialData = {
  totalBalance: totalBalance,
  monthlyIncome: monthlyIncome,
  monthlyExpense: monthlyBudgetTotal,
  recentTransactions: [
    {
      id: "1",
      description: "Salary Deposit",
      amount: 8500,
      type: "income",
      date: "2025-01-20",
    },
    {
      id: "2",
      description: "Grocery Store",
      amount: 245.32,
      type: "expense",
      date: "2025-01-19",
    },
    {
      id: "3",
      description: "Gas Station",
      amount: 65.0,
      type: "expense",
      date: "2025-01-18",
    },
    {
      id: "4",
      description: "Restaurant",
      amount: 89.5,
      type: "expense",
      date: "2025-01-17",
    },
  ],
  expenseBreakdown: {
    "Dining": userBudgets.dining?.monthly_limit || 500,
    "Groceries": userBudgets.groceries?.monthly_limit || 600,
    "Transportation": userBudgets.transportation?.monthly_limit || 300,
    "Bills": userBudgets.bills?.monthly_limit || 1200,
    "Entertainment": userBudgets.entertainment?.monthly_limit || 200,
    "Shopping": userBudgets.shopping?.monthly_limit || 350,
    "Healthcare": userBudgets.healthcare?.monthly_limit || 200,
    "Travel": userBudgets.travel?.monthly_limit || 300,
  },
};

// Initialize MCP Server
const server = new Server({
  name: "FinanceHub-MCP-Server",
  version: "1.0.0",
}, {
  capabilities: {
    tools: {},
    resources: {},
  },
});

// Store dashboard HTML content separately
const dashboardHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>FinanceHub Dashboard</title>
      <link rel="stylesheet" href="https://persistent.oaistatic.com/ecosystem-built-assets/styles.css">
      <style>
        body {
          background: linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%);
          color: #e0e0e0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        h1 {
          color: #00d4ff;
          margin-bottom: 30px;
          font-size: 28px;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .card {
          background: linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(255, 20, 147, 0.05) 100%);
          border: 1px solid rgba(0, 212, 255, 0.2);
          border-radius: 12px;
          padding: 20px;
          backdrop-filter: blur(10px);
        }
        .card-title {
          font-size: 14px;
          color: #999;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .card-value {
          font-size: 32px;
          font-weight: 600;
          color: #00d4ff;
          margin-bottom: 8px;
        }
        .card-subtitle {
          font-size: 12px;
          color: #666;
        }
        .transactions {
          background: linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(255, 20, 147, 0.05) 100%);
          border: 1px solid rgba(0, 212, 255, 0.2);
          border-radius: 12px;
          padding: 20px;
          backdrop-filter: blur(10px);
        }
        .transaction-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid rgba(0, 212, 255, 0.1);
        }
        .transaction-item:last-child {
          border-bottom: none;
        }
        .transaction-desc {
          flex: 1;
        }
        .transaction-amount {
          font-weight: 600;
          font-size: 16px;
        }
        .income {
          color: #00d4ff;
        }
        .expense {
          color: #ff1493;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>💰 FinanceHub Dashboard</h1>
        
        <div class="grid">
          <div class="card">
            <div class="card-title">Total Balance</div>
            <div class="card-value">$125,450.50</div>
            <div class="card-subtitle">+ 3.2% from last month</div>
          </div>
          
          <div class="card">
            <div class="card-title">Monthly Income</div>
            <div class="card-value income">$8,500.00</div>
            <div class="card-subtitle">Salary + investments</div>
          </div>
          
          <div class="card">
            <div class="card-title">Monthly Expenses</div>
            <div class="card-value expense">$3,200.00</div>
            <div class="card-subtitle">37.6% of income</div>
          </div>
        </div>

        <div class="transactions">
          <h2 style="color: #00d4ff; margin-top: 0;">Recent Transactions</h2>
          <div class="transaction-item">
            <div class="transaction-desc">
              <strong>Salary Deposit</strong><br>
              <small style="color: #666;">Jan 20, 2025</small>
            </div>
            <div class="transaction-amount income">+$8,500.00</div>
          </div>
          <div class="transaction-item">
            <div class="transaction-desc">
              <strong>Grocery Store</strong><br>
              <small style="color: #666;">Jan 19, 2025</small>
            </div>
            <div class="transaction-amount expense">-$245.32</div>
          </div>
          <div class="transaction-item">
            <div class="transaction-desc">
              <strong>Gas Station</strong><br>
              <small style="color: #666;">Jan 18, 2025</small>
            </div>
            <div class="transaction-amount expense">-$65.00</div>
          </div>
          <div class="transaction-item">
            <div class="transaction-desc">
              <strong>Restaurant</strong><br>
              <small style="color: #666;">Jan 17, 2025</small>
            </div>
            <div class="transaction-amount expense">-$89.50</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

// Define MCP Resources (for Apps SDK widgets)
const dashboardWidget: Resource = {
  uri: "ui://widget/finance-dashboard.html",
  name: "Finance Dashboard",
  description: "Interactive financial overview dashboard",
  mimeType: "text/html",
};

// Define MCP Tools
const tools: Tool[] = [
  {
    name: "get_financial_overview",
    description:
      "Get a comprehensive overview of the user's financial status including balance, income, and expenses",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "get_recent_transactions",
    description:
      "Retrieve a list of recent financial transactions with details",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Number of transactions to retrieve (default: 10)",
        },
      },
      required: [],
    },
  },
  {
    name: "get_expense_analysis",
    description:
      "Get detailed breakdown of expenses by category with recommendations",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "render_dashboard",
    description: "Render the interactive financial dashboard widget",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
];

// MCP Tool Handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "get_financial_overview":
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                totalBalance: mockFinancialData.totalBalance,
                monthlyIncome: mockFinancialData.monthlyIncome,
                monthlyExpense: mockFinancialData.monthlyExpense,
                savingsRate:
                  (
                    ((mockFinancialData.monthlyIncome -
                      mockFinancialData.monthlyExpense) /
                      mockFinancialData.monthlyIncome) *
                    100
                  ).toFixed(2) + "%",
              },
              null,
              2
            ),
          } as TextContent,
        ],
      };

    case "get_recent_transactions":
      const limit = args?.limit || 10;
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              mockFinancialData.recentTransactions.slice(0, limit),
              null,
              2
            ),
          } as TextContent,
        ],
      };

    case "get_expense_analysis":
      const totalExpenses = Object.values(mockFinancialData.expenseBreakdown)
        .reduce((a, b) => a + b, 0)
        .toFixed(2);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                expenseBreakdown: mockFinancialData.expenseBreakdown,
                totalExpenses,
                recommendations: [
                  "Consider reducing entertainment expenses by 15%",
                  "Food & Dining is the largest expense - meal planning could save 10%",
                  "Current savings rate is healthy at 62.4%",
                ],
              },
              null,
              2
            ),
          } as TextContent,
        ],
      };

    case "render_dashboard":
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                widget: "finance-dashboard.html",
                title: "Finance Dashboard",
                description: "Interactive financial overview",
              },
              null,
              2
            ),
          } as TextContent,
        ],
      };

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// MCP Resource Handlers
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: dashboardWidget.uri,
        name: dashboardWidget.name,
        description: dashboardWidget.description,
        mimeType: dashboardWidget.mimeType,
      },
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request: any) => {
  const { uri } = request.params;
  if (uri === "ui://widget/finance-dashboard.html") {
    return {
      contents: [
        {
          uri: dashboardWidget.uri,
          mimeType: dashboardWidget.mimeType,
          text: dashboardHTML,
        },
      ],
    };
  }
  throw new Error(`Unknown resource: ${uri}`);
});

// Express middleware setup
app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-API-Key']
}));
app.use(express.json());
app.use(authenticateApiKey);

// Health check (no auth required)
app.get("/health", (req: Request, res: Response) => {
  res.json({ 
    status: "ok", 
    service: "FinanceHub MCP Server",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// API Endpoints for ChatGPT integration
app.get("/api/financial-overview", (req: Request, res: Response) => {
  const savingsRate = ((mockFinancialData.monthlyIncome - mockFinancialData.monthlyExpense) / mockFinancialData.monthlyIncome) * 100;
  
  res.json({
    totalBalance: mockFinancialData.totalBalance,
    monthlyIncome: mockFinancialData.monthlyIncome,
    monthlyExpense: mockFinancialData.monthlyExpense,
    savingsRate: parseFloat(savingsRate.toFixed(2)),
    lastUpdated: new Date().toISOString()
  });
});

app.get("/api/transactions", (req: Request, res: Response) => {
  const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
  const transactions = mockFinancialData.recentTransactions.slice(0, limit);
  
  res.json({
    transactions,
    total: mockFinancialData.recentTransactions.length,
    limit
  });
});

app.get("/api/expense-analysis", (req: Request, res: Response) => {
  const totalExpenses = Object.values(mockFinancialData.expenseBreakdown).reduce((a, b) => a + b, 0);
  
  const categories = Object.entries(mockFinancialData.expenseBreakdown).map(([name, amount]) => ({
    name,
    amount,
    percentage: parseFloat(((amount / totalExpenses) * 100).toFixed(2))
  }));
  
  const insights = [
    `Housing is your largest expense at ${categories[0].percentage}% of total spending`,
    `Consider reducing ${categories[1].name} costs to save more`,
    `You're spending ${totalExpenses} per month on expenses`
  ];
  
  res.json({
    categories,
    totalExpenses,
    insights
  });
});

app.get("/api/budget-recommendations", (req: Request, res: Response) => {
  // Generate recommendations based on actual budget data
  const recommendations = [];
  
  // Calculate current spending vs budget limits
  const categories = Object.entries(userBudgets);
  
  // Sort by highest budget to identify areas with most potential
  const sortedCategories = categories.sort((a: any, b: any) => b[1].monthly_limit - a[1].monthly_limit);
  
  // Transportation recommendation
  if (userBudgets.transportation) {
    const current = userBudgets.transportation.monthly_limit;
    const recommended = Math.round(current * 0.7); // 30% reduction
    recommendations.push({
      category: "Transportation",
      currentSpending: current,
      recommendedSpending: recommended,
      savingsPotential: current - recommended,
      advice: "Consider carpooling, public transportation, or walking for short distances. Could save 30% monthly."
    });
  }
  
  // Dining recommendation
  if (userBudgets.dining) {
    const current = userBudgets.dining.monthly_limit;
    const recommended = Math.round(current * 0.75); // 25% reduction
    recommendations.push({
      category: "Dining",
      currentSpending: current,
      recommendedSpending: recommended,
      savingsPotential: current - recommended,
      advice: "Meal prep at home more often. Even 1-2 fewer restaurant visits per week can save 25%."
    });
  }
  
  // Entertainment recommendation
  if (userBudgets.entertainment) {
    const current = userBudgets.entertainment.monthly_limit;
    const recommended = Math.round(current * 0.75); // 25% reduction
    recommendations.push({
      category: "Entertainment",
      currentSpending: current,
      recommendedSpending: recommended,
      savingsPotential: current - recommended,
      advice: "Look for free community events, movie matinees, or streaming services instead of premium events."
    });
  }
  
  // Shopping recommendation
  if (userBudgets.shopping) {
    const current = userBudgets.shopping.monthly_limit;
    const recommended = Math.round(current * 0.7); // 30% reduction
    recommendations.push({
      category: "Shopping",
      currentSpending: current,
      recommendedSpending: recommended,
      savingsPotential: current - recommended,
      advice: "Implement a 24-hour rule before non-essential purchases. Use shopping lists to avoid impulse buying."
    });
  }
  
  // Add savings goals context if available
  let savingsGoalAdvice = "";
  if (savingsGoals.length > 0) {
    const totalSavingsPotential = recommendations.reduce((sum, r) => sum + r.savingsPotential, 0);
    const goalNames = savingsGoals.map((g: any) => g.name).join(", ");
    savingsGoalAdvice = `These savings could help accelerate your goals: ${goalNames}. Total monthly savings potential: $${totalSavingsPotential}.`;
  }
  
  res.json({
    recommendations: recommendations.slice(0, 4), // Top 4 recommendations
    totalSavingsPotential: recommendations.reduce((sum, r) => sum + r.savingsPotential, 0),
    currentMonthlyBudget: monthlyBudgetTotal,
    savingsGoals: savingsGoals.map((g: any) => ({
      name: g.name,
      target: g.target_amount,
      current: g.current_amount,
      monthlyContribution: g.monthly_contribution
    })),
    advice: savingsGoalAdvice || "Start tracking your spending to identify more savings opportunities."
  });
});

// AI-powered financial advice endpoint
app.post("/api/financial-advice", async (req: Request, res: Response) => {
  const { question } = req.body;
  
  if (!question) {
    return res.status(400).json({ error: "Question is required" });
  }
  
  try {
    // Prepare financial context from mock data
    const financialContext = {
      totalBalance: mockFinancialData.totalBalance,
      monthlyIncome: mockFinancialData.monthlyIncome,
      monthlyExpense: mockFinancialData.monthlyExpense,
      savingsRate: ((mockFinancialData.monthlyIncome - mockFinancialData.monthlyExpense) / mockFinancialData.monthlyIncome * 100).toFixed(2),
      budgets: userBudgets,
      savingsGoals: savingsGoals,
      recentTransactions: mockFinancialData.recentTransactions.slice(0, 5),
      expenseBreakdown: mockFinancialData.expenseBreakdown
    };
    
    // Generate contextual advice based on question
    const advice = generateFinancialAdvice(question.toLowerCase(), financialContext);
    
    res.json({
      question,
      advice: advice.advice,
      relevantData: advice.data,
      recommendations: advice.recommendations,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      error: "Failed to generate advice", 
      message: error instanceof Error ? error.message : "Unknown error" 
    });
  }
});

// Helper function to generate contextual financial advice
function generateFinancialAdvice(question: string, context: any) {
  const response: any = {
    advice: "",
    data: {},
    recommendations: []
  };
  
  // Normalize question to lowercase for matching
  const q = question.toLowerCase().trim();
  
  // Cryptocurrency questions (check BEFORE general investment)
  if (q.includes("crypto") || q.includes("bitcoin") || q.includes("ethereum") || q.includes("btc") || q.includes("blockchain")) {
    response.advice = `Cryptocurrency is highly volatile and speculative. With your ${context.savingsRate}% savings rate and $${context.totalBalance} balance, here's a cautious approach:`;
    response.data = { 
      currentBalance: context.totalBalance,
      monthlyIncome: context.monthlyIncome,
      savingsRate: context.savingsRate + "%"
    };
    response.recommendations = [
      `Only invest what you can afford to lose (max 5% of portfolio)`,
      `Build emergency fund first (6 months expenses = $${context.monthlyExpense * 6})`,
      `Prioritize 401(k) match and IRA contributions before crypto`,
      `Never invest borrowed money or emergency funds in crypto`,
      `Research thoroughly - Bitcoin and Ethereum are more established`,
      `Use reputable exchanges like Coinbase or Kraken`,
      `Consider crypto as speculation, not investment`,
      `Be prepared for 50-80% price swings`,
      `Don't invest based on FOMO or hype`
    ];
    return response;
  }
  
  // Savings-related questions
  if (q.includes("save") || q.includes("saving")) {
    const potentialSavings = context.monthlyIncome - context.monthlyExpense;
    response.advice = `Based on your current income of $${context.monthlyIncome} and expenses of $${context.monthlyExpense}, you're saving $${potentialSavings} per month (${context.savingsRate}% savings rate).`;
    
    response.data = {
      currentSavings: potentialSavings,
      savingsRate: context.savingsRate + "%",
      savingsGoals: context.savingsGoals
    };
    
    // Analyze high-spending categories
    const sortedExpenses = Object.entries(context.expenseBreakdown)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 3);
    
    response.recommendations = sortedExpenses.map(([category, amount]: any) => {
      const reduction = Math.round(amount * 0.2);
      return `Reduce ${category} spending by 20% (from $${amount} to $${amount - reduction}) to save an additional $${reduction}/month`;
    });
    return response;
  }
  
  // Budget-related questions
  if (q.includes("budget") || q.includes("spending") || q.includes("expense")) {
    response.advice = `Your total monthly budget is $${context.monthlyExpense}. Here's how it breaks down:`;
    response.data = context.expenseBreakdown;
    
    const highestCategory = Object.entries(context.expenseBreakdown)
      .reduce((max: any, curr: any) => curr[1] > max[1] ? curr : max);
    
    response.recommendations = [
      `${highestCategory[0]} is your highest expense at $${highestCategory[1]}/month`,
      `Consider the 50/30/20 rule: 50% needs, 30% wants, 20% savings`,
      `Your current allocation: ${((context.monthlyExpense / context.monthlyIncome) * 100).toFixed(1)}% expenses, ${context.savingsRate}% savings`
    ];
    return response;
  }
  
  // Transportation questions
  if (q.includes("transport") || q.includes("gas") || q.includes("car") || q.includes("commute") || q.includes("uber") || q.includes("lyft")) {
    const transportBudget = context.budgets.transportation?.monthly_limit || 0;
    response.advice = `Your monthly transportation budget is $${transportBudget}. Here are ways to optimize:`;
    response.data = { currentBudget: transportBudget };
    response.recommendations = [
      `Carpool with coworkers 2-3 days/week to save 40-60% on gas`,
      `Use public transit for commuting: potential $${Math.round(transportBudget * 0.5)} monthly savings`,
      `Maintain your car regularly to prevent costly repairs`,
      `Consider biking/walking for trips under 2 miles`,
      `Compare gas prices using apps like GasBuddy`,
      `Work from home when possible to reduce commute costs`
    ];
    return response;
  }
  
  // Dining/food questions
  if (q.includes("food") || q.includes("dining") || q.includes("restaurant") || q.includes("eat") || q.includes("groceries") || q.includes("meal")) {
    const diningBudget = context.budgets.dining?.monthly_limit || 0;
    const groceryBudget = context.budgets.groceries?.monthly_limit || 0;
    response.advice = `Your food expenses: Dining out $${diningBudget}, Groceries $${groceryBudget}/month. Here's how to save:`;
    response.data = { dining: diningBudget, groceries: groceryBudget };
    response.recommendations = [
      `Meal prep on Sundays - save $${Math.round(diningBudget * 0.3)}/month by cooking at home`,
      `Pack lunch for work 4-5 days/week: $${Math.round(diningBudget * 0.4)} savings`,
      `Use grocery store loyalty programs and coupons`,
      `Plan meals around sales and seasonal produce`,
      `Limit restaurant visits to 1-2 times per week`,
      `Buy generic brands to save 20-30% on groceries`,
      `Use apps like Too Good To Go for discounted meals`
    ];
    return response;
  }
  

  // Entertainment questions
  if (q.includes("entertainment") || q.includes("fun") || q.includes("activities") || q.includes("hobby") || q.includes("movie") || q.includes("streaming")) {
    const entertainmentBudget = context.budgets.entertainment?.monthly_limit || 0;
    response.advice = `You're budgeting $${entertainmentBudget}/month for entertainment. Smart ways to enjoy life affordably:`;
    response.data = { currentBudget: entertainmentBudget };
    response.recommendations = [
      `Free community events: concerts, festivals, museum days`,
      `Movie matinees instead of evening shows save 40-50%`,
      `Share streaming subscriptions with family/friends`,
      `Look for Groupon deals and happy hour specials`,
      `Host game nights instead of going out`,
      `Visit libraries for free books, movies, and events`,
      `Take advantage of free trial periods for new services`
    ];
    return response;
  }
  

  // Goals-related questions
  if (q.includes("goal") || q.includes("target") || q.includes("achieve") || q.includes("plan")) {
    response.advice = `You have ${context.savingsGoals.length} active savings goals:`;
    response.data = { goals: context.savingsGoals };
    
    context.savingsGoals.forEach((goal: any) => {
      const remaining = goal.target_amount - goal.current_amount;
      const monthsNeeded = Math.ceil(remaining / goal.monthly_contribution);
      response.recommendations.push(
        `${goal.name}: $${goal.current_amount}/$${goal.target_amount} - On track to reach in ${monthsNeeded} months with $${goal.monthly_contribution}/month contributions`
      );
    });
    
    const currentSavings = context.monthlyIncome - context.monthlyExpense;
    if (currentSavings > 0) {
      response.recommendations.push(`You could increase contributions by $${Math.round(currentSavings * 0.2)} to reach goals faster`);
    }
    return response;
  }
  
  // Shopping questions
  if (q.includes("shop") || q.includes("purchase") || q.includes("buy") || q.includes("amazon") || q.includes("online shopping")) {
    const shoppingBudget = context.budgets.shopping?.monthly_limit || 0;
    response.advice = `Your shopping budget is $${shoppingBudget}/month. Smart shopping strategies:`;
    response.data = { currentBudget: shoppingBudget };
    response.recommendations = [
      `Implement 24-hour rule: Wait a day before non-essential purchases`,
      `Make shopping lists and stick to them`,
      `Compare prices online before buying`,
      `Buy quality items that last longer`,
      `Use cashback apps like Rakuten and browser extensions like Honey`,
      `Shop end-of-season sales for 50-70% discounts`,
      `Unsubscribe from promotional emails to reduce temptation`,
      `Use price tracking tools to buy at optimal times`
    ];
    return response;
  }
  

  // Investment questions
  if (q.includes("invest") || q.includes("retirement") || q.includes("401k") || q.includes("ira") || q.includes("stock") || q.includes("portfolio")) {
    const monthlySavings = context.monthlyIncome - context.monthlyExpense;
    response.advice = `With $${monthlySavings}/month in surplus, here's an investment strategy:`;
    response.data = { monthlySurplus: monthlySavings };
    response.recommendations = [
      `Max out employer 401(k) match first - it's free money`,
      `Build 3-6 month emergency fund: target $${context.monthlyExpense * 3}-${context.monthlyExpense * 6}`,
      `Consider Roth IRA contributions: $${Math.min(monthlySavings * 0.3, 500)}/month`,
      `Diversify with low-cost index funds (S&P 500, Total Market)`,
      `Start with 70% stocks, 30% bonds based on your age`,
      `Automate investments with dollar-cost averaging`,
      `Consider HSA for triple tax benefits if eligible`
    ];
    return response;
  }
  

  // Debt questions
  if (q.includes("debt") || q.includes("loan") || q.includes("credit card") || q.includes("pay off") || q.includes("owe")) {
    response.advice = `Managing debt effectively is crucial for financial health. Here's your strategy:`;
    response.data = { monthlyIncome: context.monthlyIncome, monthlyExpense: context.monthlyExpense };
    response.recommendations = [
      `Use debt avalanche method: pay highest interest rate first`,
      `Allocate $${Math.round((context.monthlyIncome - context.monthlyExpense) * 0.5)} extra toward debt monthly`,
      `Avoid new credit card balances - use debit card instead`,
      `Consider balance transfer to 0% APR card`,
      `Call creditors to negotiate lower interest rates`,
      `Make bi-weekly payments instead of monthly to save interest`,
      `Snowball method: pay smallest debt first for psychological wins`
    ];
    return response;
  }
  

  // Emergency fund questions
  if (q.includes("emergency") || q.includes("rainy day") || q.includes("unexpected")) {
    const recommendedEmergency = context.monthlyExpense * 6;
    const currentSavings = context.monthlyIncome - context.monthlyExpense;
    response.advice = `Your recommended emergency fund is $${recommendedEmergency} (6 months of expenses). Here's how to build it:`;
    response.data = { recommendedAmount: recommendedEmergency, monthlyExpense: context.monthlyExpense };
    response.recommendations = [
      `Set aside $${Math.round(currentSavings * 0.4)}/month to build emergency fund`,
      `Keep emergency fund in high-yield savings account (4-5% APY)`,
      `Start with 3 months of expenses, then work toward 6 months`,
      `Automate transfers to separate account so you don't spend it`,
      `Only use for true emergencies: job loss, medical, urgent repairs`,
      `Replenish immediately after using emergency funds`
    ];
    return response;
  }
  

  // Bills and utilities questions
  if (q.includes("bill") || q.includes("utilities") || q.includes("electricity") || q.includes("water") || q.includes("internet") || q.includes("phone")) {
    const billsBudget = context.budgets.bills?.monthly_limit || 0;
    response.advice = `Your monthly bills budget is $${billsBudget}. Ways to reduce recurring expenses:`;
    response.data = { currentBudget: billsBudget };
    response.recommendations = [
      `Call providers annually to negotiate lower rates`,
      `Bundle internet, phone, and TV for 20-30% savings`,
      `Switch to energy-efficient LED bulbs and appliances`,
      `Install programmable thermostat to save $180/year`,
      `Review subscriptions - cancel unused services`,
      `Compare insurance rates yearly for better deals`,
      `Use budget billing to avoid seasonal spikes`
    ];
    return response;
  }
  

  // Healthcare questions
  if (q.includes("health") || q.includes("medical") || q.includes("insurance") || q.includes("doctor") || q.includes("prescription")) {
    const healthcareBudget = context.budgets.healthcare?.monthly_limit || 0;
    response.advice = `Your healthcare budget is $${healthcareBudget}/month. Smart healthcare spending strategies:`;
    response.data = { currentBudget: healthcareBudget };
    response.recommendations = [
      `Use generic medications - save 80-85% vs brand name`,
      `Take advantage of preventive care (usually free)`,
      `Use HSA/FSA for tax-free healthcare spending`,
      `Compare pharmacy prices using GoodRx`,
      `Consider telemedicine for minor issues ($40 vs $150)`,
      `Negotiate medical bills - ask for itemized statements`,
      `Stay in-network to avoid surprise bills`
    ];
    return response;
  }
  

  // Travel and vacation questions
  if (q.includes("travel") || q.includes("vacation") || q.includes("trip") || q.includes("holiday")) {
    const travelBudget = context.budgets.travel?.monthly_limit || 0;
    response.advice = `Your travel budget is $${travelBudget}/month. Smart travel planning tips:`;
    response.data = { currentBudget: travelBudget, annualBudget: travelBudget * 12 };
    response.recommendations = [
      `Book flights 6-8 weeks in advance for best prices`,
      `Travel during off-peak seasons for 40-60% savings`,
      `Use travel rewards credit cards strategically`,
      `Consider Airbnb or VRBO instead of hotels`,
      `Pack light to avoid baggage fees`,
      `Use public transportation at destinations`,
      `Look for free walking tours and activities`,
      `Cook some meals if accommodation has kitchen`
    ];
    return response;
  }
  

  // Income and side hustle questions
  if (q.includes("income") || q.includes("earn more") || q.includes("side hustle") || q.includes("raise") || q.includes("promotion")) {
    response.advice = `Your current monthly income is $${context.monthlyIncome}. Ways to increase earnings:`;
    response.data = { currentIncome: context.monthlyIncome };
    response.recommendations = [
      `Ask for raise - research market rates for your role`,
      `Freelance in your field for extra $500-2000/month`,
      `Sell unused items online (Facebook Marketplace, eBay)`,
      `Rent out spare room on Airbnb`,
      `Start a side business based on your skills`,
      `Teach or tutor online ($20-60/hour)`,
      `Invest in skills that increase earning potential`,
      `Consider job hopping - often 10-20% salary increase`
    ];
    return response;
  }
  

  // Credit score questions
  if (q.includes("credit score") || q.includes("credit report") || q.includes("credit rating")) {
    response.advice = `Building and maintaining good credit (700+) saves money on loans and rates:`;
    response.data = { monthlyIncome: context.monthlyIncome };
    response.recommendations = [
      `Pay all bills on time - set up autopay`,
      `Keep credit utilization below 30% of limit`,
      `Don't close old credit cards - length of history matters`,
      `Check credit report free at annualcreditreport.com`,
      `Dispute any errors on credit report immediately`,
      `Become authorized user on family member's card`,
      `Avoid applying for multiple cards in short period`,
      `Use credit monitoring apps to track score`
    ];
    return response;
  }
  

  // Tax questions
  if (q.includes("tax") || q.includes("deduction") || q.includes("refund") || q.includes("irs")) {
    response.advice = `Smart tax strategies to keep more of your $${context.monthlyIncome} monthly income:`;
    response.data = { annualIncome: context.monthlyIncome * 12 };
    response.recommendations = [
      `Max out 401(k) contributions to lower taxable income`,
      `Use HSA/FSA for tax-free healthcare spending`,
      `Track deductible expenses: charity, medical, business`,
      `Consider itemizing if deductions exceed standard`,
      `Contribute to traditional IRA for tax deduction`,
      `Keep records for home office deduction if self-employed`,
      `Use tax software or consult CPA for complex situations`,
      `Adjust W-4 withholding to avoid large refund (use money now)`
    ];
    return response;
  }
  

  // Insurance questions
  if (q.includes("insurance") && !q.includes("health")) {
    response.advice = `Insurance protects your finances but can be optimized:`;
    response.data = { monthlyExpense: context.monthlyExpense };
    response.recommendations = [
      `Shop for auto insurance annually - save $200-500`,
      `Bundle home/auto insurance for 15-25% discount`,
      `Increase deductibles to lower premiums`,
      `Get life insurance while young (much cheaper)`,
      `Drop collision coverage on cars worth under $3000`,
      `Ask about discounts: safe driver, multi-policy, good student`,
      `Consider umbrella policy for extra liability protection`,
      `Review coverage annually to avoid over-insuring`
    ];
    return response;
  }
  

  // Housing and rent questions
  if (q.includes("rent") || q.includes("mortgage") || q.includes("housing") || q.includes("apartment") || q.includes("house")) {
    const housingBudget = context.budgets.bills?.monthly_limit || 0;
    response.advice = `Housing typically should be under 30% of income. Your bills budget (including rent) is $${housingBudget}:`;
    response.data = { housingBudget, incomePercentage: ((housingBudget / context.monthlyIncome) * 100).toFixed(1) };
    response.recommendations = [
      `Keep housing under 30% of gross income`,
      `Consider roommates to split costs`,
      `Negotiate rent renewal - landlords prefer keeping tenants`,
      `If buying, put down 20% to avoid PMI`,
      `Refinance mortgage if rates drop 0.5% or more`,
      `Reduce utility costs with energy-efficient upgrades`,
      `Research first-time homebuyer programs in your area`
    ];
    return response;
  }
  

  // Education questions
  if (q.includes("education") || q.includes("student loan") || q.includes("college") || q.includes("tuition") || q.includes("degree")) {
    response.advice = `Education investment strategies based on your $${context.monthlyIncome} monthly income:`;
    response.data = { monthlyIncome: context.monthlyIncome };
    response.recommendations = [
      `Research employer tuition reimbursement programs`,
      `Consider community college for first 2 years (save 50-70%)`,
      `Look for scholarships and grants - free money`,
      `Take AP/CLEP exams to earn college credits cheaply`,
      `Compare student loan refinancing rates annually`,
      `Use income-driven repayment plans if struggling`,
      `Invest in skills with high ROI for your field`,
      `Explore free online courses (Coursera, edX) first`
    ];
    return response;
  }
  
  // General financial health (default fallback)
  response.advice = `Your financial health summary: Income $${context.monthlyIncome}, Expenses $${context.monthlyExpense}, Savings Rate ${context.savingsRate}%. You're in good shape!`;
  response.data = {
    income: context.monthlyIncome,
    expenses: context.monthlyExpense,
    savingsRate: context.savingsRate + "%",
    totalBalance: context.totalBalance
  };
  response.recommendations = [
    `Your ${context.savingsRate}% savings rate is excellent (aim for 20%+)`,
    `Top expense: ${Object.entries(context.expenseBreakdown)[0][0]} at $${Object.entries(context.expenseBreakdown)[0][1]}`,
    `Keep tracking expenses and reviewing monthly`,
    `Consider automating savings transfers`,
    `Review and adjust budgets quarterly`,
    `Build emergency fund equal to 6 months expenses`,
    `Maximize retirement contributions for compound growth`
  ];
  
  return response;
}

// MCP Tools endpoint for ChatGPT
app.get("/mcp/tools", (req: Request, res: Response) => {
  res.json({
    tools: [
      {
        name: "get_financial_overview",
        description: "Get total balance, monthly income, expenses, and savings rate",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "get_recent_transactions",
        description: "Get recent financial transactions",
        inputSchema: {
          type: "object",
          properties: {
            limit: { type: "number", description: "Number of transactions to return", default: 10 }
          }
        }
      },
      {
        name: "get_expense_analysis",
        description: "Get expense breakdown by category with insights",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "get_budget_recommendations",
        description: "Get personalized budget recommendations",
        inputSchema: { type: "object", properties: {} }
      }
    ]
  });
});

// MCP Tool execution endpoint
app.post("/mcp/call", async (req: Request, res: Response) => {
  const { name, arguments: args } = req.body;
  
  try {
    let result;
    
    switch (name) {
      case "get_financial_overview":
        const savingsRate = ((mockFinancialData.monthlyIncome - mockFinancialData.monthlyExpense) / mockFinancialData.monthlyIncome) * 100;
        result = {
          content: [{
            type: "text",
            text: JSON.stringify({
              totalBalance: mockFinancialData.totalBalance,
              monthlyIncome: mockFinancialData.monthlyIncome,
              monthlyExpense: mockFinancialData.monthlyExpense,
              savingsRate: parseFloat(savingsRate.toFixed(2))
            }, null, 2)
          }]
        };
        break;
        
      case "get_recent_transactions":
        const limit = args?.limit || 10;
        const transactions = mockFinancialData.recentTransactions.slice(0, limit);
        result = {
          content: [{
            type: "text",
            text: JSON.stringify({ transactions }, null, 2)
          }]
        };
        break;
        
      case "get_expense_analysis":
        const totalExpenses = Object.values(mockFinancialData.expenseBreakdown).reduce((a, b) => a + b, 0);
        const categories = Object.entries(mockFinancialData.expenseBreakdown).map(([name, amount]) => ({
          name,
          amount,
          percentage: parseFloat(((amount / totalExpenses) * 100).toFixed(2))
        }));
        result = {
          content: [{
            type: "text",
            text: JSON.stringify({ categories, totalExpenses }, null, 2)
          }]
        };
        break;
        
      case "get_budget_recommendations":
        // Generate recommendations based on actual budget data
        const budgetRecommendations = [];
        
        if (userBudgets.transportation) {
          const current = userBudgets.transportation.monthly_limit;
          const recommended = Math.round(current * 0.7);
          budgetRecommendations.push({
            category: "Transportation",
            currentSpending: current,
            recommendedSpending: recommended,
            savingsPotential: current - recommended,
            advice: "Consider carpooling, public transportation, or walking for short distances"
          });
        }
        
        if (userBudgets.dining) {
          const current = userBudgets.dining.monthly_limit;
          const recommended = Math.round(current * 0.75);
          budgetRecommendations.push({
            category: "Dining",
            currentSpending: current,
            recommendedSpending: recommended,
            savingsPotential: current - recommended,
            advice: "Meal prep at home more often to reduce dining out costs"
          });
        }
        
        if (userBudgets.shopping) {
          const current = userBudgets.shopping.monthly_limit;
          const recommended = Math.round(current * 0.7);
          budgetRecommendations.push({
            category: "Shopping",
            currentSpending: current,
            recommendedSpending: recommended,
            savingsPotential: current - recommended,
            advice: "Implement a 24-hour rule before non-essential purchases"
          });
        }
        
        const totalSavings = budgetRecommendations.reduce((sum, r) => sum + r.savingsPotential, 0);
        
        result = {
          content: [{
            type: "text",
            text: JSON.stringify({
              recommendations: budgetRecommendations,
              totalSavingsPotential: totalSavings,
              currentMonthlyBudget: monthlyBudgetTotal,
              savingsGoals: savingsGoals.map((g: any) => ({
                name: g.name,
                target: g.target_amount,
                current: g.current_amount
              })),
              advice: `You could save $${totalSavings}/month by implementing these recommendations. This could help with your goals: ${savingsGoals.map((g: any) => g.name).join(", ")}.`
            }, null, 2)
          }]
        };
        break;
        
      default:
        return res.status(400).json({ error: "Unknown tool", tool: name });
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: "Tool execution failed", 
      message: error instanceof Error ? error.message : "Unknown error" 
    });
  }
});

// Serve dashboard directly for testing
app.get("/dashboard", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/html");
  res.send(dashboardHTML);
});

// Start server
app.listen(PORT, () => {
  console.log(`FinanceHub MCP Server running on http://localhost:${PORT}`);
  console.log(`Dashboard available at http://localhost:${PORT}/dashboard`);
  console.log(`MCP endpoint: http://localhost:${PORT}/mcp`);
  console.log(`API Key required: ${API_KEY}`);
});

