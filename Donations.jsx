import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import DonationForm from '@/components/finance/DonationForm';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';

const DonationRow = ({ donation, onEdit, onDelete, projects, funds, accounts }) => {
  const projectName = projects.find(p => p.id === donation.project_id)?.name;
  const fundName = funds.find(f => f.id === donation.fund_id)?.name;
  return (
    <motion.tr
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="hover:bg-gray-50 group"
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{donation.donor_name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donation.date}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-800">${(donation.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donation.type}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fundName || 'N/A'}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{projectName || 'N/A'}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" onClick={() => onEdit(donation)}><Edit className="w-4 h-4 text-gray-500" /></Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(donation)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
        </div>
      </td>
    </motion.tr>
  );
};

export default function Donations() {
  const { donations, accounts, funds, projects, activeOrgId, fetchDataForOrg } = useOutletContext();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [donationToDelete, setDonationToDelete] = useState(null);

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
    setSelectedDonation(null);
    setIsFormOpen(true);
  };

  const handleEdit = (donation) => {
    setSelectedDonation(donation);
    setIsFormOpen(true);
  };

  const handleDelete = (donation) => {
    setDonationToDelete(donation);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!donationToDelete) return;
    const { error } = await supabase.from('donations').delete().eq('id', donationToDelete.id);
    if (error) {
      toast({ variant: 'destructive', title: 'Error deleting donation', description: error.message });
    } else {
      await fetchDataForOrg(activeOrgId);
      toast({ title: "Success", description: "Donation deleted successfully." });
    }
    setIsConfirmOpen(false);
    setDonationToDelete(null);
  };

  const handleSave = async (donationData) => {
    const dataToSave = { ...donationData, organization_id: activeOrgId };

    if (selectedDonation) {
      const { error } = await supabase.from('donations').update(dataToSave).eq('id', selectedDonation.id);
       if (error) {
        toast({ variant: "destructive", title: "Error updating donation", description: error.message });
        return;
      }
    } else {
      const { data, error } = await supabase.from('donations').insert(dataToSave).select().single();
      if (error) {
        toast({ variant: "destructive", title: "Error adding donation", description: error.message });
        return;
      }
      if (data.account_id) {
          const transactionData = {
            date: data.date,
            description: `Donation from ${data.donor_name}`,
            account_id: data.account_id,
            type: 'Income',
            amount: data.amount,
            notes: data.notes,
            project_id: data.project_id,
            organization_id: activeOrgId,
          };
          const { error: transError } = await supabase.from('transactions').insert(transactionData);
           if (transError) {
             toast({ variant: "destructive", title: "Transaction Creation Failed", description: transError.message });
           } else {
              toast({ title: "Transaction Created", description: "Income transaction created for this donation." });
           }
      }
    }

    await fetchDataForOrg(activeOrgId);
    toast({ title: "Success", description: `Donation ${selectedDonation ? 'updated' : 'added'} successfully.` });
    setIsFormOpen(false);
    setSelectedDonation(null);
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">Donations</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => handleFeatureClick('Import Donations')}>
            <Upload className="w-4 h-4 mr-2" /> Import
          </Button>
          <Button variant="outline" onClick={() => handleFeatureClick('Export Donations')}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button onClick={handleAddNew}>
            <Plus className="w-4 h-4 mr-2" /> Log Donation
          </Button>
        </div>
      </motion.div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fund</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {donations.map(donation => (
              <DonationRow key={donation.id} donation={donation} onEdit={handleEdit} onDelete={handleDelete} projects={projects} funds={funds} accounts={accounts} />
            ))}
          </tbody>
        </table>
      </div>

      <DonationForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleSave}
        donation={selectedDonation}
        accounts={accounts}
        funds={funds}
        projects={projects}
      />
      <DeleteConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        itemName={`donation from ${donationToDelete?.donor_name}`}
        itemType="donation"
      />
    </div>
  );
}