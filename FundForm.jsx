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
import { Textarea } from '@/components/ui/textarea';
import AccountSelector from '@/components/AccountSelector';

export default function FundForm({ open, onOpenChange, onSave, fund, accounts }) {
  const [formData, setFormData] = useState({
    name: '',
    balance: '',
    description: '',
    linked_account_id: null,
  });

  useEffect(() => {
    if (fund) {
      setFormData({
        name: fund.name || '',
        balance: fund.balance?.toString() || '',
        description: fund.description || '',
        linked_account_id: fund.linked_account_id,
      });
    } else {
      setFormData({
        name: '',
        balance: '',
        description: '',
        linked_account_id: null,
      });
    }
  }, [fund, open]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (name, account) => {
    setFormData(prev => ({ ...prev, [name]: account ? account.id : null }));
  };

  const handleSubmit = () => {
    onSave({
      ...formData,
      balance: parseFloat(formData.balance) || 0,
      linked_account_id: formData.linked_account_id || null,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{fund ? 'Edit Fund' : 'Add New Fund'}</DialogTitle>
          <DialogDescription>
            {fund ? 'Update the details of your fund.' : 'Enter the details for the new fund.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Fund Name</Label>
            <Input id="name" value={formData.name} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="balance" className="text-right">Balance</Label>
            <Input id="balance" type="number" value={formData.balance} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="linked_account_id" className="text-right">Linked Account</Label>
            <div className="col-span-3">
              <AccountSelector
                accounts={accounts}
                value={formData.linked_account_id}
                onChange={(account) => handleSelectChange('linked_account_id', account)}
                categoryFilter={['Assets']}
                placeholder="Link to an asset account"
                disabledParent={true}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">Description</Label>
            <Textarea id="description" value={formData.description} onChange={handleChange} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit}>Save Fund</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}