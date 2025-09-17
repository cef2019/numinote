import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { formatCurrency, calculateSpent } from './utils';
import AccountSelector from '@/components/AccountSelector';

export default function BudgetLineItemRow({ item, index, handleLineItemChange, removeLineItem, accountOptions, transactions, projectId, lineItemsCount }) {
  const spent = calculateSpent(item.accountId, transactions, projectId);
  const budgeted = parseFloat(item.amount) || 0;
  const remaining = budgeted - spent;
  const percent = budgeted > 0 ? (spent / budgeted) * 100 : 0;
  const isOverBudget = percent > 100;

  return (
    <motion.div 
      className="border-b border-gray-100 px-4 py-4 hover:bg-gray-50 transition-colors"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-4">
          <AccountSelector
            accounts={accountOptions}
            value={item.accountId ? item.accountId : null}
            onChange={(account) => handleLineItemChange(index, 'accountId', account ? account.id : '')}
            categoryFilter={['Revenue', 'Expenses']}
            disabledParent={true}
          />
        </div>

        <div className="col-span-2">
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="number"
              placeholder="0.00"
              value={item.amount}
              onChange={(e) => handleLineItemChange(index, 'amount', e.target.value)}
              className="pl-8 text-right"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <div className="col-span-2 text-right">
          <div className="flex items-center justify-end">
            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            <span className="font-mono text-sm text-red-600">
              {formatCurrency(spent)}
            </span>
          </div>
        </div>
        
        <div className="col-span-2 text-right">
          <div className="flex items-center justify-end">
            <TrendingUp className={`w-4 h-4 mr-1 ${remaining >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            <span className={`font-mono text-sm ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(remaining)}
            </span>
          </div>
        </div>
        
        <div className="col-span-1 flex flex-col items-center">
          <div className="w-full bg-gray-200 rounded-full h-2 relative mb-1">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                isOverBudget 
                  ? 'bg-gradient-to-r from-red-500 to-red-600' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600'
              }`}
              style={{ width: `${Math.min(percent, 100)}%` }}
            ></div>
            {isOverBudget && (
              <div className="absolute top-0 right-0 w-1 h-2 bg-red-600 rounded-r-full"></div>
            )}
          </div>
          <span className={`text-xs font-medium ${isOverBudget ? 'text-red-600' : 'text-gray-600'}`}>
            {percent.toFixed(0)}%
          </span>
        </div>

        <div className="col-span-1 text-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeLineItem(index)}
            disabled={lineItemsCount <= 1}
            className="disabled:opacity-50 disabled:cursor-not-allowed h-8 w-8"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}