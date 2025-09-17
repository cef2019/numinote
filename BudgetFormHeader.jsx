import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Copy } from 'lucide-react';

export default function BudgetFormHeader({ budget, onCancel }) {
  return (
    <div className="flex justify-between items-center mb-6 pb-4 border-b">
      <div className="flex items-center gap-4">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-lg">
          <Copy className="text-white w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{budget ? 'Edit Budget' : 'Create New Budget'}</h2>
          <p className="text-sm text-gray-500">Set up your budget with detailed line items and track spending</p>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={onCancel}>
        <X className="h-6 w-6" />
      </Button>
    </div>
  );
}