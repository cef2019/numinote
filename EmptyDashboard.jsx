import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';

const EmptyDashboard = ({ organizationName }) => {
  const navigate = useNavigate();

  const handleAddTransaction = () => {
    navigate('/app/transactions');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-8 text-center"
    >
      <div className="mb-6">
        <PlusCircle className="w-16 h-16 text-gray-400 mx-auto" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome to {organizationName}!</h2>
      <p className="text-gray-600 mb-6 max-w-md">
        It looks like you haven't added any financial data yet. Let's get started by logging your first transaction or adding an account.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={handleAddTransaction} className="bg-primary hover:bg-primary/90 text-white shadow-md">
          Add Your First Transaction
        </Button>
        <Button variant="outline" onClick={() => navigate('/app/chart-of-accounts')}>
          Manage Accounts
        </Button>
      </div>
    </motion.div>
  );
};

export default EmptyDashboard;