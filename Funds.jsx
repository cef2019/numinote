import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import FundForm from '@/components/FundForm';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { supabase } from '@/lib/customSupabaseClient';

export default function Funds({ allData, activeOrgId, fetchDataForOrg, loadingData }) {
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);
  const [fundToDelete, setFundToDelete] = useState(null);

  const { funds, accounts, projects } = useMemo(() => {
    return {
      funds: allData?.funds || [],
      accounts: allData?.accounts || [],
      projects: allData?.projects || [],
    };
  }, [allData]);

  const handleAddNew = () => {
    setSelectedFund(null);
    setIsFormOpen(true);
  };

  const handleEdit = (fund) => {
    setSelectedFund(fund);
    setIsFormOpen(true);
  };

  const handleDelete = (fund) => {
    setFundToDelete(fund);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!fundToDelete) return;
    const { error } = await supabase.from('funds').delete().eq('id', fundToDelete.id);
    if (error) {
      toast({ variant: "destructive", title: "Error deleting fund", description: error.message });
    } else {
      await fetchDataForOrg(activeOrgId);
      toast({ title: "Success", description: "Fund deleted successfully." });
    }
    setIsConfirmOpen(false);
    setFundToDelete(null);
  };

  const handleSave = async (fundData) => {
    const dataToSave = {
      ...fundData,
      organization_id: activeOrgId,
    };
    
    let error;

    if (selectedFund) {
      const { error: updateError } = await supabase.from('funds').update(dataToSave).eq('id', selectedFund.id).select().single();
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('funds').insert(dataToSave).select().single();
      error = insertError;
    }
    
    if (error) {
        toast({ variant: "destructive", title: `Error ${selectedFund ? 'updating' : 'creating'} fund`, description: error.message });
    } else {
        await fetchDataForOrg(activeOrgId);
        toast({ title: "Success", description: `Fund ${selectedFund ? 'updated' : 'added'} successfully.` });
    }

    setIsFormOpen(false);
    setSelectedFund(null);
  };
  
  if (loadingData) {
      return (
          <div className="flex items-center justify-center h-full">
              <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
          </div>
      );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">Fund Accounting</h1>
        <Button onClick={handleAddNew} className="bg-gradient-to-r from-emerald-500 to-green-600">
          <Plus className="w-4 h-4 mr-2" />
          Add New Fund
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">Fund Name</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider text-right">Balance</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {funds.map((fund, index) => (
                <motion.tr
                  key={fund.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-medium text-gray-900">{fund.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-600 text-sm max-w-md">{fund.description}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <p className="font-mono text-gray-800">${parseFloat(fund.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(fund)}>
                        <Edit className="w-4 h-4 text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(fund)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {funds.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-gray-500">
                    No funds found. Get started by adding a new fund.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
      <FundForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleSave}
        fund={selectedFund}
        accounts={accounts}
      />
      <DeleteConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        itemName={fundToDelete?.name}
        itemType="fund"
      />
    </div>
  );
}