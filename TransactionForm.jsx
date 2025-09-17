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

const flattenAccounts = (accountsData) => {
  let flatList = [];
  const recurse = (accounts, level) => {
    if (!Array.isArray(accounts)) return;
    accounts.forEach(acc => {
      flatList.push({ ...acc, level });
      if (acc.subAccounts && acc.subAccounts.length > 0) {
        recurse(acc.subAccounts, level + 1);
      }
    });
  };
  // Ensure accountsData is an object before calling Object.values
  if (accountsData && typeof accountsData === 'object') {
    Object.values(accountsData).forEach(categoryAccounts => {
      if(Array.isArray(categoryAccounts)) {
        recurse(categoryAccounts, 0)
      }
    });
  }
  return flatList;
};

export default function TransactionForm({ open, onOpenChange, onSave, transaction, accounts }) {
  const [formData, setFormData] = useState({
    date: '',
    description: '',
    accountId: '',
    type: 'Expense',
    amount: '',
    notes: '',
  });

  const accountOptions = useMemo(() => flattenAccounts(accounts), [accounts]);

  useEffect(() => {
    if (transaction) {
      setFormData({
        date: transaction.date || '',
        description: transaction.description || '',
        accountId: transaction.accountId != null ? transaction.accountId.toString() : '',
        type: transaction.type || 'Expense',
        amount: transaction.amount != null ? transaction.amount.toString() : '',
        notes: transaction.notes || '',
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        description: '',
        accountId: '',
        type: 'Expense',
        amount: '',
        notes: '',
      });
    }
  }, [transaction, open]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const accountId = formData.accountId;
    if (!accountId) {
      // Maybe show a toast message? For now, just log and return.
      console.error("No account selected");
      return;
    }
    const account = accountOptions.find(a => a.id.toString() === accountId.toString());
    onSave({
      ...formData,
      id: transaction ? transaction.id : Date.now(),
      amount: parseFloat(formData.amount) || 0,
      accountName: account ? account.name : 'N/A',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{transaction ? 'Edit Transaction' : 'Add New Transaction'}</DialogTitle>
          <DialogDescription>
            {transaction ? 'Update the details of your transaction.' : 'Enter the details for the new transaction.'}
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
            <Label htmlFor="accountId" className="text-right">Account</Label>
            <Select value={formData.accountId ? formData.accountId.toString() : ''} onValueChange={(value) => handleSelectChange('accountId', value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select an account" />
              </SelectTrigger>
              <SelectContent>
                {accountOptions.map(acc => (
                  <SelectItem key={acc.id} value={acc.id.toString()}>
                    <span style={{ paddingLeft: `${acc.level * 1.5}rem` }}>{acc.code} - {acc.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Type</Label>
            <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Income">Income</SelectItem>
                <SelectItem value="Expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">Amount</Label>
            <Input id="amount" type="number" value={formData.amount} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="notes" className="text-right pt-2">Notes</Label>
            <Textarea id="notes" value={formData.notes} onChange={handleChange} className="col-span-3" placeholder="Optional notes..."/>
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