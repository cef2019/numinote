import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import BillForm from '@/components/finance/BillForm';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';

const BillRow = ({ bill, onEdit, onDelete, projects, accounts }) => {
  const getStatusChip = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Open':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const projectName = projects.find(p => p.id === bill.project_id)?.name;

  return (
    <motion.tr
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="hover:bg-gray-50 group"
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bill.vendor_name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bill.date}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bill.due_date}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-800">${(bill.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{projectName || 'N/A'}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusChip(bill.status)}`}>
          {bill.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" onClick={() => onEdit(bill)}><Edit className="w-4 h-4 text-gray-500" /></Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(bill)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
        </div>
      </td>
    </motion.tr>
  );
};

export default function Bills() {
  const { bills, accounts, projects, activeOrgId, fetchDataForOrg } = useOutletContext();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [billToDelete, setBillToDelete] = useState(null);

  useEffect(() => {
    if (location.state?.openForm) {
      handleAddNew();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  const handleFeatureClick = (feature) => {
    toast({
      title: "🚧 Feature Coming Soon!",
      description: `${feature} isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀`,
    });
  };

  const handleAddNew = () => {
    setSelectedBill(null);
    setIsFormOpen(true);
  };

  const handleEdit = (bill) => {
    setSelectedBill(bill);
    setIsFormOpen(true);
  };

  const handleDelete = (bill) => {
    setBillToDelete(bill);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!billToDelete) return;
    const { error } = await supabase.from('bills').delete().eq('id', billToDelete.id);
    if (error) {
      toast({ variant: 'destructive', title: 'Error deleting bill', description: error.message });
    } else {
      await fetchDataForOrg(activeOrgId);
      toast({ title: "Success", description: "Bill deleted successfully." });
    }
    setIsConfirmOpen(false);
    setBillToDelete(null);
  };

  const handleSave = async (billData) => {
    const wasPaid = selectedBill && selectedBill.status === 'Paid';
    const isNowPaid = billData.status === 'Paid';

    const dataToSave = {
      ...billData,
      organization_id: activeOrgId,
    };

    if (selectedBill) {
      const { error } = await supabase.from('bills').update(dataToSave).eq('id', selectedBill.id);
      if (error) {
        toast({ variant: "destructive", title: "Error updating bill", description: error.message });
        return;
      }
      toast({ title: "Success", description: "Bill updated successfully." });
    } else {
      const { error } = await supabase.from('bills').insert(dataToSave).select().single();
      if (error) {
        toast({ variant: "destructive", title: "Error adding bill", description: error.message });
        return;
      }
      toast({ title: "Success", description: "Bill added successfully." });
    }

    if (!wasPaid && isNowPaid) {
      if (!dataToSave.expense_account_id) {
        toast({
          variant: 'destructive',
          title: "Missing Account",
          description: "Please select an expense account for this bill to create a transaction.",
        });
        return;
      }
      const transactionData = {
        date: dataToSave.date,
        description: `Bill payment to ${dataToSave.vendor_name}`,
        account_id: dataToSave.expense_account_id,
        type: 'Expense',
        amount: dataToSave.amount,
        notes: `Paid bill for ${dataToSave.vendor_name}`,
        project_id: dataToSave.project_id,
        organization_id: activeOrgId,
      };
      const { error: transError } = await supabase.from('transactions').insert(transactionData);
      if (transError) {
        toast({ variant: "destructive", title: "Transaction Creation Failed", description: transError.message });
      } else {
        toast({
          title: "Transaction Created",
          description: `An expense transaction has been created for the bill from ${dataToSave.vendor_name}.`
        });
      }
    }
    await fetchDataForOrg(activeOrgId);
    setSelectedBill(null);
    setIsFormOpen(false);
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">Bills</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => handleFeatureClick('Import Bills')}>
            <Upload className="w-4 h-4 mr-2" /> Import
          </Button>
          <Button variant="outline" onClick={() => handleFeatureClick('Export Bills')}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button onClick={handleAddNew}>
            <Plus className="w-4 h-4 mr-2" /> Record Bill
          </Button>
        </div>
      </motion.div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bills.map(bill => (
              <BillRow key={bill.id} bill={bill} onEdit={handleEdit} onDelete={handleDelete} projects={projects} accounts={accounts} />
            ))}
          </tbody>
        </table>
      </div>

      <BillForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleSave}
        bill={selectedBill}
        accounts={accounts}
        projects={projects}
      />
      <DeleteConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        itemName={`bill from ${billToDelete?.vendor_name}`}
        itemType="bill"
      />
    </div>
  );
}