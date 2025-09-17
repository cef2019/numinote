import React from 'react';
import { formatCurrency } from './utils';

export default function BudgetSummary({ totalBudget, totalSpent }) {
  const remainingBudget = totalBudget - totalSpent;
  const percentageSpent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
      <h3 className="font-bold text-lg mb-4 text-gray-800">Budget Summary</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Total Budget</p>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalBudget)}</p>
          </div>
        </div>
        <div className="text-center">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalSpent)}</p>
          </div>
        </div>
        <div className="text-center">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Remaining</p>
            <p className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(remainingBudget)}
            </p>
          </div>
        </div>
        <div className="text-center">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">% Spent</p>
            <p className={`text-2xl font-bold ${percentageSpent > 100 ? 'text-red-600' : 'text-purple-600'}`}>
              {percentageSpent.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
        <div 
          className={`h-3 rounded-full transition-all duration-500 ${
            percentageSpent > 100 
              ? 'bg-gradient-to-r from-red-500 to-red-600' 
              : 'bg-gradient-to-r from-blue-500 to-purple-600'
          }`}
          style={{ width: `${Math.min(percentageSpent, 100)}%` }}
        ></div>
      </div>
    </div>
  );
}