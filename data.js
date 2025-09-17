export const initialFunds = [
  { id: 1, name: 'Unrestricted Fund', balance: '780120.50', description: 'General operational funds with no donor restrictions.' },
  { id: 2, name: 'Building Campaign Fund', balance: '250000.00', description: 'Temporarily restricted for new building construction.' },
  { id: 3, name: 'Scholarship Endowment', balance: '150309.50', description: 'Permanently restricted for annual student scholarships.' },
  { id: 4, name: 'Annual Gala Fund', balance: '70000.00', description: 'Temporarily restricted for the annual fundraising gala.' },
];

const rawAccounts = [
    { id: 1, code: '1000', name: 'Bank Accounts', type: 'Bank', balance: '550000.00', category: 'Assets', parentId: null },
    { id: 101, parentId: 1, code: '1010', name: 'Cash - Operating Account', type: 'Bank', balance: '500000.00', category: 'Assets' },
    { id: 102, parentId: 1, code: '1020', name: 'Cash - Payroll Account', type: 'Bank', balance: '50000.00', category: 'Assets' },
    { id: 3, code: '1200', name: 'Accounts Receivable', type: 'Accounts Receivable', balance: '25000.00', category: 'Assets', parentId: null },
    { id: 15, code: '1500', name: 'Fixed Assets', type: 'Fixed Asset', balance: '0.00', category: 'Assets', parentId: null },
    { id: 16, code: '1600', name: 'Accumulated Depreciation', type: 'Fixed Asset', balance: '0.00', category: 'Assets', parentId: null },
    { id: 4, code: '2010', name: 'Accounts Payable', type: 'Accounts Payable', balance: '12500.00', category: 'Liabilities', parentId: null },
    { id: 5, code: '2200', name: 'Grants Payable', type: 'Other Current Liability', balance: '7500.00', category: 'Liabilities', parentId: null },
    { id: 6, code: '3010', name: 'Unrestricted Net Assets', type: 'Equity', balance: '780120.50', category: 'Net Assets', parentId: null },
    { id: 7, code: '3200', name: 'Temporarily Restricted Net Assets', type: 'Equity', balance: '320000.00', category: 'Net Assets', parentId: null },
    { id: 8, code: '3300', name: 'Permanently Restricted Net Assets', type: 'Equity', balance: '150309.50', category: 'Net Assets', parentId: null },
    { id: 9, code: '4010', name: 'Individual Contributions', type: 'Income', balance: '150000.00', category: 'Revenue', parentId: null },
    { id: 10, code: '4200', name: 'Grant Revenue', type: 'Income', balance: '200000.00', category: 'Revenue', parentId: null },
    { id: 11, code: '5000', name: 'Personnel Expenses', type: 'Expense', balance: '120000.00', category: 'Expenses', parentId: null },
    { id: 1101, parentId: 11, code: '5010', name: 'Salaries and Wages', type: 'Expense', balance: '120000.00', category: 'Expenses' },
    { id: 12, code: '5100', name: 'Rent Expense', type: 'Expense', balance: '30000.00', category: 'Expenses', parentId: null },
    { id: 13, code: '5200', name: 'Program Supplies', type: 'Expense', balance: '15000.00', category: 'Expenses', parentId: null },
    { id: 14, code: '5300', name: 'Utilities', type: 'Expense', balance: '5000.00', category: 'Expenses', parentId: null },
    { id: 17, code: '5400', name: 'Depreciation Expense', type: 'Expense', balance: '0.00', category: 'Expenses', parentId: null },
];
export const initialAccounts = rawAccounts;

export const initialProjects = [
  {
    id: 1,
    name: 'Community Outreach Program Q3',
    manager: 'Alice Johnson',
    start_date: '2025-07-01',
    end_date: '2025-09-30',
    status: 'In Progress',
    budget: 15000,
    spent: 6500,
    team: [1, 3],
    milestones: [
      { id: 1, title: 'Launch Event', date: '2025-07-15', status: 'Completed' },
      { id: 2, title: 'Mid-term Review', date: '2025-08-15', status: 'Upcoming' },
      { id: 3, title: 'Final Report', date: '2025-09-30', status: 'Upcoming' },
    ],
    tasks: [
      { id: 101, title: 'Plan town hall meeting', status: 'Completed', dueDate: '2025-07-15', assignee: 'Bob Williams' },
      { id: 102, title: 'Design and print flyers', status: 'In Progress', dueDate: '2025-08-01', assignee: 'Charlie Brown' },
      { id: 103, title: 'Secure venue for workshop', status: 'Not Started', dueDate: '2025-08-10', assignee: 'Diana Prince' },
    ]
  },
  {
    id: 2,
    name: 'Annual Fundraising Gala 2025',
    manager: 'David Smith',
    start_date: '2025-08-15',
    end_date: '2025-11-15',
    status: 'Not Started',
    budget: 50000,
    spent: 2500,
    team: [2],
    milestones: [
      { id: 1, title: 'Venue Confirmed', date: '2025-08-30', status: 'Upcoming' },
      { id: 2, title: 'Sponsorship Target Met', date: '2025-10-15', status: 'Upcoming' },
    ],
    tasks: [
      { id: 201, title: 'Book keynote speaker', status: 'Not Started', dueDate: '2025-09-01', assignee: 'Eve Adams' },
      { id: 202, title: 'Finalize catering menu', status: 'Not Started', dueDate: '2025-09-30', assignee: 'Frank Miller' },
    ]
  },
  {
    id: 3,
    name: 'Website Redesign',
    manager: 'Grace Lee',
    start_date: '2025-06-01',
    end_date: '2025-10-01',
    status: 'Completed',
    budget: 25000,
    spent: 24500,
    team: [1, 2, 3],
    milestones: [
      { id: 1, title: 'Go-live', date: '2025-10-01', status: 'Completed' },
    ],
    tasks: [
      { id: 301, title: 'User research and personas', status: 'Completed', dueDate: '2025-06-30', assignee: 'Heidi Turner' },
      { id: 302, title: 'Wireframing and mockups', status: 'Completed', dueDate: '2025-07-31', assignee: 'Ivan Petrov' },
      { id: 303, title: 'Development and testing', status: 'Completed', dueDate: '2025-09-15', assignee: 'Judy Hopps' },
    ]
  }
];

export const initialTransactions = [
  { id: 1, date: '2025-07-05', description: 'Office Supplies Purchase', accountId: 13, accountName: 'Program Supplies', type: 'Expense', amount: 150.75, notes: 'Staples order #12345' },
  { id: 2, date: '2025-07-04', description: 'Grant Received from Foundation', accountId: 10, accountName: 'Grant Revenue', type: 'Income', amount: 10000.00, notes: 'Q3 Grant for outreach program' },
  { id: 3, date: '2025-07-03', description: 'Monthly Rent Payment', accountId: 12, accountName: 'Rent Expense', type: 'Expense', amount: 2500.00, notes: '' },
  { id: 4, date: '2025-07-01', description: 'Donation from John Doe', accountId: 9, accountName: 'Individual Contributions', type: 'Income', amount: 500.00, notes: 'Unrestricted donation' },
  { id: 5, date: '2025-06-30', description: 'Catering for Workshop', accountId: 13, accountName: 'Program Supplies', type: 'Expense', amount: 450.00, notes: 'Community workshop event' },
  { id: 6, date: '2025-07-08', description: 'Electricity Bill', accountId: 14, accountName: 'Utilities', type: 'Expense', amount: 120.00, notes: '' },
];

export const initialInvoices = [
  { id: 1, invoiceNumber: 'INV-001', customerName: 'Generous Corp', date: '2025-07-01', dueDate: '2025-07-31', amount: 5000.00, status: 'Paid' },
  { id: 2, invoiceNumber: 'INV-002', customerName: 'Helping Hands LLC', date: '2025-07-05', dueDate: '2025-08-04', amount: 2500.00, status: 'Sent' },
  { id: 3, invoiceNumber: 'INV-003', customerName: 'Community Builders', date: '2025-06-20', dueDate: '2025-07-20', amount: 7500.00, status: 'Overdue' },
];

export const initialBills = [
  { id: 1, vendorName: 'Office Supply Co.', date: '2025-07-02', dueDate: '2025-08-01', amount: 350.50, status: 'Paid' },
  { id: 2, vendorName: 'Utility Power', date: '2025-07-05', dueDate: '2025-07-25', amount: 120.75, status: 'Open' },
  { id: 3, vendorName: 'Creative Printings', date: '2025-06-15', dueDate: '2025-07-15', amount: 800.00, status: 'Open' },
];

export const initialDonations = [
  { id: 1, donorName: 'Jane Smith', date: '2025-07-06', amount: 250.00, type: 'Cash', fund: 'Unrestricted Fund' },
  { id: 2, donorName: 'John Doe', date: '2025-07-04', amount: 500.00, type: 'Check', fund: 'Unrestricted Fund' },
  { id: 3, donorName: 'Anonymous', date: '2025-07-01', amount: 1000.00, type: 'Online', fund: 'Building Campaign Fund' },
  { id: 4, donorName: 'Generous Corp', date: '2025-07-01', amount: 5000.00, type: 'Online', fund: 'Unrestricted Fund' },
  { id: 5, donorName: 'Helping Hands LLC', date: '2025-07-05', amount: 2500.00, type: 'Online', fund: 'Unrestricted Fund' },
];

export const initialJournalEntries = [
  { 
    id: 1, 
    date: '2025-07-05', 
    reference: 'JE-001',
    memo: 'Office supplies adjustment', 
    entries: [
      { account: '5200 - Program Supplies', debit: 150.00, credit: 0 },
      { account: '1010 - Cash - Operating Account', debit: 0, credit: 150.00 }
    ]
  },
  { 
    id: 2, 
    date: '2025-07-10', 
    reference: 'JE-002',
    memo: 'Prepaid rent allocation', 
    entries: [
      { account: '5100 - Rent Expense', debit: 1200.00, credit: 0 },
      { account: '1010 - Cash - Operating Account', debit: 0, credit: 1200.00 }
    ]
  },
];

export const initialEmployees = [
  { id: 1, name: 'John Doe', title: 'Project Manager', department: 'Programs', grossPay: 5000, exemptionRate: 0.15, employeePensionRate: 0.05, employerPensionRate: 0.05, otherDeductionRate: 0.02, payeRate: 0.20, otherTaxesRate: 0.01, advanceLoan: 100, projectRates: [{ projectId: 1, rate: 1.0 }] },
  { id: 2, name: 'Jane Smith', title: 'Accountant', department: 'Finance', grossPay: 4500, exemptionRate: 0.15, employeePensionRate: 0.05, employerPensionRate: 0.05, otherDeductionRate: 0.02, payeRate: 0.18, otherTaxesRate: 0.01, advanceLoan: 0, projectRates: [{ projectId: 1, rate: 0.5 }, { projectId: 3, rate: 0.5 }] },
  { id: 3, name: 'Peter Jones', title: 'HR Coordinator', department: 'Human Resources', grossPay: 4000, exemptionRate: 0.15, employeePensionRate: 0.05, employerPensionRate: 0.05, otherDeductionRate: 0.02, payeRate: 0.15, otherTaxesRate: 0.01, advanceLoan: 50, projectRates: [] },
];

export const initialInventory = [
  { id: 1, name: 'Laptops', category: 'Electronics', quantity: 15, unit_cost: 800, reorder_level: 5, last_updated: '2025-07-01', is_asset: true, purchase_date: '2024-07-01', usable_life: 3 },
  { id: 2, name: 'Office Chairs', category: 'Furniture', quantity: 30, unit_cost: 150, reorder_level: 10, last_updated: '2025-06-25', is_asset: false },
  { id: 3, name: 'First Aid Kits', category: 'Medical Supplies', quantity: 50, unit_cost: 25, reorder_level: 20, last_updated: '2025-07-05', is_asset: false },
  { id: 4, name: 'Textbooks', category: 'Educational Materials', quantity: 200, unit_cost: 45, reorder_level: 50, last_updated: '2025-07-10', is_asset: false },
];

export const initialBudgets = [
  {
    id: 1,
    name: 'Annual Operating Budget 2025',
    fiscalYear: '2025',
    lineItems: [
      { accountId: 9, accountName: 'Individual Contributions', amount: 160000 },
      { accountId: 10, accountName: 'Grant Revenue', amount: 220000 },
      { accountId: 1101, accountName: 'Salaries and Wages', amount: 130000 },
      { accountId: 12, accountName: 'Rent Expense', amount: 32000 },
      { accountId: 13, accountName: 'Program Supplies', amount: 18000 },
      { accountId: 14, accountName: 'Utilities', amount: 6000 },
    ]
  }
];

export const initialPurchaseRequests = [];
export const initialPurchaseOrders = [];

export const initialUsers = [
  {
    user_id: 'user-1',
    role: 'admin',
    permissions: {},
    profiles: {
      full_name: 'Admin User',
      email: 'admin@example.com',
    },
  },
  {
    user_id: 'user-2',
    role: 'member',
    permissions: {
      finance: 'write',
      hr: 'read',
      projects: 'write',
    },
    profiles: {
      full_name: 'Finance Manager',
      email: 'finance@example.com',
    },
  },
  {
    user_id: 'user-3',
    role: 'member',
    permissions: {
      projects: 'read',
    },
    profiles: {
      full_name: 'Project Viewer',
      email: 'viewer@example.com',
    },
  },
];

export const initialOrganizations = [
  {
    id: 'org-1',
    name: 'Hope Foundation',
  },
  {
    id: 'org-2',
    name: 'Community Builders Inc.',
  },
];

export const initialOrganizationSettings = {
  name: 'Hope Foundation',
  logo: '/logo.svg',
  email: 'contact@hopefoundation.org',
  phone: '+1-202-555-0191',
  website: 'https://hopefoundation.org',
  address: '123 Charity Lane, Washington, DC 20001',
  plan_id: 'growth',
  advanced: {
    fiscalYearStart: 'January',
    accountingMethod: 'Accrual',
    enableCategories: true,
  },
  expenses: {
    defaultPaymentTerms: 'Net 30',
    trackExpensesByProject: true,
  },
  sales: {
    defaultTerms: 'Net 30',
    defaultTitle: 'Invoice',
    defaultMemo: 'Thank you for your partnership!',
  },
};