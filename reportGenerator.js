import { format, parseISO } from 'date-fns';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount || 0);
};

const filterByDateRange = (items, dateRange, dateKey = 'date') => {
  if (!items) return [];
  const from = dateRange?.from ? new Date(dateRange.from).setHours(0, 0, 0, 0) : null;
  const to = dateRange?.to ? new Date(dateRange.to).setHours(23, 59, 59, 999) : null;

  return items.filter(item => {
    if (!item[dateKey]) return false;
    const itemDate = new Date(item[dateKey]);
    if (from && itemDate < from) return false;
    if (to && itemDate > to) return false;
    return true;
  });
};

const generateBalanceSheet = (data) => {
  const { accounts, transactions, dateRange } = data;
  const endDate = dateRange.to || new Date();
  
  const accountBalances = {};
  accounts.forEach(acc => accountBalances[acc.id] = 0);

  transactions.forEach(t => {
      if (new Date(t.date) <= endDate) {
          if (accountBalances[t.account_id] !== undefined) {
              const amount = parseFloat(t.amount);
              if (t.type === 'debit' || t.type === 'expense' || t.type === 'payment') {
                  accountBalances[t.account_id] += amount;
              } else {
                  accountBalances[t.account_id] -= amount;
              }
          }
      }
  });

  const assets = accounts.filter(a => a.category === 'Assets');
  const liabilities = accounts.filter(a => a.category === 'Liabilities');
  const equity = accounts.filter(a => a.category === 'Equity');

  let totalAssets = 0;
  const assetsBody = assets.map(a => {
      const balance = accountBalances[a.id] || 0;
      totalAssets += balance;
      return [a.name, formatCurrency(balance)];
  });

  let totalLiabilities = 0;
  const liabilitiesBody = liabilities.map(l => {
      const balance = accountBalances[l.id] || 0;
      totalLiabilities += balance;
      return [l.name, formatCurrency(balance)];
  });

  let totalEquity = 0;
  const equityBody = equity.map(e => {
      const balance = accountBalances[e.id] || 0;
      totalEquity += balance;
      return [e.name, formatCurrency(balance)];
  });

  const body = [
      ['ASSETS', ''],
      ...assetsBody,
      ['Total Assets', formatCurrency(totalAssets)],
      ['', ''],
      ['LIABILITIES', ''],
      ...liabilitiesBody,
      ['Total Liabilities', formatCurrency(totalLiabilities)],
      ['', ''],
      ['EQUITY', ''],
      ...equityBody,
      ['Total Equity', formatCurrency(totalEquity)],
      ['', ''],
      ['TOTAL LIABILITIES & EQUITY', formatCurrency(totalLiabilities + totalEquity)]
  ];

  return {
      title: 'Balance Sheet',
      columns: ['Account', 'Amount'],
      body,
      foot: null,
      isProjectSpecific: true
  };
};

const generateIncomeStatement = (data) => {
    const { accounts, transactions, dateRange } = data;
    const filteredTransactions = filterByDateRange(transactions, dateRange);

    const revenueAccounts = accounts.filter(a => a.category === 'Revenue');
    const expenseAccounts = accounts.filter(a => a.category === 'Expenses');

    let totalRevenue = 0;
    const revenueBody = revenueAccounts.map(acc => {
        const amount = filteredTransactions
            .filter(t => t.account_id === acc.id)
            .reduce((sum, t) => sum + (t.type === 'credit' || t.type === 'revenue' || t.type === 'donation' ? parseFloat(t.amount) : 0), 0);
        totalRevenue += amount;
        return [acc.name, formatCurrency(amount)];
    });

    let totalExpenses = 0;
    const expensesBody = expenseAccounts.map(acc => {
        const amount = filteredTransactions
            .filter(t => t.account_id === acc.id)
            .reduce((sum, t) => sum + (t.type === 'debit' || t.type === 'expense' ? parseFloat(t.amount) : 0), 0);
        totalExpenses += amount;
        return [acc.name, formatCurrency(amount)];
    });
    
    const netIncome = totalRevenue - totalExpenses;

    const body = [
        ['INCOME', ''],
        ...revenueBody,
        ['Total Income', formatCurrency(totalRevenue)],
        ['', ''],
        ['EXPENSES', ''],
        ...expensesBody,
        ['Total Expenses', formatCurrency(totalExpenses)],
    ];
    
    return {
        title: 'Income Statement',
        columns: ['Account', 'Amount'],
        body,
        foot: ['Net Income', formatCurrency(netIncome)],
        isProjectSpecific: true
    };
};

const generateCashFlowStatement = (data) => {
    const { accounts, transactions, dateRange } = data;
    const filteredTransactions = filterByDateRange(transactions, dateRange);

    const cashAccounts = accounts.filter(a => a.type === 'Cash').map(a => a.id);

    const operating = filteredTransactions.filter(t => accounts.find(a => a.id === t.account_id && ['Revenue', 'Expenses'].includes(a.category)));
    const investing = filteredTransactions.filter(t => accounts.find(a => a.id === t.account_id && ['Assets'].includes(a.category) && a.type !== 'Cash'));
    const financing = filteredTransactions.filter(t => accounts.find(a => a.id === t.account_id && ['Liabilities', 'Equity'].includes(a.category)));

    const getFlow = (txs) => txs.reduce((sum, t) => {
        const acc = accounts.find(a => a.id === t.account_id);
        if (!acc) return sum;
        const amount = parseFloat(t.amount);
        if (['Revenue', 'credit'].includes(t.type) || acc.category === 'Liabilities' || acc.category === 'Equity') return sum + amount;
        return sum - amount;
    }, 0);

    const operatingFlow = getFlow(operating);
    const investingFlow = getFlow(investing);
    const financingFlow = getFlow(financing);
    const netCashFlow = operatingFlow + investingFlow + financingFlow;
    
    const body = [
        ['Cash Flow from Operating Activities', formatCurrency(operatingFlow)],
        ['Cash Flow from Investing Activities', formatCurrency(investingFlow)],
        ['Cash Flow from Financing Activities', formatCurrency(financingFlow)],
    ];
    
    return {
        title: 'Statement of Cash Flows',
        columns: ['Activity', 'Amount'],
        body,
        foot: ['Net Cash Flow', formatCurrency(netCashFlow)],
        isProjectSpecific: true
    };
};

const generateFundBalanceReport = (data) => {
    const { funds, transactions, dateRange } = data;
    const filteredTransactions = filterByDateRange(transactions, dateRange, 'date');
    const body = funds.map(fund => {
        const balance = filteredTransactions
            .filter(t => t.fund_id === fund.id)
            .reduce((sum, t) => sum + (['revenue', 'donation', 'credit'].includes(t.type) ? parseFloat(t.amount) : -parseFloat(t.amount)), fund.balance);
        return [fund.name, fund.description || 'N/A', formatCurrency(balance)];
    });
    const totalBalance = body.reduce((sum, row) => sum + parseFloat(row[2].replace(/[^0-9.-]+/g,"")), 0);
    
    return {
        title: 'Fund Balance Report',
        columns: ['Fund Name', 'Description', 'Balance'],
        body,
        foot: ['Total', '', formatCurrency(totalBalance)],
        isProjectSpecific: true
    };
};

const generateProjectSummary = (data) => {
    const { projects, transactions, dateRange, selectedProjectId } = data;
    let projectsToReport = projects;
    if (selectedProjectId !== 'all') {
        projectsToReport = projects.filter(p => p.id === selectedProjectId);
    }
    const filteredTransactions = filterByDateRange(transactions, dateRange);

    const body = projectsToReport.map(project => {
        const projectTransactions = filteredTransactions.filter(t => t.project_id === project.id);
        const revenue = projectTransactions.filter(t => ['revenue', 'donation'].includes(t.type)).reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const expenses = projectTransactions.filter(t => ['expense', 'payment'].includes(t.type)).reduce((sum, t) => sum + parseFloat(t.amount), 0);
        return [
            project.name,
            project.status,
            formatCurrency(project.budget),
            formatCurrency(expenses),
            formatCurrency(revenue),
            formatCurrency(revenue - expenses)
        ];
    });

    return {
        title: 'Project Summary Report',
        columns: ['Project Name', 'Status', 'Budget', 'Expenses', 'Revenue', 'Net'],
        body,
        foot: null,
        isProjectSpecific: true
    };
};


const generateBudgetVsActual = (data) => {
    const { budgets, accounts, transactions, dateRange, selectedBudgetId } = data;
    if (selectedBudgetId === 'all' || !budgets.length) return {
        title: 'Budget vs. Actuals',
        columns: ['Account', 'Budgeted', 'Actual', 'Variance'],
        body: [['Please select a specific budget to generate this report.']],
        foot: null,
        isProjectSpecific: true,
    };
    
    const budget = budgets.find(b => b.id === selectedBudgetId);
    if (!budget || !budget.budget_line_items) return {
        title: 'Budget vs. Actuals',
        columns: ['Account', 'Budgeted', 'Actual', 'Variance'],
        body: [['Selected budget has no line items.']],
        foot: null,
        isProjectSpecific: true,
    };

    const filteredTransactions = filterByDateRange(transactions, dateRange);
    let totalBudget = 0, totalActual = 0, totalVariance = 0;

    const body = budget.budget_line_items.map(item => {
        const account = accounts.find(a => a.id === item.account_id);
        const actual = filteredTransactions
            .filter(t => t.account_id === item.account_id)
            .reduce((sum, t) => sum + (t.type === 'debit' || t.type === 'expense' ? parseFloat(t.amount) : -parseFloat(t.amount)), 0);
        const budgeted = parseFloat(item.amount);
        const variance = budgeted - actual;
        totalBudget += budgeted;
        totalActual += actual;
        totalVariance += variance;
        return [
            account ? `${account.name} (${account.code})` : 'N/A',
            formatCurrency(budgeted),
            formatCurrency(actual),
            formatCurrency(variance)
        ];
    });

    return {
        title: `Budget vs. Actuals: ${budget.name}`,
        columns: ['Account', 'Budgeted', 'Actual', 'Variance'],
        body,
        foot: ['Totals', formatCurrency(totalBudget), formatCurrency(totalActual), formatCurrency(totalVariance)],
        isProjectSpecific: true,
    };
};


export const reportGenerators = {
  'balance-sheet': generateBalanceSheet,
  'income-statement': generateIncomeStatement,
  'cash-flow': generateCashFlowStatement,
  'fund-balance': generateFundBalanceReport,
  'project-summary': generateProjectSummary,
  'budget-vs-actual': generateBudgetVsActual,
};