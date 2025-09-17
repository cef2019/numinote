import React, { useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import AccountForm from '@/components/AccountForm';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { supabase } from '@/lib/customSupabaseClient';
import { useChartOfAccounts } from '@/hooks/useChartOfAccounts';
import ChartOfAccountsHeader from '@/components/chart-of-accounts/ChartOfAccountsHeader';
import AccountCategory from '@/components/chart-of-accounts/AccountCategory';
import { useOutletContext } from 'react-router-dom';

export default function ChartOfAccounts() {
  const { accounts: rawAccounts, activeOrgId, fetchDataForOrg } = useOutletContext();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [parentAccount, setParentAccount] = useState(null);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const fileInputRef = useRef(null);

  const {
    groupedAccounts,
    handleExport,
    handleFileImport,
    downloadTemplate,
    isImporting,
  } = useChartOfAccounts(rawAccounts, activeOrgId, fetchDataForOrg, fileInputRef);

  const handleAddNew = () => {
    setSelectedAccount(null);
    setParentAccount(null);
    setIsFormOpen(true);
  };

  const handleAddSubAccount = (parent) => {
    setSelectedAccount(null);
    setParentAccount(parent);
    setIsFormOpen(true);
  };

  const handleEdit = (account) => {
    setSelectedAccount(account);
    setParentAccount(rawAccounts.find(a => a.id === account.parent_id) || null);
    setIsFormOpen(true);
  };

  const handleDelete = (account) => {
    const findSubAccounts = (accId, allAccounts) => {
        return allAccounts.filter(a => a.parent_id === accId);
    }

    const subAccounts = findSubAccounts(account.id, rawAccounts);

    if (subAccounts && subAccounts.length > 0) {
      toast({
        variant: "destructive",
        title: "Cannot Delete",
        description: "Please delete all sub-accounts before deleting a parent account.",
      });
      return;
    }
    setAccountToDelete(account);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!accountToDelete) return;
    const { error } = await supabase.from('accounts').delete().eq('id', accountToDelete.id);
    if (error) {
      toast({ variant: "destructive", title: "Error deleting account", description: error.message });
    } else {
      await fetchDataForOrg(activeOrgId);
      toast({ title: "Success", description: "Account deleted successfully." });
    }
    setIsConfirmOpen(false);
    setAccountToDelete(null);
  };

  const handleSave = async (accountData) => {
    const dataToSave = {
      organization_id: activeOrgId,
      code: accountData.code,
      name: accountData.name,
      type: accountData.type,
      category: accountData.category,
      parent_id: accountData.parent_id,
      balance: accountData.balance,
      is_active: true,
    };

    let error;
    if (selectedAccount) {
      const { error: updateError } = await supabase.from('accounts').update(dataToSave).eq('id', selectedAccount.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('accounts').insert(dataToSave);
      error = insertError;
    }

    if (error) {
      toast({ variant: "destructive", title: `Error ${selectedAccount ? 'updating' : 'creating'} account`, description: error.message });
    } else {
      await fetchDataForOrg(activeOrgId);
      toast({ title: "Success", description: `Account ${selectedAccount ? 'updated' : 'created'} successfully.` });
    }
    
    setIsFormOpen(false);
    setSelectedAccount(null);
    setParentAccount(null);
  };

  const ACCOUNT_CATEGORIES = ['Assets', 'Liabilities', 'Net Assets', 'Revenue', 'Expenses'];
  
  const memoizedAccounts = useMemo(() => {
    const orderedGroupedAccounts = {};
    ACCOUNT_CATEGORIES.forEach(category => {
      if (groupedAccounts[category]) {
        orderedGroupedAccounts[category] = groupedAccounts[category];
      }
    });
    return orderedGroupedAccounts;
  }, [groupedAccounts]);


  return (
    <div>
      <ChartOfAccountsHeader
        onAddNew={handleAddNew}
        onExport={handleExport}
        onImportClick={() => fileInputRef.current.click()}
        onDownloadTemplate={downloadTemplate}
        isImporting={isImporting}
      />
      <input type="file" ref={fileInputRef} onChange={handleFileImport} className="hidden" accept=".csv" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
      >
        {Object.keys(memoizedAccounts).length > 0 ? (
          Object.entries(memoizedAccounts).map(([category, accountList]) => (
            <AccountCategory 
              key={category} 
              category={category} 
              accounts={accountList || []} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
              onAddSubAccount={handleAddSubAccount} 
            />
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">No accounts found. Get started by creating a new account or importing a CSV file.</p>
        )}
      </motion.div>

      <AccountForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleSave}
        account={selectedAccount}
        parentAccount={parentAccount}
        accounts={rawAccounts}
      />
      <DeleteConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        itemName={accountToDelete?.name}
        itemType="account"
      />
    </div>
  );
}