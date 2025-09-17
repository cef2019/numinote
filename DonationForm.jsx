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

export default function DonationForm({ open, onOpenChange, onSave, donation, accounts, funds, projects }) {
  const [formData, setFormData] = useState({
    donor_name: '',
    date: '',
    amount: '',
    type: 'Cash',
    fund_id: null,
    account_id: null,
    notes: '',
    project_id: null,
  });

  useEffect(() => {
    if (donation) {
      setFormData({
        donor_name: donation.donor_name,
        date: donation.date,
        amount: donation.amount.toString(),
        type: donation.type,
        fund_id: donation.fund_id,
        account_id: donation.account_id,
        notes: donation.notes || '',
        project_id: donation.project_id,
      });
    } else {
      setFormData({
        donor_name: '',
        date: new Date().toISOString().split('T')[0],
        amount: '',
        type: 'Cash',
        fund_id: null,
        account_id: null,
        notes: '',
        project_id: null,
      });
    }
  }, [donation, open]);

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value === 'none' ? null : value }));
  };

  const handleAccountChange = (account) => {
    setFormData(prev => ({ ...prev, account_id: account ? account.id : null }));
  };
  
  useEffect(() => {
    if (formData.fund_id && funds) {
      const selectedFund = funds.find(f => f.id === formData.fund_id);
      if (selectedFund && selectedFund.linked_account_id) {
        setFormData(prev => ({ ...prev, account_id: selectedFund.linked_account_id }));
      }
    }
  }, [formData.fund_id, funds]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    onSave({
      ...formData,
      amount: parseFloat(formData.amount) || 0,
      fund_id: formData.fund_id,
      account_id: formData.account_id,
      project_id: formData.project_id,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{donation ? 'Edit Donation' : 'Log a Donation'}</DialogTitle>
          <DialogDescription>
            {donation ? 'Update the details of the donation.' : 'Enter the details for the new donation.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="donor_name" className="text-right">Donor</Label>
            <Input id="donor_name" value={formData.donor_name} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">Date</Label>
            <Input id="date" type="date" value={formData.date} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">Amount</Label>
            <Input id="amount" type="number" value={formData.amount} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Type</Label>
            <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Check">Check</SelectItem>
                <SelectItem value="Online">Online</SelectItem>
                <SelectItem value="In-Kind">In-Kind</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fund_id" className="text-right">Fund</Label>
            <Select value={formData.fund_id || 'none'} onValueChange={(value) => handleSelectChange('fund_id', value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a fund" />
              </SelectTrigger>
              <SelectContent>
                 <SelectItem value="none">None</SelectItem>
                {(funds || []).map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="account_id" className="text-right">Deposit To</Label>
            <div className="col-span-3">
              <AccountSelector
                accounts={accounts}
                value={formData.account_id}
                onChange={handleAccountChange}
                categoryFilter={['Assets']}
                placeholder="Select an asset account"
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
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="notes" className="text-right pt-2">Notes</Label>
            <Textarea id="notes" value={formData.notes} onChange={handleChange} className="col-span-3" placeholder="Optional notes..."/>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit}>Save Donation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}