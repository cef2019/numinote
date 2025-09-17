import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Landmark, TrendingUp, TrendingDown, FileInput, FileOutput, HeartHandshake, BookOpen, BarChart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate, useOutletContext } from 'react-router-dom';

import StatCard from './StatCard';
import QuickActionButton from './QuickActionButton';
import EmptyDashboard from './EmptyDashboard';
import LoadingDashboard from './LoadingDashboard';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const calculatePercentageChange = (current, previous) => {
    if (previous === 0 && current === 0) {
        return '0.0%';
    }
    if (previous === 0) {
        return current > 0 ? '+100.0%' : '0.0%';
    }
    const change = ((current - previous) / previous) * 100;
    return (change >= 0 ? '+' : '') + change.toFixed(1) + '%';
};

export default function Dashboard() {
  const { allData, organizationSettings, loadingData } = useOutletContext();
  const navigate = useNavigate();

  const { accounts, funds, transactions } = allData || {};

  const {
    totalNetAssets,
    unrestrictedFunds,
    totalRevenue,
    totalExpenses,
    prevRevenue,
    prevExpenses,
    hasTransactions
  } = useMemo(() => {
    const today = new Date();
    const currentPeriodStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const previousPeriodStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const previousPeriodEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    const currentTransactions = (transactions || []).filter(t => new Date(t.date) >= currentPeriodStart);
    const previousTransactions = (transactions || []).filter(t => {
      const tDate = new Date(t.date);
      return tDate >= previousPeriodStart && tDate <= previousPeriodEnd;
    });

    return {
      totalNetAssets: (accounts || []).filter((a) => a.category === 'Net Assets').reduce((sum, acc) => sum + parseFloat(acc.balance || 0), 0),
      unrestrictedFunds: (funds || []).filter((f) => f.name.toLowerCase().includes('unrestricted')).reduce((sum, fund) => sum + parseFloat(fund.balance || 0), 0),
      totalRevenue: currentTransactions.filter((t) => t.type === 'Income').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0),
      totalExpenses: currentTransactions.filter((t) => t.type === 'Expense').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0),
      prevRevenue: previousTransactions.filter((t) => t.type === 'Income').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0),
      prevExpenses: previousTransactions.filter((t) => t.type === 'Expense').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0),
      hasTransactions: (transactions || []).length > 0,
    };
  }, [accounts, funds, transactions]);

  if (loadingData || !organizationSettings || !allData) {
    return <LoadingDashboard />;
  }
  
  const hasData =
    (funds && funds.length > 0) || (accounts && accounts.length > 0) || (transactions && transactions.length > 0);

  const stats = [
    { icon: DollarSign, title: 'Total Net Assets', value: formatCurrency(totalNetAssets), change: '+2.5%', color: 'bg-green-500' },
    { icon: Landmark, title: 'Unrestricted Funds', value: formatCurrency(unrestrictedFunds), change: '+1.8%', color: 'bg-emerald-500' },
    { icon: TrendingUp, title: 'Revenue (This Month)', value: formatCurrency(totalRevenue), change: calculatePercentageChange(totalRevenue, prevRevenue), color: 'bg-teal-500' },
    { icon: TrendingDown, title: 'Expenses (This Month)', value: formatCurrency(totalExpenses), change: calculatePercentageChange(totalExpenses, prevExpenses), color: 'bg-orange-500' },
  ];

  const orgName = organizationSettings?.name || 'Your Organization';

  const quickActions = [
    { icon: FileInput, label: 'Create Invoice', path: '/app/finance/invoices' },
    { icon: FileOutput, label: 'Record a Bill', path: '/app/finance/bills' },
    { icon: HeartHandshake, label: 'Log Donation', path: '/app/finance/donations' },
    { icon: BookOpen, label: 'Journal Entry', path: '/app/finance/journal-entries' },
  ];

  return (
    <div className="p-4 md:p-0">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start mb-8"
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <img
              src={organizationSettings?.logo || '/logo.svg'}
              alt={orgName ? `${orgName} logo` : 'Organization logo'}
              className="w-10 h-10 rounded-lg object-contain bg-white p-1 border"
            />
            <h1 className="text-3xl font-bold text-gray-800">{orgName}</h1>
          </div>
          <p className="text-gray-500">Here's what's happening with your organization today.</p>
        </div>
      </motion.div>

      {!hasData ? (
        <Card>
          <CardContent className="p-0">
            <EmptyDashboard organizationName={orgName} />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} index={index} hasTransactions={hasTransactions} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Cash Flow</h2>
                <Button variant="outline" size="sm" onClick={() => navigate('/app/reports')}>
                  View Report
                </Button>
              </div>
              <div className="h-80 flex items-center justify-center bg-gray-100 rounded-lg">
                <BarChart className="w-16 h-16 text-gray-300" />
                <p className="text-gray-500 ml-4">Cash Flow Chart Coming Soon</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {quickActions.map((action) => (
                  <QuickActionButton key={action.path} {...action} />
                ))}
                <Button
                  variant="ghost"
                  className="w-full justify-start text-primary"
                  onClick={() => navigate('/app/transactions')}
                >
                  <ArrowRight className="w-4 h-4 mr-2" /> View All Transactions
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}