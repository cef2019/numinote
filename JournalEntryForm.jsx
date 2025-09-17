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
import { Plus, Trash2 } from 'lucide-react';
import AccountSelector from '@/components/AccountSelector';

export default function JournalEntryForm({ open, onOpenChange, onSave, journalEntry, accounts, projects = [] }) {
  const [formData, setFormData] = useState({
    date: '',
    reference: '',
    memo: '',
    entries: [{ account_id: null, debit: '', credit: '' }, { account_id: null, debit: '', credit: '' }],
    project_id: null,
  });
  const [totals, setTotals] = useState({ debit: 0, credit: 0 });

  useEffect(() => {
    if (journalEntry) {
      setFormData({
        date: journalEntry.date,
        reference: journalEntry.reference,
        memo: journalEntry.memo,
        entries: journalEntry.entries.map(e => ({
          account_id: e.account_id || null,
          debit: e.debit || '',
          credit: e.credit || '',
        })),
        project_id: journalEntry.project_id,
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        reference: `JE-${Date.now().toString().slice(-4)}`,
        memo: '',
        entries: [{ account_id: null, debit: '', credit: '' }, { account_id: null, debit: '', credit: '' }],
        project_id: null,
      });
    }
  }, [journalEntry, open]);

  useEffect(() => {
    const debitTotal = formData.entries.reduce((sum, entry) => sum + (parseFloat(entry.debit) || 0), 0);
    const creditTotal = formData.entries.reduce((sum, entry) => sum + (parseFloat(entry.credit) || 0), 0);
    setTotals({ debit: debitTotal, credit: creditTotal });
  }, [formData.entries]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value === 'none' ? null : value }));
  };

  const handleEntryChange = (index, field, value) => {
    const newEntries = [...formData.entries];
    if (field === 'account_id') {
      newEntries[index][field] = value ? value.id : null;
    } else {
      newEntries[index][field] = value;
      if (field === 'debit' && value) {
        newEntries[index]['credit'] = '';
      }
      if (field === 'credit' && value) {
        newEntries[index]['debit'] = '';
      }
    }
    setFormData(prev => ({ ...prev, entries: newEntries }));
  };

  const addEntryRow = () => {
    setFormData(prev => ({
      ...prev,
      entries: [...prev.entries, { account_id: null, debit: '', credit: '' }],
    }));
  };

  const removeEntryRow = (index) => {
    if (formData.entries.length <= 2) return;
    const newEntries = formData.entries.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, entries: newEntries }));
  };

  const handleSubmit = () => {
    const finalEntries = formData.entries
      .filter(e => e.account_id && (e.debit || e.credit))
      .map(e => ({
        account_id: e.account_id,
        debit: parseFloat(e.debit) || 0,
        credit: parseFloat(e.credit) || 0,
      }));

    onSave({
      ...formData,
      entries: finalEntries,
      project_id: formData.project_id,
    });
    onOpenChange(false);
  };

  const isBalanced = totals.debit.toFixed(2) === totals.credit.toFixed(2) && totals.debit > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{journalEntry ? 'Edit Journal Entry' : 'New Journal Entry'}</DialogTitle>
          <DialogDescription>
            {journalEntry ? 'Update the details of the journal entry.' : 'Create a new manual journal entry.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={formData.date} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="reference">Reference #</Label>
              <Input id="reference" value={formData.reference} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="project_id">Project</Label>
              <Select value={formData.project_id || 'none'} onValueChange={(value) => handleSelectChange('project_id', value)}>
                <SelectTrigger>
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
            <div className="md:col-span-3">
              <Label htmlFor="memo">Memo</Label>
              <Textarea id="memo" value={formData.memo} onChange={handleChange} placeholder="Add a description..." />
            </div>
          </div>

          <div className="mt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left font-semibold text-gray-600 pb-2 w-1/2">Account</th>
                  <th className="text-right font-semibold text-gray-600 pb-2">Debit</th>
                  <th className="text-right font-semibold text-gray-600 pb-2">Credit</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {formData.entries.map((entry, index) => (
                  <tr key={index}>
                    <td>
                      <AccountSelector
                        accounts={accounts}
                        value={entry.account_id}
                        onChange={(account) => handleEntryChange(index, 'account_id', account)}
                        disabledParent={true}
                      />
                    </td>
                    <td><Input type="number" placeholder="0.00" className="text-right" value={entry.debit} onChange={(e) => handleEntryChange(index, 'debit', e.target.value)} disabled={!!entry.credit} /></td>
                    <td><Input type="number" placeholder="0.00" className="text-right" value={entry.credit} onChange={(e) => handleEntryChange(index, 'credit', e.target.value)} disabled={!!entry.debit} /></td>
                    <td>
                      {formData.entries.length > 2 && (
                        <Button variant="ghost" size="icon" onClick={() => removeEntryRow(index)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Button variant="outline" size="sm" className="mt-2" onClick={addEntryRow}><Plus className="w-4 h-4 mr-2" /> Add Line</Button>
          </div>

          <div className="flex justify-end mt-4">
            <div className="w-1/2">
              <div className="flex justify-between border-t pt-2">
                <span className="font-semibold">Totals</span>
                <div className="flex space-x-8">
                  <span className="font-mono font-semibold w-24 text-right">${totals.debit.toFixed(2)}</span>
                  <span className="font-mono font-semibold w-24 text-right">${totals.credit.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="font-semibold">Difference</span>
                <span className={`font-mono font-semibold ${!isBalanced ? 'text-red-500' : 'text-green-600'}`}>
                  ${Math.abs(totals.debit - totals.credit).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit} disabled={!isBalanced}>Save Entry</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}