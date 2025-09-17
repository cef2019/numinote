import React, { useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Download, Upload, ArrowRightLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import NewTransactionForm from '@/components/NewTransactionForm';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import TransferForm from '@/components/finance/TransferForm';
import { supabase } from '@/lib/customSupabaseClient';
import { useOutletContext } from 'react-router-dom';
import Papa from 'papaparse';

const TransactionRow = ({ transaction, onEdit, onDelete, accountName, projectName, fromAccountName, toAccountName }) => {
  const isTransfer = transaction.type === 'Transfer';
  
  const description = isTransfer 
    ? <>
        <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
        <div className="text-sm text-gray-500">From: {fromAccountName} <ArrowRightLeft className="inline-block w-3 h-3 mx-1"/> To: {toAccountName}</div>
      </>
    : <>
        <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
        <div className="text-sm text-gray-500">{accountName}</div>
        {projectName && <div className="text-xs text-primary mt-1">Project: {projectName}</div>}
      </>;

  const getAmountColor = (type) => {
    switch (type) {
      case 'Income':
        return 'text-green-600';
      case 'Expense':
        return 'text-red-600';
      case 'Asset':
        return 'text-blue-600';
      case 'Liability':
        return 'text-orange-600';
      default:
        return 'text-gray-700';
    }
  };

  const amountDisplay = isTransfer
    ? <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">
        ${(transaction.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </td>
    : <td className={`px-6 py-4 whitespace-nowrap text-sm font-mono ${getAmountColor(transaction.type)}`}>
        {transaction.type === 'Income' ? '+' : '-'}${(transaction.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </td>;

  return (
    <motion.tr
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="hover:bg-gray-50 group"
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        {description}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 ${getAmountColor(transaction.type)}`}>
          {transaction.type}
        </span>
      </td>
      {amountDisplay}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isTransfer && <Button variant="ghost" size="icon" onClick={() => onEdit(transaction)}><Edit className="w-4 h-4 text-gray-500" /></Button>}
          <Button variant="ghost" size="icon" onClick={() => onDelete(transaction)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
        </div>
      </td>
    </motion.tr>
  );
};

export default function Transactions() {
  const { transactions, accounts, projects, activeOrgId, fetchDataForOrg } = useOutletContext();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTransferFormOpen, setIsTransferFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef(null);

  const accountsMap = useMemo(() => new Map(accounts.map(acc => [acc.id, `${acc.code} - ${acc.name}`])), [accounts]);
  const accountCodeMap = useMemo(() => new Map(accounts.map(acc => [acc.code, acc.id])), [accounts]);
  const projectsMap = useMemo(() => new Map(projects.map(proj => [proj.id, proj.name])), [projects]);
  const projectNameMap = useMemo(() => new Map(projects.map(proj => [proj.name, proj.id])), [projects]);

  const handleExport = () => {
    const dataToExport = transactions.map(t => ({
      date: t.date,
      description: t.description,
      type: t.type,
      amount: t.amount,
      account_code: accounts.find(a => a.id === t.account_id)?.code || '',
      project_name: projectsMap.get(t.project_id) || '',
      notes: t.notes,
    }));
    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `transactions_${activeOrgId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Success", description: "Transactions exported." });
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsImporting(true);
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const { data, errors } = results;
          if (errors.length > 0) {
            toast({ variant: 'destructive', title: 'Import Error', description: `Error parsing CSV on row ${errors[0].row}: ${errors[0].message}` });
            setIsImporting(false);
            return;
          }

          try {
            const transactionsToInsert = data.map(row => {
              const account_id = accountCodeMap.get(row.account_code);
              if (!account_id) {
                throw new Error(`Invalid account code "${row.account_code}" found in import file.`);
              }
              return {
                organization_id: activeOrgId,
                date: row.date,
                description: row.description,
                type: row.type,
                amount: parseFloat(row.amount),
                account_id,
                project_id: projectNameMap.get(row.project_name) || null,
                notes: row.notes,
              };
            });

            const { error } = await supabase.from('transactions').insert(transactionsToInsert);
            if (error) throw error;

            await fetchDataForOrg(activeOrgId);
            toast({ title: "Import Successful", description: `${data.length} transactions have been imported.` });
          } catch (error) {
            toast({ variant: 'destructive', title: 'Import Failed', description: error.message, duration: 7000 });
          } finally {
            setIsImporting(false);
            if (fileInputRef.current) fileInputRef.current.value = null;
          }
        },
      });
    }
  };

  const downloadTemplate = () => {
    const templateData = [{
      date: 'YYYY-MM-DD',
      description: 'Sample Expense',
      type: 'Expense',
      amount: '100.00',
      account_code: '5000',
      project_name: 'Community Outreach Program Q3',
      notes: 'This is an optional note.'
    }];
    const csv = Papa.unparse(templateData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'transactions_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddNew = () => {
    setSelectedTransaction(null);
    setIsFormOpen(true);
  };

  const handleNewTransfer = () => {
    setIsTransferFormOpen(true);
  };

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleDelete = (transaction) => {
    setTransactionToDelete(transaction);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!transactionToDelete) return;
    const { error } = await supabase.from('transactions').delete().eq('id', transactionToDelete.id);
    if (error) {
      toast({ variant: "destructive", title: "Error deleting transaction", description: error.message });
    } else {
      await fetchDataForOrg(activeOrgId);
      toast({ title: "Success", description: "Transaction deleted successfully." });
    }
    setIsConfirmOpen(false);
    setTransactionToDelete(null);
  };

  const handleSave = async (transactionData) => {
    const dataToSave = {
      organization_id: activeOrgId,
      date: transactionData.date,
      description: transactionData.description,
      account_id: transactionData.account_id,
      type: transactionData.type,
      amount: transactionData.amount,
      notes: transactionData.notes,
      project_id: transactionData.project_id,
    };

    let error;
    if (selectedTransaction) {
      const { error: updateError } = await supabase.from('transactions').update(dataToSave).eq('id', selectedTransaction.id);
       error = updateError;
    } else {
      const { error: insertError } = await supabase.from('transactions').insert(dataToSave);
      error = insertError;
    }

    if (error) {
        toast({ variant: "destructive", title: `Error ${selectedTransaction ? 'updating' : 'creating'} transaction`, description: error.message });
    } else {
        await fetchDataForOrg(activeOrgId);
        toast({ title: "Success", description: `Transaction ${selectedTransaction ? 'updated' : 'created'} successfully.` });
    }
    
    setIsFormOpen(false);
    setSelectedTransaction(null);
  };

  const handleSaveTransfer = async (transferData) => {
    const { fromAccountId, toAccountId, amount, date, notes } = transferData;
    const fromAccountName = accountsMap.get(fromAccountId);
    const toAccountName = accountsMap.get(toAccountId);
    
    const transactionsToCreate = [
      {
        organization_id: activeOrgId,
        date,
        description: `Transfer to ${toAccountName}`,
        account_id: fromAccountId,
        type: 'Transfer',
        amount,
        notes
      },
      {
        organization_id: activeOrgId,
        date,
        description: `Transfer from ${fromAccountName}`,
        account_id: toAccountId,
        type: 'Transfer',
        amount,
        notes
      }
    ];

    const { error } = await supabase.from('transactions').insert(transactionsToCreate);

    if (error) {
        toast({ variant: "destructive", title: "Error creating transfer", description: error.message });
    } else {
        await fetchDataForOrg(activeOrgId);
        toast({ title: "Success", description: "Transfer created successfully." });
    }

    setIsTransferFormOpen(false);
  };

  return (
    <div className="p-4 md:p-0">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4"
      >
        <div className="flex-grow">
          <h1 className="text-3xl font-bold text-gray-800">Transactions</h1>
          <div className="text-sm text-gray-500 mt-1">
            Need help with importing?{' '}
            <Button variant="link" className="p-0 h-auto" onClick={downloadTemplate}>Download our CSV template.</Button>
          </div>
        </div>
        <div className="flex flex-wrap justify-center sm:justify-end gap-2">
          <input type="file" ref={fileInputRef} onChange={handleFileImport} className="hidden" accept=".csv" />
          <Button variant="outline" onClick={handleImportClick} disabled={isImporting}>
            {isImporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
            Import
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
           <Button onClick={handleNewTransfer} variant="outline" className="text-primary border-primary hover:bg-primary/10 hover:text-primary">
            <ArrowRightLeft className="w-4 h-4 mr-2" /> New Transfer
          </Button>
          <Button onClick={handleAddNew}>
            <Plus className="w-4 h-4 mr-2" /> New Transaction
          </Button>
        </div>
      </motion.div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description / Account</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.sort((a, b) => new Date(b.date) - new Date(a.date)).map(transaction => (
                <TransactionRow 
                  key={transaction.id} 
                  transaction={transaction} 
                  onEdit={handleEdit} 
                  onDelete={handleDelete}
                  accountName={accountsMap.get(transaction.account_id)}
                  projectName={projectsMap.get(transaction.project_id)}
                  fromAccountName={accountsMap.get(transaction.account_id)}
                  toAccountName={accountsMap.get(transaction.account_id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <NewTransactionForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleSave}
        transaction={selectedTransaction}
        accounts={accounts}
        projects={projects}
      />
      <TransferForm
        open={isTransferFormOpen}
        onOpenChange={setIsTransferFormOpen}
        onSave={handleSaveTransfer}
        accounts={accounts}
      />
      <DeleteConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        itemType="transaction"
        itemName={transactionToDelete?.description}
      />
    </div>
  );
}