import { Server } from "@modelcontextprotocol/sdk/server";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  Tool,
  Resource,
  TextContent,
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

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
  totalBalance: 125450.5,
  monthlyIncome: 8500,
  monthlyExpense: 3200,
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
    "Food & Dining": 450,
    Transportation: 300,
    Utilities: 250,
    Entertainment: 200,
    Shopping: 350,
  },
};

// Dashboard HTML content
const dashboardHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FinanceHub Dashboard</title>
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

// Define MCP Resources
const dashboardWidget: Resource = {
  uri: "finance://dashboard",
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
    name: "get_budget_recommendations",
    description:
      "Get AI-powered budget recommendations based on spending patterns",
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

    case "get_budget_recommendations":
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                recommendations: [
                  {
                    category: "Emergency Fund",
                    current: "6 months",
                    recommendation: "Maintain current level - excellent!",
                    priority: "low",
                  },
                  {
                    category: "Entertainment",
                    current: "$200/month",
                    recommendation: "Reduce to $150/month to increase savings",
                    priority: "medium",
                  },
                  {
                    category: "Investment",
                    current: "$0/month",
                    recommendation: "Start with $500/month in index funds",
                    priority: "high",
                  },
                ],
                summary: "You're doing great! Focus on starting investments.",
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
  if (uri === "finance://dashboard") {
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

// Start the stdio server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("FinanceHub MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
