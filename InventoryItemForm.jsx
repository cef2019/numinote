import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Package } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

export default function InventoryItemForm({ onSave, onCancel, item }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 0,
    unitCost: 0,
    reorderLevel: 10,
    description: '',
    location: '',
    isAsset: false,
    purchaseDate: new Date().toISOString().split('T')[0],
    usableLife: 0,
    depreciationRate: 0,
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        category: item.category || '',
        quantity: item.quantity || 0,
        unitCost: item.unitCost || 0,
        reorderLevel: item.reorderLevel || 10,
        description: item.description || '',
        location: item.location || '',
        isAsset: item.isAsset || false,
        purchaseDate: item.purchaseDate || new Date().toISOString().split('T')[0],
        usableLife: item.usableLife || 0,
        depreciationRate: item.depreciationRate || 0,
      });
    } else {
      setFormData({
        name: '',
        category: '',
        quantity: 1,
        unitCost: 0,
        reorderLevel: 10,
        description: '',
        location: '',
        isAsset: false,
        purchaseDate: new Date().toISOString().split('T')[0],
        usableLife: 0,
        depreciationRate: 0,
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
  };

  const handleCheckboxChange = (checked) => {
    setFormData(prev => ({ ...prev, isAsset: checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: item ? item.id : Date.now(),
      lastUpdated: new Date().toISOString().split('T')[0],
    });
    toast({
      title: "✅ Success!",
      description: `Inventory item has been ${item ? 'updated' : 'created'}.`,
    });
    onCancel();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
    >
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-2 rounded-lg">
              <Package className="text-white w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">{item ? 'Edit Item' : 'New Inventory Item'}</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel}><X className="h-6 w-6" /></Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Item Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" value={formData.category} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity on Hand</Label>
              <Input id="quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="unitCost">Unit Cost</Label>
              <Input id="unitCost" name="unitCost" type="number" step="0.01" value={formData.unitCost} onChange={handleChange} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
                <Label htmlFor="reorderLevel">Reorder Level</Label>
                <Input id="reorderLevel" name="reorderLevel" type="number" value={formData.reorderLevel} onChange={handleChange} />
            </div>
            <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" value={formData.location} onChange={handleChange} />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} />
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Checkbox id="isAsset" checked={formData.isAsset} onCheckedChange={handleCheckboxChange} />
              <Label htmlFor="isAsset" className="text-base font-semibold">This is a Fixed Asset</Label>
            </div>
            {formData.isAsset && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4 mt-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="purchaseDate">Purchase Date</Label>
                    <Input id="purchaseDate" name="purchaseDate" type="date" value={formData.purchaseDate} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="usableLife">Usable Life (Years)</Label>
                    <Input id="usableLife" name="usableLife" type="number" value={formData.usableLife} onChange={handleChange} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="depreciationRate">Depreciation Rate (%)</Label>
                  <Input id="depreciationRate" name="depreciationRate" type="number" step="0.01" value={formData.depreciationRate} onChange={handleChange} placeholder="e.g., 20 for 20%" />
                </div>
              </motion.div>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-green-600">Save Item</Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}