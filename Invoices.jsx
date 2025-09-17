import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import InvoiceForm from '@/components/finance/InvoiceForm';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';

const InvoiceRow = ({ invoice, onEdit, onDelete, projects }) => {
  const getStatusChip = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Sent':
        return 'bg-blue-100 text-blue-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const projectName = projects.find(p => p.id === invoice.project_id)?.name;

  return (
    <motion.tr
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="hover:bg-gray-50 group"
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.invoice_number}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.customer_name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.date}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.due_date}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-800">${(invoice.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{projectName || 'N/A'}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusChip(invoice.status)}`}>
          {invoice.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" onClick={() => onEdit(invoice)}><Edit className="w-4 h-4 text-gray-500" /></Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(invoice)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
        </div>
      </td>
    </motion.tr>
  );
};

export default function Invoices() {
  const { invoices, accounts, projects, activeOrgId, fetchDataForOrg } = useOutletContext();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);

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
    setSelectedInvoice(null);
    setIsFormOpen(true);
  };

  const handleEdit = (invoice) => {
    setSelectedInvoice(invoice);
    setIsFormOpen(true);
  };

  const handleDelete = (invoice) => {
    setInvoiceToDelete(invoice);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!invoiceToDelete) return;
    const { error } = await supabase.from('invoices').delete().eq('id', invoiceToDelete.id);
    if (error) {
      toast({ variant: 'destructive', title: 'Error deleting invoice', description: error.message });
    } else {
      await fetchDataForOrg(activeOrgId);
      toast({ title: "Success", description: "Invoice deleted successfully." });
    }
    setIsConfirmOpen(false);
    setInvoiceToDelete(null);
  };

  const handleSave = async (invoiceData) => {
    const wasPaid = selectedInvoice && selectedInvoice.status === 'Paid';
    const isNowPaid = invoiceData.status === 'Paid';

    const dataToSave = {
      ...invoiceData,
      organization_id: activeOrgId,
    };

    if (selectedInvoice) {
      const { error } = await supabase.from('invoices').update(dataToSave).eq('id', selectedInvoice.id);
      if (error) {
        toast({ variant: "destructive", title: "Error updating invoice", description: error.message });
        return;
      }
      toast({ title: "Success", description: "Invoice updated successfully." });
    } else {
      const { error } = await supabase.from('invoices').insert(dataToSave);
      if (error) {
        toast({ variant: "destructive", title: "Error creating invoice", description: error.message });
        return;
      }
      toast({ title: "Success", description: "Invoice added successfully." });
    }
    
    if (!wasPaid && isNowPaid) {
      if (!dataToSave.deposit_account_id) {
        toast({ variant: 'destructive', title: "Missing Account", description: "Please select a deposit account to log payment." });
        return;
      }
      
      const transactionData = {
        date: dataToSave.date,
        description: `Invoice ${dataToSave.invoice_number} payment from ${dataToSave.customer_name}`,
        account_id: dataToSave.deposit_account_id,
        type: 'Income',
        amount: dataToSave.amount,
        notes: `Payment for invoice #${dataToSave.invoice_number}`,
        project_id: dataToSave.project_id,
        organization_id: activeOrgId
      };
      const { error: transError } = await supabase.from('transactions').insert(transactionData);
      if(transError) {
        toast({ variant: "destructive", title: "Transaction Creation Failed", description: transError.message });
      } else {
        toast({ title: "Transaction Created", description: `Income transaction created for invoice ${dataToSave.invoice_number}.` });
      }
    }
    
    await fetchDataForOrg(activeOrgId);
    setIsFormOpen(false);
    setSelectedInvoice(null);
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">Invoices</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => handleFeatureClick('Import Invoices')}>
            <Upload className="w-4 h-4 mr-2" /> Import
          </Button>
          <Button variant="outline" onClick={() => handleFeatureClick('Export Invoices')}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button onClick={handleAddNew}>
            <Plus className="w-4 h-4 mr-2" /> Create Invoice
          </Button>
        </div>
      </motion.div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map(invoice => (
              <InvoiceRow key={invoice.id} invoice={invoice} onEdit={handleEdit} onDelete={handleDelete} projects={projects} />
            ))}
          </tbody>
        </table>
      </div>

      <InvoiceForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleSave}
        invoice={selectedInvoice}
        accounts={accounts}
        projects={projects}
      />
      <DeleteConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        itemName={invoiceToDelete?.invoice_number}
        itemType="invoice"
      />
    </div>
  );
}