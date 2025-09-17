import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import BudgetLineItemRow from './BudgetLineItemRow';
import AccountSelector from '@/components/AccountSelector';

export default function BudgetLineItems({ formData, handleLineItemChange, addLineItem, removeLineItem, accountOptions, transactions, projectId }) {
  return (
    <div className="flex-grow overflow-hidden flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Budget Line Items</h3>
        <p className="text-sm text-gray-500">Add accounts and their budgeted amounts. You can see actual spending and remaining budget for each line.</p>
      </div>

      <div className="bg-gray-50 rounded-t-lg border border-gray-200 px-4 py-3">
        <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
          <div className="col-span-4">Account</div>
          <div className="col-span-2 text-right">Budgeted Amount</div>
          <div className="col-span-2 text-right">Spent</div>
          <div className="col-span-2 text-right">Remaining</div>
          <div className="col-span-1 text-center">% Used</div>
          <div className="col-span-1 text-center">Actions</div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto border-l border-r border-gray-200 bg-white">
        <AnimatePresence>
          {formData.lineItems.map((item, index) => (
            <BudgetLineItemRow
              key={index}
              item={item}
              index={index}
              handleLineItemChange={handleLineItemChange}
              removeLineItem={removeLineItem}
              accountOptions={accountOptions}
              transactions={transactions}
              projectId={projectId}
              lineItemsCount={formData.lineItems.length}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="border border-gray-200 rounded-b-lg bg-gray-50 px-4 py-3">
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addLineItem}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> 
          Add Budget Line
        </Button>
      </div>
    </div>
  );
}