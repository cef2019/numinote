import React, { useMemo, useState } from "react";
import {
  CommandDialog,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { FileText, Landmark, ArrowRightLeft, GanttChartSquare, BarChart2, Wallet, Building2, Users, Coins as HandCoins, FileBox, Receipt, KeyRound as UserRound, Package,  } from 'lucide-react';
import { useNavigate } from "react-router-dom";

// List of reports
const reportList = [
  { title: "Statement of Activities", path: "/app/reports/activities" },
  { title: "Statement of Financial Position", path: "/app/reports/position" },
  { title: "Statement of Cash Flows", path: "/app/reports/cashflows" },
  { title: "Budget vs. Actuals", path: "/app/reports/budget-vs-actuals" },
  { title: "Donor Analysis", path: "/app/reports/donors" },
  { title: "Fund Balance Report", path: "/app/reports/fund-balance" },
  { title: "Inventory Valuation", path: "/app/reports/inventory" },
  { title: "Program Expense Analysis", path: "/app/reports/program-expenses" },
  { title: "Taxes Report", path: "/app/reports/taxes" },
];

// Helper function to highlight matching text
function highlightMatch(text, query) {
  if (!query) return text;
  const safeText = String(text || '');
  const regex = new RegExp(`(${query})`, "gi");
  const parts = safeText.split(regex);
  return parts.map((part, index) =>
    regex.test(part) ? (
      <span key={index} className="bg-yellow-200 dark:bg-yellow-600 font-semibold">
        {part}
      </span>
    ) : (
      part
    )
  );
}

export default function GlobalSearch({ open, setOpen, allData }) {
  const navigate = useNavigate();
  const {
    projects = [],
    transactions = [],
    accounts = [],
    funds = [],
    bills = [],
    invoices = [],
    donations = [],
    employees = [],
    inventory = [],
  } = allData || {};
  const [query, setQuery] = useState("");

  const allItems = useMemo(() => {
    const searchItems = [];

    // Main Navigation
    searchItems.push({
      group: "Navigation",
      items: [
        { title: "Dashboard", path: "/app/dashboard", icon: Building2 },
        { title: "Chart of Accounts", path: "/app/chart-of-accounts", icon: Landmark },
        { title: "Transactions", path: "/app/transactions", icon: ArrowRightLeft },
        { title: "Funds", path: "/app/funds", icon: HandCoins },
        { title: "Projects", path: "/app/projects", icon: GanttChartSquare },
        { title: "Budgeting", path: "/app/finance/budgeting", icon: FileText },
        { title: "Reports", path: "/app/reports", icon: BarChart2 },
        { title: "Employees", path: "/app/hr/employees", icon: Users },
      ],
    });

    // Reports
    searchItems.push({
      group: "Reports",
      items: reportList.map((r) => ({
        title: r.title,
        path: r.path,
        icon: BarChart2,
      })),
    });
    
    // Dynamic Data
    if (accounts.length > 0) searchItems.push({ group: "Accounts", items: accounts.map(a => ({ title: `${a.code} - ${a.name}`, path: "/app/chart-of-accounts", icon: Wallet })) });
    if (projects.length > 0) searchItems.push({ group: "Projects", items: projects.map(p => ({ title: p.name, path: `/app/projects/${p.id}`, icon: GanttChartSquare })) });
    if (funds.length > 0) searchItems.push({ group: "Funds", items: funds.map(f => ({ title: f.name, path: "/app/funds", icon: HandCoins })) });
    if (bills.length > 0) searchItems.push({ group: "Bills", items: bills.slice(0, 5).map(b => ({ title: `Bill from ${b.vendor_name}`, path: "/app/finance/bills", icon: Receipt })) });
    if (invoices.length > 0) searchItems.push({ group: "Invoices", items: invoices.slice(0, 5).map(i => ({ title: `Invoice to ${i.customer_name}`, path: "/app/finance/invoices", icon: FileBox })) });
    if (donations.length > 0) searchItems.push({ group: "Donations", items: donations.slice(0, 5).map(d => ({ title: `Donation from ${d.donor_name}`, path: "/app/finance/donations", icon: HandCoins })) });
    if (employees.length > 0) searchItems.push({ group: "Employees", items: employees.map(e => ({ title: e.name, path: "/app/hr/employees", icon: UserRound })) });
    if (inventory.length > 0) searchItems.push({ group: "Inventory", items: inventory.map(i => ({ title: i.name, path: "/app/supply-chain/inventory", icon: Package })) });
    if (transactions.length > 0) searchItems.push({ group: "Recent Transactions", items: transactions.slice(0, 5).map(tx => ({ title: `${tx.description} – $${tx.amount != null ? Number(tx.amount).toFixed(2) : "0.00"}`, path: "/app/transactions", icon: Wallet })) });

    return searchItems;
  }, [accounts, projects, funds, bills, invoices, donations, employees, inventory, transactions]);


  // Filter items based on query
  const filteredItems = useMemo(() => {
    if (!query) return allItems;

    return allItems
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          String(item.title).toLowerCase().includes(query.toLowerCase())
        ),
      }))
      .filter(group => group.items.length > 0);
  }, [allItems, query]);
  

  const handleSelect = (path) => {
    navigate(path);
    setOpen(false);
    setQuery(""); // Clear query when closing
  };

  return (
    <CommandDialog open={open} onOpenChange={(isOpen) => { setOpen(isOpen); if (!isOpen) setQuery(''); }}>
      <Command>
        <CommandInput
          placeholder="Type a command or search..."
          value={query}
          onValueChange={(value) => setQuery(value)}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {filteredItems.map(
            (group) =>
              group.items.length > 0 && (
                <CommandGroup key={group.group} heading={group.group}>
                  {group.items.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <CommandItem
                        key={`${group.group}-${item.title}-${index}`}
                        onSelect={() => handleSelect(item.path)}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        <span>{highlightMatch(item.title, query)}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}