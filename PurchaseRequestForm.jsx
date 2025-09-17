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
import { Plus, Trash2 } from 'lucide-react';
import AccountSelector from '@/components/AccountSelector';

export default function PurchaseRequestForm({ open, onOpenChange, onSave, purchaseRequest, projects = [], accounts = [] }) {
  const [formData, setFormData] = useState({
    prf_number: '',
    date_of_request: '',
    location: '',
    department: '',
    project_id: '',
    purpose_of_request: '',
    currency: 'USD',
    status: 'Pending',
    items: [{ account_id: '', description: '', unit: '', quantity: 1, unit_cost: '', total_cost: '' }],
  });

  useEffect(() => {
    if (purchaseRequest) {
      setFormData({
        prf_number: purchaseRequest.prf_number || '',
        date_of_request: purchaseRequest.date_of_request || '',
        location: purchaseRequest.location || '',
        department: purchaseRequest.department || '',
        project_id: purchaseRequest.project_id ? String(purchaseRequest.project_id) : '',
        purpose_of_request: purchaseRequest.purpose_of_request || '',
        currency: purchaseRequest.currency || 'USD',
        status: purchaseRequest.status || 'Pending',
        items: purchaseRequest.items?.length > 0 ? purchaseRequest.items.map(item => ({
          ...item,
          quantity: item.quantity || 1,
          unit_cost: item.unit_cost || '',
          total_cost: item.total_cost || '',
          account_id: item.account_id || ''
        })) : [{ account_id: '', description: '', unit: '', quantity: 1, unit_cost: '', total_cost: '' }],
      });
    } else {
      setFormData({
        prf_number: `PRF-${Date.now().toString().slice(-6)}`,
        date_of_request: new Date().toISOString().split('T')[0],
        location: '',
        department: '',
        project_id: '',
        purpose_of_request: '',
        currency: 'USD',
        status: 'Pending',
        items: [{ account_id: '', description: '', unit: '', quantity: 1, unit_cost: '', total_cost: '' }],
      });
    }
  }, [purchaseRequest, open]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value === 'none' ? null : value }));
  };
  
  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    
    if (field === 'quantity' || field === 'unit_cost') {
      const quantity = parseFloat(newItems[index].quantity) || 0;
      const unitCost = parseFloat(newItems[index].unit_cost) || 0;
      newItems[index].total_cost = (quantity * unitCost).toFixed(2);
    }
    
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItemRow = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { account_id: '', description: '', unit: '', quantity: 1, unit_cost: '', total_cost: '' }],
    }));
  };

  const removeItemRow = (index) => {
    if (formData.items.length <= 1) return;
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const handleSubmit = () => {
    const finalItems = formData.items
      .filter(item => item.description && item.quantity && item.unit_cost)
      .map(item => ({
        account_id: item.account_id || null,
        description: item.description,
        unit: item.unit,
        quantity: parseInt(item.quantity) || 0,
        unit_cost: parseFloat(item.unit_cost) || 0,
        total_cost: parseFloat(item.total_cost) || 0,
      }));
      
    onSave({
        ...formData,
        items: finalItems,
    });
    onOpenChange(false);
  };

  const totalCost = React.useMemo(() => {
    return formData.items.reduce((sum, item) => sum + (parseFloat(item.total_cost) || 0), 0);
  }, [formData.items]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{purchaseRequest ? 'Edit Purchase Request' : 'New Purchase Request'}</DialogTitle>
          <DialogDescription>
            {purchaseRequest ? 'Update the details of the purchase request.' : 'Create a new request for goods or services.'}
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
            <div><Label htmlFor="prf_number">PRF Number</Label><Input id="prf_number" value={formData.prf_number} onChange={handleChange} /></div>
            <div><Label htmlFor="date_of_request">Date of Request</Label><Input id="date_of_request" type="date" value={formData.date_of_request} onChange={handleChange} /></div>
            <div><Label htmlFor="location">Location</Label><Input id="location" value={formData.location} onChange={handleChange} /></div>
            <div><Label htmlFor="department">Department</Label><Input id="department" value={formData.department} onChange={handleChange} /></div>
            <div className="lg:col-span-2">
                <Label htmlFor="project_id">Project</Label>
                <Select value={formData.project_id || 'none'} onValueChange={(value) => handleSelectChange('project_id', value)}>
                    <SelectTrigger><SelectValue placeholder="Link to a project (optional)" /></SelectTrigger>
                    <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {(projects || []).map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="lg:col-span-2">
                <Label htmlFor="purpose_of_request">Purpose of Request</Label>
                <Textarea id="purpose_of_request" value={formData.purpose_of_request} onChange={handleChange} />
            </div>
             <div>
                <Label htmlFor="currency">Currency</Label>
                <Select value={formData.currency} onValueChange={(value) => handleSelectChange('currency', value)}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent><SelectItem value="USD">USD</SelectItem></SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </div>
          
          <div className="mt-4">
            <Label>Items</Label>
            <div className="border rounded-lg">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="p-2 text-left w-1/4">Expense Account</th>
                            <th className="p-2 text-left w-1/3">Description</th>
                            <th className="p-2 text-left">Unit</th>
                            <th className="p-2 text-left">Qty</th>
                            <th className="p-2 text-left">Unit Cost</th>
                            <th className="p-2 text-left">Total</th>
                            <th className="p-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {formData.items.map((item, index) => (
                            <tr key={index} className="border-b last:border-b-0">
                                <td className="p-2">
                                    <AccountSelector
                                      accounts={accounts}
                                      value={item.account_id}
                                      onChange={(value) => handleItemChange(index, 'account_id', value)}
                                      categoryFilter={['Expenses']}
                                      placeholder="Select expense account"
                                      disabledParent={true}
                                    />
                                </td>
                                <td className="p-2"><Input value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} /></td>
                                <td className="p-2"><Input value={item.unit} onChange={(e) => handleItemChange(index, 'unit', e.target.value)} /></td>
                                <td className="p-2"><Input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} /></td>
                                <td className="p-2"><Input type="number" value={item.unit_cost} onChange={(e) => handleItemChange(index, 'unit_cost', e.target.value)} /></td>
                                <td className="p-2"><Input value={item.total_cost || '0.00'} readOnly className="bg-gray-100" /></td>
                                <td className="p-2">
                                    {formData.items.length > 1 && (
                                        <Button variant="ghost" size="icon" onClick={() => removeItemRow(index)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <Button variant="outline" size="sm" className="mt-2" onClick={addItemRow}><Plus className="w-4 h-4 mr-2" /> Add Item</Button>
          </div>
          <div className="flex justify-end mt-4">
              <div className="w-1/3">
                  <div className="flex justify-between">
                      <span className="font-semibold">Total Cost</span>
                      <span className="font-mono font-semibold">${totalCost.toFixed(2)}</span>
                  </div>
              </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
          <Button type="submit" onClick={handleSubmit}>Save Request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}