import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Landmark, List, BarChart2, HeartHandshake, Settings,
  Briefcase, Users, DollarSign, ShoppingCart, Truck, Package, ChevronDown,
  LayoutGrid, ClipboardList, GanttChartSquare, ArrowRightLeft, FileText, Receipt, BookOpen, Banknote, ClipboardCheck, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

const navLinks = [
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { 
    label: 'Finance',
    icon: Landmark,
    basePath: '/app/finance',
    subLinks: [
      { to: '/app/funds', icon: Landmark, label: 'Fund Accounting' },
      { to: '/app/accounts', icon: List, label: 'Chart of Accounts' },
      { to: '/app/transactions', icon: ArrowRightLeft, label: 'Transactions' },
      { to: '/app/finance/budgeting', icon: Banknote, label: 'Budget' },
      { to: '/app/finance/invoices', icon: FileText, label: 'Invoices' },
      { to: '/app/finance/bills', icon: Receipt, label: 'Bills' },
      { to: '/app/finance/donations', icon: HeartHandshake, label: 'Donations' },
      { to: '/app/finance/journal-entries', icon: BookOpen, label: 'Journal Entry' },
      { to: '/app/finance/reconciliation', icon: ClipboardCheck, label: 'Bank Reconciliation' },
    ]
  },
  { to: '/app/reports', icon: BarChart2, label: 'Reports' },
  { 
    label: 'Projects',
    icon: Briefcase,
    basePath: '/app/projects',
    subLinks: [
      { to: '/app/projects/overview', icon: LayoutGrid, label: 'Overview' },
      { to: '/app/projects/tasks', icon: ClipboardList, label: 'Tasks' },
      { to: '/app/projects/gantt', icon: GanttChartSquare, label: 'Gantt Chart' },
    ]
  },
  { 
    label: 'Human Resources',
    icon: Users,
    basePath: '/app/hr',
    subLinks: [
      { to: '/app/hr/employees', icon: Users, label: 'Employees' },
      { to: '/app/hr/payroll', icon: DollarSign, label: 'Payroll' },
    ]
  },
  { 
    label: 'Supply Chain',
    icon: Truck,
    basePath: '/app/supply-chain',
    subLinks: [
      { to: '/app/supply-chain/purchase-requests', icon: ShoppingCart, label: 'Purchase Requests' },
      { to: '/app/supply-chain/purchase-orders', icon: Truck, label: 'Purchase Orders' },
      { to: '/app/supply-chain/inventory', icon: Package, label: 'Inventory' },
    ]
  },
];

const NavItem = ({ item, setSidebarOpen }) => {
  const location = useLocation();
  const isParentActive = item.basePath && location.pathname.startsWith(item.basePath);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(isParentActive);
  
  useEffect(() => {
    if (isParentActive) {
      setIsSubMenuOpen(true);
    }
  }, [location.pathname, isParentActive]);

  const closeSidebar = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  if (item.subLinks) {
    return (
      <div>
        <button
          onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
          className={cn(
            'flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors duration-200',
            isParentActive ? 'text-primary-foreground bg-green-600' : 'text-gray-600 hover:bg-green-100 hover:text-green-700'
          )}
        >
          <div className="flex items-center">
            <item.icon className="w-5 h-5 mr-3" />
            <span className="font-medium">{item.label}</span>
          </div>
          <ChevronDown className={cn('w-5 h-5 transition-transform', isSubMenuOpen ? 'rotate-180' : '')} />
        </button>
        <AnimatePresence>
        {isSubMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="pl-8 pt-2 space-y-2 overflow-hidden"
          >
            {item.subLinks.map(subItem => <NavItem key={subItem.to} item={subItem} setSidebarOpen={setSidebarOpen} />)}
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <NavLink
      to={item.to}
      onClick={closeSidebar}
      end={item.to === '/app/projects'}
      className={({ isActive }) =>
        cn(
          'flex items-center px-4 py-3 rounded-lg transition-colors duration-200',
          isActive
            ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md'
            : 'text-gray-600 hover:bg-green-100 hover:text-green-700'
        )
      }
    >
      <item.icon className="w-5 h-5 mr-3" />
      <span className="font-medium">{item.label}</span>
    </NavLink>
  );
};

const SidebarContent = ({ setSidebarOpen }) => (
  <>
    <div className="flex items-center justify-between h-20 border-b border-gray-200 px-4">
      <Link to="/app/dashboard" className="flex items-center space-x-2" onClick={() => setSidebarOpen(false)}>
        <img src="/logo.svg" alt="Numinote Logo" className="w-8 h-8" />
        <span className="text-xl font-bold gradient-text">Numinote</span>
      </Link>
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
        <X className="h-6 w-6" />
      </Button>
    </div>
    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
      {navLinks.map((item, index) => (
        <NavItem key={item.to || index} item={item} setSidebarOpen={setSidebarOpen} />
      ))}
    </nav>
    <div className="px-4 py-6 border-t border-gray-200 space-y-2">
      <NavItem item={{ to: '/app/settings', icon: Settings, label: 'Settings' }} setSidebarOpen={setSidebarOpen} />
    </div>
  </>
);

export default function Sidebar({ isSidebarOpen, setSidebarOpen }) {
  return (
    <>
      <div className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-gray-200">
        <SidebarContent setSidebarOpen={setSidebarOpen} />
      </div>
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-64 bg-white z-50 flex flex-col lg:hidden"
            >
              <SidebarContent setSidebarOpen={setSidebarOpen} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}