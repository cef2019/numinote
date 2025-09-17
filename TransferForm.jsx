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

// Function to get the initial state, now also handles reset logic
const getInitialFormData = () => ({
  date: new Date().toISOString().split('T')[0],
  amount: '',
  fromAccountId: null,
  toAccountId: null,
  notes: '',
});

export default function TransferForm({ open, onOpenChange, onSave, accounts = [] }) {
  const [formData, setFormData] = useState(getInitialFormData());
  const [error, setError] = useState('');

  // Use useEffect to reset the form data whenever the dialog opens
  useEffect(() => {
    if (open) {
      setFormData(getInitialFormData());
      setError(''); // Clear any previous errors
    }
  }, [open]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    // Basic validation for amount to ensure it's a valid number format
    if (id === 'amount' && value !== '' && isNaN(Number(value))) {
        // Don't update state if the value is not a valid number
        return;
    }
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (name, account) => {
    setFormData((prev) => ({ ...prev, [name]: account ? account.id : null }));
  };

  const handleSubmit = () => {
    setError('');
    const amount = parseFloat(formData.amount);

    // Consolidated validation logic for clarity
    if (!formData.fromAccountId || !formData.toAccountId) {
      setError('Please select both source and destination accounts.');
      return;
    }
    
    if (formData.fromAccountId === formData.toAccountId) {
      setError('Source and destination accounts must be different.');
      return;
    }
    
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid transfer amount greater than zero.');
      return;
    }

    const fromAccount = accounts.find((a) => a.id === formData.fromAccountId);
    const toAccount = accounts.find((a) => a.id === formData.toAccountId);

    if (!fromAccount || !toAccount) {
      // This is a safety check, but the above null check should prevent this.
      setError('Invalid accounts selected. Please try again.');
      return;
    }

    onSave({
      date: formData.date,
      description: `Transfer from ${fromAccount.name} to ${toAccount.name}`,
      amount,
      type: 'Transfer',
      fromAccountId: formData.fromAccountId,
      toAccountId: formData.toAccountId,
      fromAccountName: fromAccount.name,
      toAccountName: toAccount.name,
      notes: formData.notes,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Transfer Funds</DialogTitle>
          <DialogDescription>
            Move funds between your asset accounts.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">Amount</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fromAccountId" className="text-right">From</Label>
            <div className="col-span-3">
              <AccountSelector
                accounts={accounts}
                value={formData.fromAccountId}
                onChange={(account) => handleSelectChange('fromAccountId', account)}
                categoryFilter={['Assets']}
                placeholder="Select source account"
                disabledParent={true}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="toAccountId" className="text-right">To</Label>
            <div className="col-span-3">
              <AccountSelector
                accounts={accounts}
                value={formData.toAccountId}
                onChange={(account) => handleSelectChange('toAccountId', account)}
                categoryFilter={['Assets']}
                placeholder="Select destination account"
                disabledParent={true}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="notes" className="text-right pt-2">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={handleChange}
              className="col-span-3"
              placeholder="Optional notes for the transfer..."
            />
          </div>

          {error && (
            <p className="col-span-4 text-red-600 text-sm font-medium">{error}</p>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}