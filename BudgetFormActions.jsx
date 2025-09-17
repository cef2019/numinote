import React from 'react';
import { Button } from '@/components/ui/button';

export default function BudgetFormActions({ onCancel, budget }) {
  return (
    <div className="flex justify-end space-x-4 pt-6 mt-6 border-t">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button 
        type="submit" 
        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
      >
        {budget ? 'Update Budget' : 'Create Budget'}
      </Button>
    </div>
  );
}