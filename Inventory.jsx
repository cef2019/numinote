import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreVertical, Edit, Trash2, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import InventoryItemForm from '@/components/supply-chain/InventoryItemForm';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from '@/lib/customSupabaseClient';

const calculateDepreciation = (item) => {
  if (!item.is_asset || !item.purchase_date || !item.unit_cost || !item.usable_life) {
    return { annualDepreciation: 0, accumulatedDepreciation: 0, bookValue: (item.unit_cost || 0) * (item.quantity || 0) };
  }
  const purchaseDate = new Date(item.purchase_date);
  const now = new Date();
  const yearsOwned = (now - purchaseDate) / (1000 * 60 * 60 * 24 * 365.25);
  
  const annualDepreciation = item.unit_cost / item.usable_life;
  const accumulatedDepreciation = Math.min(annualDepreciation * yearsOwned, item.unit_cost);
  const bookValue = item.unit_cost - accumulatedDepreciation;

  return {
    annualDepreciation: annualDepreciation * (item.quantity || 0),
    accumulatedDepreciation: accumulatedDepreciation * (item.quantity || 0),
    bookValue: bookValue * (item.quantity || 0),
  };
};

export default function Inventory({ inventory = [], setInventory, activeOrgId }) {
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleNewItem = () => {
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleSaveItem = async (formData) => {
    const dataToSave = { ...formData, org_id: activeOrgId };
    delete dataToSave.id;

    if (selectedItem) {
      const { data, error } = await supabase.from('inventory').update(dataToSave).eq('id', selectedItem.id).select().single();
      if (error) {
        toast({ variant: 'destructive', title: 'Error updating item', description: error.message });
      } else {
        setInventory(prev => prev.map(item => item.id === data.id ? data : item));
        toast({ title: 'Success', description: 'Item updated successfully.' });
      }
    } else {
      const { data, error } = await supabase.from('inventory').insert(dataToSave).select().single();
      if (error) {
        toast({ variant: 'destructive', title: 'Error creating item', description: error.message });
      } else {
        setInventory(prev => [...prev, data]);
        toast({ title: 'Success', description: 'Item created successfully.' });
      }
    }
    setIsFormOpen(false);
    setSelectedItem(null);
  };

  const handleDeleteItem = (item) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    const { error } = await supabase.from('inventory').delete().eq('id', itemToDelete.id);
    if (error) {
      toast({ variant: 'destructive', title: 'Error deleting item', description: error.message });
    } else {
      setInventory(prev => prev.filter(item => item.id !== itemToDelete.id));
      toast({ title: "🗑️ Deleted", description: "The inventory item has been deleted." });
    }
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleRecordDepreciation = (item, depreciation) => {
    toast({
        title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
        description: "Recording depreciation is not yet fully integrated.",
      });
  };

  const getStockColor = (quantity, reorderLevel) => {
    if (quantity <= 0) return 'text-red-500 font-bold';
    if (quantity <= reorderLevel) return 'text-yellow-500 font-bold';
    return 'text-gray-900';
  };

  const inventoryWithDepreciation = useMemo(() => {
    return (inventory || []).map(item => ({
      ...item,
      depreciation: calculateDepreciation(item),
    }));
  }, [inventory]);

  return (
    <div className="p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">Inventory & Assets</h1>
        <Button onClick={handleNewItem} className="bg-gradient-to-r from-emerald-500 to-green-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Item
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Cost</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Value</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {inventoryWithDepreciation.map((item) => (
                  <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} layout>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name} {item.is_asset && <span className="text-emerald-500 text-xs">(Asset)</span>}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${getStockColor(item.quantity, item.reorder_level)}`}>{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${(item.unit_cost || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">${(item.depreciation.bookValue || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.last_updated}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditItem(item)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          {item.is_asset && (
                            <DropdownMenuItem onClick={() => handleRecordDepreciation(item, item.depreciation)}>
                              <TrendingDown className="mr-2 h-4 w-4" />
                              <span>Record Depreciation</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteItem(item)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      <AnimatePresence>
        {isFormOpen && (
          <InventoryItemForm
            onSave={handleSaveItem}
            onCancel={() => setIsFormOpen(false)}
            item={selectedItem}
          />
        )}
      </AnimatePresence>
      
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        itemType="inventory item"
        itemName={itemToDelete?.name}
      />
    </div>
  );
}