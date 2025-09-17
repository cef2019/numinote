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
import { Textarea } from '@/components/ui/textarea';
import AccountSelector from '@/components/AccountSelector';

export default function BillForm({ open, onOpenChange, onSave, bill, accounts, projects }) {
  const [formData, setFormData] = useState({
    vendor_name: '',
    date: '',
    due_date: '',
    amount: '',
    status: 'Open',
    notes: '',
    expense_account_id: null,
    project_id: null,
  });

  useEffect(() => {
    if (bill) {
      setFormData({
        vendor_name: bill.vendor_name || '',
        date: bill.date || '',
        due_date: bill.due_date || '',
        amount: bill.amount?.toString() || '',
        status: bill.status || 'Open',
        notes: bill.notes || '',
        expense_account_id: bill.expense_account_id,
        project_id: bill.project_id,
      });
    } else {
      setFormData({
        vendor_name: '',
        date: new Date().toISOString().split('T')[0],
        due_date: '',
        amount: '',
        status: 'Open',
        notes: '',
        expense_account_id: null,
        project_id: null,
      });
    }
  }, [bill, open]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value === 'none' ? null : value }));
  };
  
  const handleAccountChange = (account) => {
    setFormData(prev => ({ ...prev, expense_account_id: account ? account.id : null }));
  };

  const handleSubmit = () => {
    onSave({
      ...formData,
      amount: parseFloat(formData.amount) || 0,
      expense_account_id: formData.expense_account_id,
      project_id: formData.project_id,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{bill ? 'Edit Bill' : 'Record a Bill'}</DialogTitle>
          <DialogDescription>
            {bill ? 'Update the details of the bill.' : 'Enter the details for the new bill.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="vendor_name" className="text-right">Vendor</Label>
            <Input id="vendor_name" value={formData.vendor_name} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">Date</Label>
            <Input id="date" type="date" value={formData.date} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="due_date" className="text-right">Due Date</Label>
            <Input id="due_date" type="date" value={formData.due_date} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">Amount</Label>
            <Input id="amount" type="number" value={formData.amount} onChange={handleChange} className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="expense_account_id" className="text-right">Expense Account</Label>
            <div className="col-span-3">
              <AccountSelector
                accounts={accounts}
                value={formData.expense_account_id}
                onChange={handleAccountChange}
                categoryFilter={['Expenses']}
                placeholder="Select an expense account"
                disabledParent={true}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="project_id" className="text-right">Project</Label>
            <Select value={formData.project_id || 'none'} onValueChange={(value) => handleSelectChange('project_id', value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Link to a project (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {(projects || []).map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
              </SelectContent>
            </Select>
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
          <Button type="submit" onClick={handleSubmit}>Save Bill</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}