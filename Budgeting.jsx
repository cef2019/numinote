import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Copy, Upload, Download, List, LayoutGrid, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import BudgetForm from '@/components/finance/BudgetForm';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { supabase } from '@/lib/customSupabaseClient';
import { useOutletContext } from 'react-router-dom';

const calculateBudgetPerformance = (budget, transactions) => {
  const relevantTransactions = budget.project_id
    ? (transactions || []).filter(t => t.project_id === budget.project_id)
    : (transactions || []);

  const totalBudget = (budget.line_items || []).reduce((sum, item) => sum + (item.amount || 0), 0);
  const spent = (budget.line_items || []).reduce((sum, item) => {
    const itemSpent = relevantTransactions
      .filter(t => t.account_id === item.account_id && t.type === 'Expense')
      .reduce((s, t) => s + (t.amount || 0), 0);
    return sum + itemSpent;
  }, 0);
  const remaining = totalBudget - spent;
  const percentageSpent = totalBudget > 0 ? (spent / totalBudget) * 100 : 0;
  return { totalBudget, spent, remaining, percentageSpent };
};

const BudgetCard = ({ budget, onEdit, onDelete, onClone, onReport, performance }) => {
  const { totalBudget, spent, remaining, percentageSpent } = performance;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 group flex flex-col"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{budget.name}</h3>
          <p className="text-sm text-gray-500">Fiscal Year: {budget.fiscal_year}</p>
        </div>
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" title="Generate Report" onClick={() => onReport(budget)}><FileText className="w-4 h-4 text-green-500" /></Button>
          <Button variant="ghost" size="icon" title="Clone Budget" onClick={() => onClone(budget)}><Copy className="w-4 h-4 text-green-500" /></Button>
          <Button variant="ghost" size="icon" title="Edit Budget" onClick={() => onEdit(budget)}><Edit className="w-4 h-4 text-gray-500" /></Button>
          <Button variant="ghost" size="icon" title="Delete Budget" onClick={() => onDelete(budget)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
        </div>
      </div>
      <div className="mt-4 flex-grow">
        <div className="flex justify-between items-baseline">
          <span className="text-gray-600">Total Budget</span>
          <span className="text-2xl font-bold text-primary">${totalBudget.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 h-2.5 rounded-full" style={{ width: `${Math.min(percentageSpent, 100)}%` }}></div>
        </div>
        <div className="mt-2 text-xs text-right text-gray-500">{percentageSpent.toFixed(1)}% Used</div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div><span className="font-semibold">Spent:</span> <span className="text-red-600">${spent.toLocaleString()}</span></div>
        <div><span className="font-semibold">Remaining:</span> <span className="text-green-600">${remaining.toLocaleString()}</span></div>
      </div>
    </motion.div>
  );
};

const BudgetListItem = ({ budget, onEdit, onDelete, onClone, onReport, performance }) => {
  const { totalBudget, spent, remaining, percentageSpent } = performance;
  return (
    <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-gray-50 group">
      <td className="px-4 py-3 font-medium text-gray-800">{budget.name}</td>
      <td className="px-4 py-3 text-gray-600">{budget.fiscal_year}</td>
      <td className="px-4 py-3 font-mono text-primary">${totalBudget.toLocaleString()}</td>
      <td className="px-4 py-3 font-mono text-red-600">${spent.toLocaleString()}</td>
      <td className="px-4 py-3 font-mono text-green-600">${remaining.toLocaleString()}</td>
      <td className="px-4 py-3">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 h-2.5 rounded-full" style={{ width: `${Math.min(percentageSpent, 100)}%` }}></div>
        </div>
        <span className="text-xs text-gray-500">{percentageSpent.toFixed(1)}%</span>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" title="Generate Report" onClick={() => onReport(budget)}><FileText className="w-4 h-4 text-green-500" /></Button>
          <Button variant="ghost" size="icon" title="Clone Budget" onClick={() => onClone(budget)}><Copy className="w-4 h-4 text-green-500" /></Button>
          <Button variant="ghost" size="icon" title="Edit Budget" onClick={() => onEdit(budget)}><Edit className="w-4 h-4 text-gray-500" /></Button>
          <Button variant="ghost" size="icon" title="Delete Budget" onClick={() => onDelete(budget)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
        </div>
      </td>
    </motion.tr>
  );
};

export default function Budgeting() {
  const { budgets = [], accounts, transactions, projects, activeOrgId, fetchDataForOrg } = useOutletContext();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [budgetToDelete, setBudgetToDelete] = useState(null);
  const [viewMode, setViewMode] = useState('card');
  const fileInputRef = useRef(null);

  const budgetPerformances = useMemo(() => {
    return (budgets || []).map(budget => ({
      id: budget.id,
      performance: calculateBudgetPerformance(budget, transactions)
    }));
  }, [budgets, transactions]);

  const getPerformance = (budgetId) => {
    return budgetPerformances.find(p => p.id === budgetId)?.performance || { totalBudget: 0, spent: 0, remaining: 0, percentageSpent: 0 };
  };

  const handleAddNew = () => {
    setSelectedBudget(null);
    setIsFormOpen(true);
  };

  const handleEdit = (budget) => {
    setSelectedBudget(budget);
    setIsFormOpen(true);
  };

  const handleClone = (budget) => {
    const clonedBudget = { ...budget };
    delete clonedBudget.id;
    clonedBudget.name = `${budget.name} (Copy)`;
    setSelectedBudget(clonedBudget);
    setIsFormOpen(true);
  };

  const handleDelete = (budget) => {
    setBudgetToDelete(budget);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!budgetToDelete) return;
    const { error } = await supabase.from('budgets').delete().eq('id', budgetToDelete.id);
    if (error) {
      toast({ variant: 'destructive', title: 'Error deleting budget', description: error.message });
    } else {
      await fetchDataForOrg(activeOrgId);
      toast({ title: "Success", description: "Budget deleted successfully." });
    }
    setIsConfirmOpen(false);
    setBudgetToDelete(null);
  };

  const handleSave = async (budgetData) => {
    const dataToSave = {
      organization_id: activeOrgId,
      name: budgetData.name,
      fiscal_year: budgetData.fiscalYear,
      project_id: budgetData.projectId,
    };

    let budgetId;
    let error;

    if (budgetData.id) {
        budgetId = budgetData.id;
        const { error: updateError } = await supabase.from('budgets').update(dataToSave).eq('id', budgetId);
        error = updateError;
    } else {
        const { data: newBudget, error: insertError } = await supabase.from('budgets').insert(dataToSave).select().single();
        error = insertError;
        if (newBudget) budgetId = newBudget.id;
    }
    
    if(error || !budgetId) {
        toast({ variant: "destructive", title: `Error ${budgetData.id ? 'updating' : 'creating'} budget`, description: error?.message || "Could not retrieve budget ID" });
        return;
    }

    const { error: deleteError } = await supabase.from('budget_line_items').delete().eq('budget_id', budgetId);
    if (deleteError) {
        toast({ variant: "destructive", title: 'Error updating budget lines', description: deleteError.message });
        return;
    }

    if (budgetData.lineItems && budgetData.lineItems.length > 0) {
        const linesToInsert = budgetData.lineItems.map(line => ({
            budget_id: budgetId,
            account_id: line.accountId,
            amount: line.amount,
        }));
        const { error: insertLinesError } = await supabase.from('budget_line_items').insert(linesToInsert);
        if (insertLinesError) {
            toast({ variant: "destructive", title: 'Error saving budget lines', description: insertLinesError.message });
            return;
        }
    }
    
    await fetchDataForOrg(activeOrgId);
    toast({ title: "Success", description: `Budget ${budgetData.id ? 'updated' : 'created'} successfully.` });
    setIsFormOpen(false);
    setSelectedBudget(null);
  };
  
  const handleGenerateReport = (budget) => {
    toast({
      title: "🚧 Feature Coming Soon!",
      description: "Report generation isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const handleExport = () => {
    toast({
      title: "🚧 Feature Coming Soon!",
      description: "Export isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileImport = (event) => {
    toast({
      title: "🚧 Feature Coming Soon!",
      description: "Import isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
    event.target.value = null; // Reset file input
  };

  const downloadTemplate = () => {
    toast({
      title: "🚧 Feature Coming Soon!",
      description: "Template download isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };


  return (
    <div className="p-4 md:p-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Budget Management</h1>
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          <input type="file" ref={fileInputRef} onChange={handleFileImport} accept=".csv" className="hidden" />
          <Button variant="outline" onClick={handleImportClick}><Upload className="w-4 h-4 mr-2" /> Import</Button>
          <Button variant="outline" onClick={handleExport}><Download className="w-4 h-4 mr-2" /> Export</Button>
          <Button variant="link" onClick={downloadTemplate}>Download Template</Button>
          <div className="p-1 bg-gray-200 rounded-lg flex items-center">
            <Button size="sm" variant={viewMode === 'card' ? 'secondary' : 'ghost'} onClick={() => setViewMode('card')}><LayoutGrid className="w-4 h-4" /></Button>
            <Button size="sm" variant={viewMode === 'list' ? 'secondary' : 'ghost'} onClick={() => setViewMode('list')}><List className="w-4 h-4" /></Button>
          </div>
          <Button onClick={handleAddNew}><Plus className="w-4 h-4 mr-2" /> New Budget</Button>
        </div>
      </motion.div>

      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {(budgets || []).map(budget => (
              <BudgetCard key={budget.id} budget={budget} onEdit={handleEdit} onDelete={handleDelete} onClone={handleClone} onReport={handleGenerateReport} performance={getPerformance(budget.id)} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spent</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                <th className="relative px-4 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {(budgets || []).map(budget => (
                  <BudgetListItem key={budget.id} budget={budget} onEdit={handleEdit} onDelete={handleDelete} onClone={handleClone} onReport={handleGenerateReport} performance={getPerformance(budget.id)} />
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {isFormOpen && (
          <BudgetForm onSave={handleSave} onCancel={() => setIsFormOpen(false)} budget={selectedBudget} accounts={accounts} transactions={transactions} projects={projects} />
        )}
      </AnimatePresence>

      <DeleteConfirmationDialog isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={confirmDelete} itemName={budgetToDelete?.name} itemType="budget" />
    </div>
  );
}