import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanceService, DashboardData } from '../../../../services/finance.service';

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

@Component({
  selector: 'app-chat-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-tab.component.html',
  styleUrls: ['./chat-tab.component.scss'],
})
export class ChatTabComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;
  messages: ChatMessage[] = [];
  userInput: string = '';
  isLoading: boolean = false;
  dashboardData: DashboardData | null = null;
  private shouldScrollToBottom = false;

  constructor(private financeService: FinanceService) {}

  ngOnInit(): void {
    // Load dashboard data for context
    this.financeService.getDashboardData().subscribe({
      next: (data: DashboardData) => {
        this.dashboardData = data;
      },
    });

    // Welcome message
    this.addMessage(
      'Hello! I\'m your AI financial advisor. I can help you with budgeting, savings, investments, and financial planning based on your current financial data. How can I assist you today?',
      'assistant'
    );
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.chatMessagesContainer) {
        const element = this.chatMessagesContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
      this.shouldScrollToBottom = false;
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
      this.shouldScrollToBottom = false;
    }
  }

  sendMessage(): void {
    if (!this.userInput.trim()) {
      return;
    }

    const userMessage = this.userInput.trim();
    this.addMessage(userMessage, 'user');
    this.userInput = '';
    this.isLoading = true;

    // Simulate AI response
    setTimeout(() => {
      const response = this.generateFinancialAdvice(userMessage);
      this.addMessage(response, 'assistant');
      this.isLoading = false;
    }, 1000);
  }

  private addMessage(content: string, sender: 'user' | 'assistant'): void {
    this.messages.push({
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
    });
    this.shouldScrollToBottom = true;
  }

  private generateFinancialAdvice(userMessage: string): string {
    const message = userMessage.toLowerCase();

    if (!this.dashboardData) {
      return 'I\'m still loading your financial data. Please wait a moment.';
    }

    const { totalBalance } = this.dashboardData;
    // Calculate income, expenses and savings rate from available data
    const income = this.dashboardData.monthlyIncome || 0;
    const expenses = this.dashboardData.monthlyExpense || 0;
    const monthlySavings = income - expenses;
    const savingsRate = income > 0 ? (monthlySavings / income) * 100 : 0;

    // Budget-related questions
    if (message.includes('budget') || message.includes('spending')) {
      return `Based on your data, you're earning $${income.toLocaleString()}/month and spending $${expenses.toLocaleString()}/month. Your savings rate is ${savingsRate}%. I recommend following the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings. Your current savings rate of ${savingsRate}% is ${savingsRate >= 20 ? 'excellent' : 'below the recommended 20%'}.\n\nTips to optimize your budget:\n• Track every expense for 30 days\n• Identify unnecessary subscriptions\n• Negotiate bills (insurance, phone, internet)\n• Use the envelope method for discretionary spending`;
    }

    // Savings advice
    if (message.includes('save') || message.includes('saving')) {
      const yearlyPotential = monthlySavings * 12;
      return `You're currently saving $${monthlySavings.toLocaleString()}/month, which is ${savingsRate}% of your income. At this rate, you could save $${yearlyPotential.toLocaleString()} per year. ${
        savingsRate < 20
          ? `Try to reduce expenses by $${Math.abs(income * 0.2 - monthlySavings).toFixed(0)} to reach the recommended 20% savings rate.`
          : 'Great job! Consider automating your savings to maintain this momentum.'
      }\n\nBoosting your savings:\n• Set up automatic transfers on payday\n• Use high-yield savings accounts (3-5% APY)\n• Round up purchases to nearest $5 and save difference\n• Implement a 30-day rule for big purchases`;
    }

    // Investment advice
    if (message.includes('invest') || message.includes('investment') || message.includes('stock') || message.includes('etf')) {
      return `With a total balance of $${totalBalance.toLocaleString()} and monthly savings of $${monthlySavings.toLocaleString()}, you're in a good position to start investing. I recommend:\n\n1. Build an emergency fund (3-6 months expenses = $${(expenses * 3).toLocaleString()}-$${(expenses * 6).toLocaleString()})\n2. Max out retirement accounts (401k/IRA)\n3. Consider low-cost index funds (S&P 500, Total Market)\n4. Diversify: 60% stocks, 30% bonds, 10% alternatives\n5. Dollar-cost average to reduce timing risk\n\nFor beginners: Start with target-date funds or robo-advisors like Vanguard, Fidelity, or Betterment.`;
    }

    // Debt-related
    if (message.includes('debt') || message.includes('loan') || message.includes('credit card')) {
      return `Managing debt is crucial for financial health. I recommend:\n\n1. List all debts with interest rates\n2. Pay minimums on all debts\n3. Use extra money for highest interest debt (avalanche method)\n4. Or pay smallest balance first for motivation (snowball method)\n5. Consider consolidation if you have multiple high-interest debts\n\nWith your current monthly surplus of $${monthlySavings.toLocaleString()}, you could accelerate debt payments significantly.\n\nQuick wins:\n• Call creditors to negotiate lower rates\n• Transfer high-interest CC debt to 0% APR card\n• Avoid new debt while paying off existing`;
    }

    // Emergency fund
    if (message.includes('emergency') || message.includes('fund')) {
      const monthsOfExpenses = totalBalance / expenses;
      return `Your current balance of $${totalBalance.toLocaleString()} covers ${monthsOfExpenses.toFixed(1)} months of expenses. Financial experts recommend 3-6 months. ${
        monthsOfExpenses >= 6
          ? 'You have a solid emergency fund! Consider investing surplus funds.'
          : `You should aim to save $${(expenses * 6).toLocaleString()} total. You need about $${((expenses * 6) - totalBalance).toLocaleString()} more to reach 6 months.`
      }\n\nBuilding your emergency fund:\n• Keep it in a separate high-yield savings account\n• Don't invest emergency funds in stocks\n• Replenish immediately after use\n• Consider a tiered approach: $1K → 1 month → 3 months → 6 months`;
    }

    // Retirement
    if (message.includes('retire') || message.includes('retirement') || message.includes('401k') || message.includes('ira')) {
      return `Retirement planning is essential! Based on your income:\n\n1. Contribute enough to get employer 401k match (free money!)\n2. Aim to save 15-20% of gross income for retirement\n3. Max out: 401k ($23,000/year) + IRA ($7,000/year)\n4. Consider Roth IRA for tax-free growth\n5. Target: 25x your annual expenses saved by retirement\n\nYour current savings rate of ${savingsRate}% ${savingsRate >= 15 ? 'is on track!' : 'should be increased to at least 15% for comfortable retirement.'}\n\nRule of 72: Your money doubles every 72/rate years (at 8% = 9 years)`;
    }

    // Tax planning
    if (message.includes('tax') || message.includes('deduction') || message.includes('write off')) {
      return `Smart tax planning can save you thousands! Here's what to consider:\n\n1. Max out pre-tax retirement contributions (reduces taxable income)\n2. Contribute to HSA if eligible (triple tax advantage)\n3. Take advantage of tax-loss harvesting\n4. Consider 529 plans for education savings\n5. Track deductible expenses: home office, business expenses, charitable donations\n\nWith $${income.toLocaleString()}/month income, you could save significant taxes by maxing out retirement accounts. Consult a CPA for personalized strategies!`;
    }

    // Home buying
    if (message.includes('house') || message.includes('home') || message.includes('mortgage') || message.includes('buy')) {
      const maxHousePrice = income * 12 * 3; // 3x annual income rule
      const downPayment = maxHousePrice * 0.2;
      return `Thinking about buying a home? Here's what you need to know:\n\n• Affordable home price: ~$${maxHousePrice.toLocaleString()} (3x annual income)\n• Target down payment (20%): $${downPayment.toLocaleString()}\n• Monthly payment should be <28% of gross income = $${(income * 0.28).toFixed(0)}\n\nYour current savings: $${totalBalance.toLocaleString()}\nYou're ${totalBalance >= downPayment ? 'ready' : ((downPayment - totalBalance) / monthlySavings).toFixed(0) + ' months away from 20% down'}\n\nDon't forget:\n• Closing costs (2-5% of price)\n• HOA fees, property taxes, insurance\n• Maintenance (1% of home value/year)`;
    }

    // Credit score
    if (message.includes('credit score') || message.includes('credit report')) {
      return `Your credit score affects loan rates, insurance premiums, and more!\n\nBuilding excellent credit (750+):\n1. Pay all bills on time (35% of score)\n2. Keep credit utilization under 30%, ideally under 10%\n3. Don't close old credit cards (age matters)\n4. Mix of credit types (cards, loans)\n5. Limit hard inquiries (new applications)\n\nFree credit monitoring:\n• AnnualCreditReport.com (official free reports)\n• Credit Karma, Credit Sesame (free scores)\n• Many credit cards offer free FICO scores\n\nCheck for errors quarterly and dispute any inaccuracies!`;
    }

    // Side hustle / extra income
    if (message.includes('side hustle') || message.includes('extra income') || message.includes('make more')) {
      return `Want to boost your income? Here are proven strategies:\n\n💼 Skilled Services:\n• Freelancing (writing, design, coding)\n• Consulting in your expertise\n• Online tutoring or coaching\n\n🚗 Gig Economy:\n• Rideshare (Uber, Lyft)\n• Delivery (DoorDash, Instacart)\n• Task services (TaskRabbit)\n\n💻 Passive Income:\n• Rent out property/room (Airbnb)\n• Create digital products\n• Dividend-paying investments\n\nWith your current budget, an extra $500-1000/month could increase your savings rate from ${savingsRate}% to ${((monthlySavings + 750) / (income + 750) * 100).toFixed(0)}%!`;
    }

    // Insurance
    if (message.includes('insurance') || message.includes('life insurance') || message.includes('disability')) {
      return `Insurance is crucial for protecting your wealth!\n\n✅ Essential Coverage:\n• Health insurance (non-negotiable)\n• Term life insurance: 10-12x annual income if you have dependents\n• Disability insurance: 60-70% income replacement\n• Auto insurance (required by law)\n• Renter's/homeowner's insurance\n\n❌ Usually Skip:\n• Whole/universal life (invest difference instead)\n• Credit card insurance\n• Extended warranties on most items\n\nWith $${income.toLocaleString()}/month income, budget ~$${(income * 0.1).toFixed(0)} for insurance. Shop around annually to get best rates!`;
    }

    // Financial goals
    if (message.includes('goal') || message.includes('plan') || message.includes('strategy')) {
      return `Let's create a comprehensive financial strategy based on your data:\n\n📊 Your Numbers:\n• Income: $${income.toLocaleString()}/month\n• Expenses: $${expenses.toLocaleString()}/month\n• Savings: $${monthlySavings.toLocaleString()}/month (${savingsRate}%)\n• Balance: $${totalBalance.toLocaleString()}\n\n🎯 Recommended Priority:\n1. Emergency fund ($${(expenses * 6).toLocaleString()})\n2. Pay off high-interest debt (>7% APR)\n3. Max employer 401k match\n4. Pay off remaining debt\n5. Max out retirement accounts\n6. Save for major goals (house, education)\n7. Invest in taxable accounts\n\nWant to dive deeper into any specific goal?`;
    }

    // Cryptocurrency
    if (message.includes('crypto') || message.includes('bitcoin') || message.includes('ethereum')) {
      return `Cryptocurrency can be part of a diversified portfolio, but approach with caution:\n\n⚠️ Key Principles:\n• Only invest what you can afford to lose completely\n• Crypto should be <5-10% of total portfolio\n• Focus on established coins (BTC, ETH)\n• Avoid FOMO and get-rich-quick schemes\n• Use secure exchanges and cold storage\n\n✅ Getting Started:\n• Research thoroughly before investing\n• Dollar-cost average instead of lump sum\n• Never share private keys\n• Understand tax implications\n\nWith your $${totalBalance.toLocaleString()} balance, a 5% allocation would be $${(totalBalance * 0.05).toLocaleString()}. Make sure emergency fund and retirement are funded first!`;
    }

    // Financial education
    if (message.includes('learn') || message.includes('book') || message.includes('educate') || message.includes('course')) {
      return `Knowledge is power! Here are top resources:\n\n📚 Must-Read Books:\n• "The Simple Path to Wealth" - JL Collins\n• "Your Money or Your Life" - Vicki Robin\n• "The Psychology of Money" - Morgan Housel\n• "I Will Teach You to Be Rich" - Ramit Sethi\n\n🎓 Free Learning:\n• r/personalfinance wiki (comprehensive)\n• Khan Academy (investing basics)\n• Bogleheads forum (index investing)\n• The Money Guy Show (YouTube)\n\n📱 Tools:\n• Mint/YNAB (budgeting)\n• Personal Capital (net worth tracking)\n• Vanguard/Fidelity (investing)\n\nInvesting 1 hour/week in financial education could transform your life!`;
    }

    // Default response
    return `Thank you for your question! I can help you with:\n\n💰 Financial Topics:\n• Budgeting and expense tracking\n• Savings strategies and emergency funds\n• Investment planning (stocks, ETFs, index funds)\n• Debt management and payoff strategies\n• Retirement planning (401k, IRA, Roth)\n• Tax optimization strategies\n• Home buying and mortgage planning\n• Credit score improvement\n• Side hustles and extra income\n• Insurance coverage\n• Cryptocurrency basics\n• Financial education resources\n\n📊 Your Current Snapshot:\n• Total Balance: $${totalBalance.toLocaleString()}\n• Monthly Income: $${income.toLocaleString()}\n• Monthly Expenses: $${expenses.toLocaleString()}\n• Savings Rate: ${savingsRate}%\n\nWhat would you like to explore?`;
  }

  formatTime(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(date));
  }
}

