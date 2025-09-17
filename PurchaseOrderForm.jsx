
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus, Building } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AccountSelector from '@/components/AccountSelector';

const PurchaseOrderForm = ({ onSave, onCancel, order, purchaseRequests = [], accounts = [] }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    poNumber: `PO-${String(Date.now()).slice(-6)}`,
    prfNumber: '',
    orderDate: new Date().toISOString().split('T')[0],
    vendorName: '',
    vendorAddress: '',
    vendorContact: '',
    deliveryDate: '',
    deliverAt: '',
    paymentTerms: 'Net 30',
    items: [
      { id: 1, account_id: '', description: '', unit: '', quantity: 1, unitPrice: 0, projectCode: '', amount: 0 },
    ],
    notes: '',
    preparedBy: { name: 'Supply Chain/Admin', signature: '', date: '' },
    approvedBy: { name: 'Operation and Grant', signature: '', date: '' },
    authorizedBy: { name: 'Country Director', signature: '', date: '' },
    currency: 'USD',
    discount: 0,
    acceptedBy: { name: '', title: '', date: '', signature: '', telephone: '' },
  });

  const approvedPRs = useMemo(() => (purchaseRequests || []).filter(pr => pr.status === 'Approved'), [purchaseRequests]);

  useEffect(() => {
    if (order) {
      setFormData(order);
    }
  }, [order]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'prfNumber') {
      const selectedPR = approvedPRs.find(pr => pr.prf_number === value);
      if (selectedPR) {
        setFormData(prev => ({
          ...prev,
          items: selectedPR.items.map(item => ({
            id: item.id || Date.now() + Math.random(),
            account_id: item.account_id,
            description: item.description,
            unit: item.unit,
            quantity: item.quantity,
            unitPrice: item.unit_cost,
            projectCode: selectedPR.project_id,
            amount: item.total_cost,
          })),
          notes: `Based on PRF: ${selectedPR.purpose_of_request}`,
          currency: selectedPR.currency,
        }));
        toast({ title: "PRF Loaded", description: `Details from ${value} have been populated.` });
      }
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    if (field === 'account_id') {
      newItems[index][field] = value ? value.id : null;
    } else {
      newItems[index][field] = value;
    }
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].amount = (Number(newItems[index].quantity) || 0) * (Number(newItems[index].unitPrice) || 0);
    }
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now(), account_id: '', description: '', unit: '', quantity: 1, unitPrice: 0, projectCode: '', amount: 0 }],
    }));
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, items: newItems }));
  };
  
  const handleApproverChange = (approverType, e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [approverType]: { ...prev[approverType], [name]: value },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalAmount = formData.items.reduce((sum, item) => sum + item.amount, 0) - formData.discount;
    onSave({ ...formData, totalAmount });
    toast({
      title: "✅ Success!",
      description: "Purchase order has been saved.",
    });
  };

  const totalAmount = formData.items.reduce((sum, item) => sum + item.amount, 0);
  const finalTotal = totalAmount - (formData.discount || 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
           <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-2 rounded-lg">
                <Building className="text-white w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Purchase Order</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel}><X className="h-6 w-6" /></Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border rounded-lg">
            <div className="col-span-2 space-y-2">
              <Label>Vendor Name</Label>
              <Input name="vendorName" value={formData.vendorName} onChange={handleInputChange} placeholder="Supplier Co." />
              <Label>Vendor Address</Label>
              <Input name="vendorAddress" value={formData.vendorAddress} onChange={handleInputChange} placeholder="123 Supply St."/>
              <Label>Vendor Contact</Label>
              <Input name="vendorContact" value={formData.vendorContact} onChange={handleInputChange} placeholder="supplier@email.com"/>
            </div>
            <div className="space-y-2 bg-gray-50 p-4 rounded-md">
              <Label>PO Number</Label>
              <Input name="poNumber" value={formData.poNumber} readOnly />
              <Label>PRF No.</Label>
              <Select name="prfNumber" value={formData.prfNumber} onValueChange={(value) => handleSelectChange('prfNumber', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select approved PRF" />
                </SelectTrigger>
                <SelectContent>
                  {approvedPRs.map(pr => (
                    <SelectItem key={pr.id} value={pr.prf_number}>{pr.prf_number} - {pr.purpose_of_request}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Label>Order Date</Label>
              <Input type="date" name="orderDate" value={formData.orderDate} onChange={handleInputChange} />
            </div>
          </div>
          
          {/* Delivery & Payment */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border rounded-lg">
             <div><Label>Delivery Date</Label><Input type="date" name="deliveryDate" value={formData.deliveryDate} onChange={handleInputChange}/></div>
             <div><Label>Deliver At</Label><Input name="deliverAt" value={formData.deliverAt} onChange={handleInputChange}/></div>
             <div><Label>Payment Terms</Label><Input name="paymentTerms" value={formData.paymentTerms} onChange={handleInputChange}/></div>
           </div>

          {/* Items Table */}
          <div className="p-4 border rounded-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left">Acc Code</th>
                    <th className="p-2 text-left w-1/3">Description</th>
                    <th className="p-2 text-left">Unit</th>
                    <th className="p-2 text-left">Qty</th>
                    <th className="p-2 text-left">Unit Price</th>
                    <th className="p-2 text-left">Amount</th>
                    <th className="p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, index) => (
                    <tr key={item.id}>
                      <td>
                        <AccountSelector
                          accounts={accounts}
                          value={item.account_id}
                          onChange={(value) => handleItemChange(index, 'account_id', value)}
                          categoryFilter={['Expenses']}
                          placeholder="Expense Account"
                          disabledParent={true}
                        />
                      </td>
                      <td><Textarea name="description" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} rows={1} /></td>
                      <td><Input name="unit" value={item.unit} onChange={e => handleItemChange(index, 'unit', e.target.value)} className="min-w-[70px]" /></td>
                      <td><Input type="number" name="quantity" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} className="w-20" /></td>
                      <td><Input type="number" name="unitPrice" value={item.unitPrice} onChange={e => handleItemChange(index, 'unitPrice', e.target.value)} className="w-24" /></td>
                      <td><Input readOnly value={item.amount.toFixed(2)} className="w-24" /></td>
                      <td><Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)}><X className="h-4 w-4 text-red-500" /></Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button type="button" onClick={addItem} className="mt-2 bg-gradient-to-r from-emerald-500 to-green-600"><Plus className="h-4 w-4 mr-2" />Add Item</Button>
            
            <div className="grid grid-cols-2 mt-4">
                <div>
                    <Label>Notes</Label>
                    <Textarea name="notes" value={formData.notes} onChange={handleInputChange} />
                </div>
                <div className="space-y-2 text-right">
                    <div className="flex justify-end items-center gap-4"><Label>Subtotal</Label><p className="font-semibold w-32">{totalAmount.toFixed(2)}</p></div>
                    <div className="flex justify-end items-center gap-4"><Label>Discount</Label><Input type="number" name="discount" value={formData.discount} onChange={handleInputChange} className="w-32" /></div>
                    <div className="flex justify-end items-center gap-4"><Label>Currency</Label><Input name="currency" value={formData.currency} onChange={handleInputChange} className="w-32" /></div>
                    <hr className="my-2"/>
                    <div className="flex justify-end items-center gap-4"><Label className="text-lg font-bold">Total</Label><p className="font-bold text-lg w-32">{finalTotal.toFixed(2)}</p></div>
                </div>
            </div>
          </div>

          {/* Approvals */}
          <div className="p-4 border rounded-lg space-y-4">
            <h3 className="font-bold text-xl">Approval Signatures</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-2 border rounded">
                    <p className="font-semibold">Prepared by</p>
                    <Input placeholder="Name" name="name" value={formData.preparedBy.name} onChange={e => handleApproverChange('preparedBy', e)} className="mt-2" />
                    <Input type="date" name="date" value={formData.preparedBy.date} onChange={e => handleApproverChange('preparedBy', e)} className="mt-2" />
                </div>
                <div className="p-2 border rounded">
                    <p className="font-semibold">Approved by</p>
                    <Input placeholder="Name" name="name" value={formData.approvedBy.name} onChange={e => handleApproverChange('approvedBy', e)} className="mt-2" />
                    <Input type="date" name="date" value={formData.approvedBy.date} onChange={e => handleApproverChange('approvedBy', e)} className="mt-2" />
                </div>
                <div className="p-2 border rounded">
                    <p className="font-semibold">Authorized by</p>
                    <Input placeholder="Name" name="name" value={formData.authorizedBy.name} onChange={e => handleApproverChange('authorizedBy', e)} className="mt-2" />
                    <Input type="date" name="date" value={formData.authorizedBy.date} onChange={e => handleApproverChange('authorizedBy', e)} className="mt-2" />
                </div>
            </div>
          </div>

          {/* Vendor Acceptance */}
          <div className="p-4 border rounded-lg space-y-4">
            <h3 className="font-bold text-xl">Vendor Acceptance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input placeholder="Accepted by Name" name="name" value={formData.acceptedBy.name} onChange={e => handleApproverChange('acceptedBy', e)} />
              <Input placeholder="Title" name="title" value={formData.acceptedBy.title} onChange={e => handleApproverChange('acceptedBy', e)} />
              <Input type="date" name="date" value={formData.acceptedBy.date} onChange={e => handleApproverChange('acceptedBy', e)} />
              <Input placeholder="Signature" name="signature" value={formData.acceptedBy.signature} onChange={e => handleApproverChange('acceptedBy', e)} className="md:col-span-2" />
              <Input placeholder="Telephone" name="telephone" value={formData.acceptedBy.telephone} onChange={e => handleApproverChange('acceptedBy', e)} />
            </div>
          </div>


          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-green-600">Save Purchase Order</Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default PurchaseOrderForm;
