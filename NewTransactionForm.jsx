import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AccountSelector from '@/components/AccountSelector';

const getInitialFormData = (transaction = null) => ({
  date: transaction?.date || new Date().toISOString().split('T')[0],
  description: transaction?.description || '',
  account_id: transaction?.account_id || null,
  type: transaction?.type || 'Expense',
  amount: transaction?.amount != null ? String(transaction.amount) : '',
  notes: transaction?.notes || '',
  project_id: transaction?.project_id || null,
});

export default function NewTransactionForm({ open, onOpenChange, onSave, transaction, accounts = [], projects = [] }) {
  const [formData, setFormData] = useState(getInitialFormData(transaction));

  const accountCategoryFilter = useMemo(() => {
    switch (formData.type) {
      case 'Income': return ['Revenue'];
      case 'Expense': return ['Expenses'];
      case 'Asset': return ['Assets'];
      case 'Liability': return ['Liabilities'];
      default: return null;
    }
  }, [formData.type]);

  useEffect(() => {
    if (transaction) {
      setFormData(getInitialFormData(transaction));
    } else if (open) {
      setFormData(getInitialFormData(null));
    }
  }, [transaction, open]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "amount") {
      const safeValue = value.replace(/[^0-9.]/g, "");
      const dotCount = safeValue.split('.').length - 1;
      setFormData(prev => ({
        ...prev,
        [id]: dotCount > 1 ? prev[id] : safeValue,
      }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => {
      const newState = {
        ...prev,
        [name]: value === 'none' ? null : value,
      };
      if (name === 'type') {
        newState.account_id = null;
      }
      return newState;
    });
  };

  const handleAccountChange = (account) => {
    setFormData(prev => ({ ...prev, account_id: account ? account.id : null }));
  };

  const handleSubmit = () => {
    onSave({
      ...formData,
      amount: Number(formData.amount) || 0,
      account_id: formData.account_id || null,
      project_id: formData.project_id || null,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{transaction ? 'Edit Transaction' : 'Add New Transaction'}</DialogTitle>
          <DialogDescription>
            {transaction
              ? 'Update the details of your transaction.'
              : 'Enter the details for the new transaction.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">Date</Label>
            <Input id="date" type="date" value={formData.date} onChange={handleChange} className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Input id="description" value={formData.description} onChange={handleChange} className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Type</Label>
            <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
              <SelectTrigger className="col-span-3" aria-label="Transaction Type">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Income">Income</SelectItem>
                <SelectItem value="Expense">Expense</SelectItem>
                <SelectItem value="Asset">Asset</SelectItem>
                <SelectItem value="Liability">Liability</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="account_id" className="text-right">Account</Label>
            <div className="col-span-3">
              <AccountSelector
                accounts={accounts}
                value={formData.account_id}
                onChange={handleAccountChange}
                categoryFilter={accountCategoryFilter}
                disabledParent={true}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">Amount</Label>
            <Input
              id="amount"
              type="text"
              inputMode="decimal"
              value={formData.amount}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="project_id" className="text-right">Project</Label>
            <Select
              value={formData.project_id || 'none'}
              onValueChange={(value) => handleSelectChange('project_id', value)}
            >
              <SelectTrigger className="col-span-3" aria-label="Project">
                <SelectValue placeholder="Link to a project (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {projects.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="notes" className="text-right pt-2">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={handleChange}
              className="col-span-3"
              placeholder="Optional notes..."
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit}>Save Transaction</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}