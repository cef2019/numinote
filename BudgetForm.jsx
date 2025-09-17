import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { flattenAccounts, calculateSpent } from './budget-form/utils';
import BudgetFormHeader from './budget-form/BudgetFormHeader';
import BudgetFormFields from './budget-form/BudgetFormFields';
import BudgetLineItems from './budget-form/BudgetLineItems';
import BudgetSummary from './budget-form/BudgetSummary';
import BudgetFormActions from './budget-form/BudgetFormActions';

export default function BudgetForm({ onSave, onCancel, budget, accounts, transactions, projects }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    fiscalYear: new Date().getFullYear().toString(),
    lineItems: [{ accountId: '', amount: '' }],
    projectId: '',
  });

  const accountOptions = useMemo(() => flattenAccounts(accounts), [accounts]);

  useEffect(() => {
    if (budget) {
      setFormData({
        id: budget.id,
        name: budget.name,
        fiscalYear: budget.fiscalYear,
        lineItems: budget.lineItems.map(item => ({
          accountId: item.accountId.toString(),
          amount: item.amount.toString(),
        })),
        projectId: budget.projectId ? String(budget.projectId) : '',
      });
    } else {
      setFormData({
        name: '',
        fiscalYear: new Date().getFullYear().toString(),
        lineItems: [{ accountId: '', amount: '' }],
        projectId: '',
      });
    }
  }, [budget]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLineItemChange = (index, field, value) => {
    const newLineItems = [...formData.lineItems];
    newLineItems[index][field] = value;
    setFormData(prev => ({ ...prev, lineItems: newLineItems }));
  };

  const addLineItem = () => {
    setFormData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { accountId: '', amount: '' }],
    }));
  };

  const removeLineItem = (index) => {
    if (formData.lineItems.length <= 1) return;
    const newLineItems = formData.lineItems.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, lineItems: newLineItems }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.fiscalYear) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide a budget name and fiscal year.",
      });
      return;
    }

    const finalLineItems = formData.lineItems
      .filter(item => item.accountId && item.amount && parseFloat(item.amount) >= 0)
      .map(item => ({
        accountId: parseInt(item.accountId, 10),
        amount: parseFloat(item.amount),
        accountName: accountOptions.find(a => a.id.toString() === item.accountId)?.name || 'N/A',
      }));

    if (finalLineItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please add at least one valid budget line item.",
      });
      return;
    }

    onSave({
      ...formData,
      id: budget?.id,
      lineItems: finalLineItems,
      projectId: formData.projectId && formData.projectId !== 'none' ? parseInt(formData.projectId, 10) : null,
    });
    toast({
      title: "✅ Success!",
      description: `Budget has been ${budget ? 'updated' : 'created'}.`,
    });
    onCancel();
  };

  const totalBudget = useMemo(() => {
    return formData.lineItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  }, [formData.lineItems]);

  const totalSpent = useMemo(() => {
    const relevantTransactions = formData.projectId
      ? transactions.filter(t => t.projectId === parseInt(formData.projectId, 10))
      : transactions;
    return formData.lineItems.reduce((sum, item) => sum + calculateSpent(item.accountId, relevantTransactions), 0);
  }, [formData.lineItems, formData.projectId, transactions]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
    >
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] flex flex-col">
        <BudgetFormHeader budget={budget} onCancel={onCancel} />

        <form onSubmit={handleSubmit} className="flex-grow overflow-hidden flex flex-col">
          <BudgetFormFields formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} projects={projects} />
          
          <BudgetLineItems
            formData={formData}
            handleLineItemChange={handleLineItemChange}
            addLineItem={addLineItem}
            removeLineItem={removeLineItem}
            accountOptions={accountOptions}
            transactions={transactions}
            projectId={formData.projectId ? parseInt(formData.projectId, 10) : null}
          />

          <BudgetSummary totalBudget={totalBudget} totalSpent={totalSpent} />

          <BudgetFormActions onCancel={onCancel} budget={budget} />
        </form>
      </div>
    </motion.div>
  );
}