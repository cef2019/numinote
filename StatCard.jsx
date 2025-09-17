import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const StatCard = ({ icon: Icon, title, value, change, color, index, hasTransactions }) => {
  const showChange = hasTransactions || (title !== 'Revenue (This Month)' && title !== 'Expenses (This Month)');

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="relative overflow-hidden rounded-2xl shadow-lg border border-gray-200">
        <div className={cn("absolute inset-0 opacity-20", color)}></div>
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
            <div className={cn("p-2 rounded-full text-white", color)}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
          {showChange ? (
            <p className="text-sm text-gray-600">
              <span className={cn("font-medium", change.startsWith('+') ? 'text-green-600' : 'text-red-600')}>
                {change}
              </span>{' '}
              from last period
            </p>
          ) : (
            <p className="text-sm text-gray-600 h-5"></p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;