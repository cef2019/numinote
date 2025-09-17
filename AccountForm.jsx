import React, { useState, useEffect } from 'react';
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
import AccountSelector from './AccountSelector';

const ACCOUNT_CATEGORIES = ['Assets', 'Liabilities', 'Net Assets', 'Revenue', 'Expenses'];
const ACCOUNT_TYPES = {
  Assets: ['Bank', 'Accounts Receivable', 'Other Current Asset', 'Fixed Asset', 'Inventory'],
  Liabilities: ['Accounts Payable', 'Credit Card', 'Other Current Liability', 'Long-Term Liability'],
  'Net Assets': ['Equity'],
  Revenue: ['Income', 'Other Income', 'Grants', 'Donations'],
  Expenses: ['Expense', 'Cost of Goods Sold', 'Payroll Expense'],
};

export default function AccountForm({ open, onOpenChange, onSave, account, parentAccount, accounts }) {
  const [formData, setFormData] = useState({
    category: '',
    code: '',
    name: '',
    type: '',
    balance: '0',
    parent_id: null,
  });

  useEffect(() => {
    if (account) {
      setFormData({
        category: account.category || '',
        code: account.code || '',
        name: account.name || '',
        type: account.type || '',
        balance: account.balance != null ? String(account.balance) : '0',
        parent_id: account.parent_id || null,
      });
    } else if (parentAccount) {
      setFormData({
        category: parentAccount.category || '',
        code: '',
        name: '',
        type: parentAccount.type || '',
        balance: '0',
        parent_id: parentAccount.id,
      });
    } else {
      setFormData({ category: '', code: '', name: '', type: '', balance: '0', parent_id: null });
    }
  }, [account, parentAccount, open]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => {
      const newState = { ...prev, [name]: value };
      if (name === 'category') {
        newState.type = '';
      }
      return newState;
    });
  };

  // --- updated: accept full account object from AccountSelector ---
  const handleParentChange = (newParent) => {
    if (!newParent) {
      setFormData(prev => ({ ...prev, parent_id: null }));
      return;
    }
    setFormData(prev => ({
      ...prev,
      parent_id: newParent.id,
      category: prev.category || newParent.category,
      type: prev.type || newParent.type,
    }));
  };

  const handleSubmit = () => {
    const newBalance = parseFloat(formData.balance) || 0;
    onSave({
      ...formData,
      balance: newBalance,
    });
    onOpenChange(false);
  };

  const getTitle = () => {
    if (account) return 'Edit Account';
    if (parentAccount) return `Add Sub-account to ${parentAccount.name}`;
    return 'Add New Account';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            {account ? 'Update the details of your account.' : 'Enter the details for the new account.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">

          {/* Parent Account */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="parent_id" className="text-right">Parent Account</Label>
            <div className="col-span-3">
              <AccountSelector
                accounts={accounts}
                value={accounts.find(acc => acc.id === formData.parent_id) || null}
                onChange={handleParentChange}
                placeholder="None (Top-level account)"
              />
            </div>
          </div>

          {/* Category */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleSelectChange('category', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {ACCOUNT_CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleSelectChange('type', value)}
              disabled={!formData.category}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                {formData.category && ACCOUNT_TYPES[formData.category]?.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Code */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code" className="text-right">Code</Label>
            <Input id="code" value={formData.code} onChange={handleChange} className="col-span-3" />
          </div>

          {/* Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value={formData.name} onChange={handleChange} className="col-span-3" />
          </div>

          {/* Balance */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="balance" className="text-right">Balance</Label>
            <Input
              id="balance"
              type="number"
              value={formData.balance}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}