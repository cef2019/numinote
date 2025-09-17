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

export default function InvoiceForm({ open, onOpenChange, onSave, invoice, accounts, projects }) {
  const [formData, setFormData] = useState({
    invoice_number: '',
    customer_name: '',
    date: '',
    due_date: '',
    amount: '',
    status: 'Sent',
    notes: '',
    deposit_account_id: null,
    project_id: null,
  });

  useEffect(() => {
    if (invoice) {
      setFormData({
        invoice_number: invoice.invoice_number || '',
        customer_name: invoice.customer_name || '',
        date: invoice.date || '',
        due_date: invoice.due_date || '',
        amount: invoice.amount?.toString() || '',
        status: invoice.status || 'Sent',
        notes: invoice.notes || '',
        deposit_account_id: invoice.deposit_account_id,
        project_id: invoice.project_id,
      });
    } else {
      setFormData({
        invoice_number: `INV-${Date.now().toString().slice(-4)}`,
        customer_name: '',
        date: new Date().toISOString().split('T')[0],
        due_date: '',
        amount: '',
        status: 'Sent',
        notes: '',
        deposit_account_id: null,
        project_id: null,
      });
    }
  }, [invoice, open]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value === 'none' ? null : value }));
  };
  
  const handleAccountChange = (account) => {
    setFormData(prev => ({ ...prev, deposit_account_id: account ? account.id : null }));
  };

  const handleSubmit = () => {
    onSave({
      ...formData,
      amount: parseFloat(formData.amount) || 0,
      deposit_account_id: formData.deposit_account_id,
      project_id: formData.project_id,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{invoice ? 'Edit Invoice' : 'Create New Invoice'}</DialogTitle>
          <DialogDescription>
            {invoice ? 'Update the details of the invoice.' : 'Enter the details for the new invoice.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="invoice_number" className="text-right">Number</Label>
            <Input id="invoice_number" value={formData.invoice_number} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customer_name" className="text-right">Customer</Label>
            <Input id="customer_name" value={formData.customer_name} onChange={handleChange} className="col-span-3" />
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
            <Label htmlFor="deposit_account_id" className="text-right">Income Account</Label>
            <div className="col-span-3">
              <AccountSelector
                accounts={accounts}
                value={formData.deposit_account_id}
                onChange={handleAccountChange}
                categoryFilter={['Revenue']}
                placeholder="Select an income account"
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
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Sent">Sent</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
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
          <Button type="submit" onClick={handleSubmit}>Save Invoice</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}