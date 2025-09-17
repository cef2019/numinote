import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import JournalEntryForm from '@/components/finance/JournalEntryForm';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';

const JournalEntryCard = ({ entry, onEdit, onDelete, projects, accounts }) => {
  const safeEntries = Array.isArray(entry.entries) ? entry.entries : [];
  
  const getAccountName = (accountId) => {
    const account = accounts.find(a => a.id === accountId);
    return account ? `${account.code} - ${account.name}` : 'Unknown Account';
  };

  const totalDebits = safeEntries.reduce((sum, item) => sum + (Number(item.debit) || 0), 0);
  const totalCredits = safeEntries.reduce((sum, item) => sum + (Number(item.credit) || 0), 0);
  const projectName = projects.find(p => p.id === entry.project_id)?.name;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 group"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{entry.date} | Ref: {entry.reference}</p>
          <p className="font-medium text-gray-800 mt-1">{entry.memo}</p>
          {projectName && <p className="text-xs text-primary mt-1">Project: {projectName}</p>}
        </div>
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" onClick={() => onEdit(entry)}><Edit className="w-4 h-4 text-gray-500" /></Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(entry)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
        </div>
      </div>
      <div className="mt-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left font-semibold text-gray-600 pb-2">Account</th>
              <th className="text-right font-semibold text-gray-600 pb-2">Debit</th>
              <th className="text-right font-semibold text-gray-600 pb-2">Credit</th>
            </tr>
          </thead>
          <tbody>
            {safeEntries.map((line, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-2">{getAccountName(line.account_id)}</td>
                <td className="text-right font-mono">{line.debit ? `$${Number(line.debit).toFixed(2)}` : ''}</td>
                <td className="text-right font-mono">{line.credit ? `$${Number(line.credit).toFixed(2)}` : ''}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-bold">
              <td className="pt-2">Total</td>
              <td className="text-right pt-2 font-mono">${totalDebits.toFixed(2)}</td>
              <td className="text-right pt-2 font-mono">${totalCredits.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </motion.div>
  );
};

export default function JournalEntries({ journalEntries = [], setJournalEntries, accounts, projects, activeOrgId }) {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [entryToDelete, setEntryToDelete] = useState(null);

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
    setSelectedEntry(null);
    setIsFormOpen(true);
  };

  const handleEdit = (entry) => {
    setSelectedEntry(entry);
    setIsFormOpen(true);
  };

  const handleDelete = (entry) => {
    setEntryToDelete(entry);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!entryToDelete) return;
    const { error } = await supabase.from('journal_entries').delete().eq('id', entryToDelete.id);
    if (error) {
      toast({ variant: 'destructive', title: 'Error deleting entry', description: error.message });
    } else {
      setJournalEntries(journalEntries.filter(je => je.id !== entryToDelete.id));
      toast({ title: "Success", description: "Journal Entry deleted successfully." });
    }
    setIsConfirmOpen(false);
    setEntryToDelete(null);
  };

  const handleSave = async (entryData) => {
    const lines = entryData.entries;
    delete entryData.entries;

    const entryToSave = {
      ...entryData,
      organization_id: activeOrgId,
    };
    
    let entryId;
    if (selectedEntry) {
      entryId = selectedEntry.id;
      delete entryToSave.id;
      const { data, error } = await supabase.from('journal_entries').update(entryToSave).eq('id', entryId).select().single();
      if (error) {
        toast({ variant: "destructive", title: "Error updating entry", description: error.message });
        return;
      }
    } else {
      const { data, error } = await supabase.from('journal_entries').insert(entryToSave).select().single();
      if (error) {
        toast({ variant: "destructive", title: "Error creating entry", description: error.message });
        return;
      }
      entryId = data.id;
    }

    await supabase.from('journal_entry_lines').delete().eq('journal_entry_id', entryId);
    
    const linesToSave = lines.map(line => ({ ...line, journal_entry_id: entryId }));
    const { error: linesError } = await supabase.from('journal_entry_lines').insert(linesToSave);

    if (linesError) {
      toast({ variant: "destructive", title: "Error saving entry lines", description: linesError.message });
      if (!selectedEntry) {
        await supabase.from('journal_entries').delete().eq('id', entryId); // Rollback
      }
    } else {
      toast({ title: "Success", description: `Journal Entry ${selectedEntry ? 'updated' : 'added'} successfully.` });
    }

    setIsFormOpen(false);
    setSelectedEntry(null);
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">Journal Entries</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => handleFeatureClick('Import Entries')}>
            <Upload className="w-4 h-4 mr-2" /> Import
          </Button>
          <Button variant="outline" onClick={() => handleFeatureClick('Export Entries')}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button onClick={handleAddNew}>
            <Plus className="w-4 h-4 mr-2" /> New Journal Entry
          </Button>
        </div>
      </motion.div>

      <div>
        {journalEntries.map(entry => (
          <JournalEntryCard key={entry.id} entry={entry} onEdit={handleEdit} onDelete={handleDelete} projects={projects} accounts={accounts} />
        ))}
      </div>

      <JournalEntryForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleSave}
        journalEntry={selectedEntry}
        accounts={accounts}
        projects={projects}
      />
      <DeleteConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        itemName={`Journal Entry ${entryToDelete?.reference}`}
        itemType="journal entry"
      />
    </div>
  );
}