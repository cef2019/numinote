import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/customSupabaseClient';
import AccountSelector from '@/components/AccountSelector';
import { useOutletContext } from 'react-router-dom';

const calculatePayroll = (employee) => {
  const grossPay = parseFloat(employee.gross_pay) || 0;
  const paye = grossPay * (employee.paye_rate || 0);
  const pension = grossPay * (employee.employee_pension_rate || 0);
  const otherDeductions = grossPay * (employee.other_deduction_rate || 0);
  const advanceLoan = parseFloat(employee.advance_loan) || 0;
  
  const totalDeductions = paye + pension + otherDeductions + advanceLoan;
  const netPay = grossPay - totalDeductions;
  
  const employerPension = grossPay * (employee.employer_pension_rate || 0);
  const otherTaxes = grossPay * (employee.other_taxes_rate || 0);
  const totalEmployerCost = grossPay + employerPension + otherTaxes;

  return { grossPay, paye, pension, otherDeductions, advanceLoan, totalDeductions, netPay, employerPension, otherTaxes, totalEmployerCost };
};

export default function Payroll() {
  const { employees = [], activeOrgId, fetchDataForOrg, accounts, organizationSettings } = useOutletContext();
  const { toast } = useToast();
  const [payrollDate, setPayrollDate] = useState(new Date().toISOString().split('T')[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [payrollConfig, setPayrollConfig] = useState({
    cashAccountId: null,
    payeLiabilityAccountId: null,
    pensionLiabilityAccountId: null,
    otherDeductionsLiabilityAccountId: null,
    payrollExpenseAccountId: null,
  });

  useEffect(() => {
    if (organizationSettings?.expenses?.payroll) {
        setPayrollConfig(prev => ({...prev, ...organizationSettings.expenses.payroll}));
    }
  }, [organizationSettings]);
  
  const handleConfigChange = (key, value) => {
    setPayrollConfig(prev => ({...prev, [key]: value}));
  };

  const savePayrollSettings = async () => {
    setIsSaving(true);
    try {
        const { data: currentOrgSettings, error: fetchError } = await supabase
            .from('organization_settings')
            .select('expenses')
            .eq('organization_id', activeOrgId)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
             throw fetchError;
        }

        const currentExpenses = currentOrgSettings?.expenses || {};
        
        const updatedExpenses = {
            ...currentExpenses,
            payroll: payrollConfig
        };

        const { error } = await supabase
            .from('organization_settings')
            .upsert({ 
                organization_id: activeOrgId, 
                expenses: updatedExpenses, 
                updated_at: new Date().toISOString() 
            }, { onConflict: 'organization_id' });

        if (error) throw error;

        toast({ title: 'Success', description: 'Payroll settings saved.' });
        await fetchDataForOrg(activeOrgId);
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error saving settings', description: error.message });
    } finally {
        setIsSaving(false);
    }
  };

  const payrollSummary = useMemo(() => {
    if (!employees) return [];
    return employees.map(emp => ({
      ...emp,
      payroll: calculatePayroll(emp),
    }));
  }, [employees]);

  const totals = useMemo(() => {
    const summary = { grossPay: 0, netPay: 0, paye: 0, pension: 0, otherDeductions: 0, advanceLoan: 0, employerPension: 0, otherTaxes: 0, totalEmployerCost: 0 };
    payrollSummary.forEach(emp => {
      for (const key in summary) {
        summary[key] += emp.payroll[key];
      }
    });
    return summary;
  }, [payrollSummary]);

  const runPayroll = async () => {
    const requiredAccounts = ['cashAccountId', 'payeLiabilityAccountId', 'pensionLiabilityAccountId', 'otherDeductionsLiabilityAccountId', 'payrollExpenseAccountId'];
    for(const acc of requiredAccounts) {
        if(!payrollConfig[acc]) {
            toast({
                variant: 'destructive',
                title: 'Configuration Error',
                description: 'Please select all required accounts in the Payroll Settings section before running payroll.'
            });
            return;
        }
    }
    
    setIsProcessing(true);
    try {
      const journalEntryLines = [];
      
      journalEntryLines.push({
        account_id: payrollConfig.payrollExpenseAccountId,
        debit: totals.grossPay,
        credit: 0
      });
      journalEntryLines.push({
          account_id: payrollConfig.payrollExpenseAccountId,
          debit: totals.employerPension,
          credit: 0
      });
      journalEntryLines.push({
          account_id: payrollConfig.payrollExpenseAccountId,
          debit: totals.otherTaxes,
          credit: 0
      });
      journalEntryLines.push({
        account_id: payrollConfig.cashAccountId,
        debit: 0,
        credit: totals.netPay,
      });
      journalEntryLines.push({
        account_id: payrollConfig.payeLiabilityAccountId,
        debit: 0,
        credit: totals.paye,
      });
      journalEntryLines.push({
        account_id: payrollConfig.pensionLiabilityAccountId,
        debit: 0,
        credit: totals.pension + totals.employerPension,
      });
       journalEntryLines.push({
        account_id: payrollConfig.otherDeductionsLiabilityAccountId,
        debit: 0,
        credit: totals.otherDeductions + totals.otherTaxes,
      });
      
      if (totals.advanceLoan > 0) {
         journalEntryLines.push({
            account_id: payrollConfig.cashAccountId,
            debit: 0,
            credit: totals.advanceLoan
         })
      }

      const { data: je, error: jeError } = await supabase
        .from('journal_entries')
        .insert({
          organization_id: activeOrgId,
          date: payrollDate,
          memo: `Payroll for period ending ${payrollDate}`,
          reference: `PAYROLL-${Date.now()}`
        }).select().single();
        
      if (jeError) throw jeError;
      
      const linesWithJeId = journalEntryLines
        .filter(line => line.debit > 0 || line.credit > 0)
        .map(line => ({ ...line, journal_entry_id: je.id }));

      const { error: linesError } = await supabase.from('journal_entry_lines').insert(linesWithJeId);
      if (linesError) throw linesError;
      
      const projectCostTransactions = [];
      payrollSummary.forEach(emp => {
          if (Array.isArray(emp.projectRates) && emp.projectRates.length > 0) {
              emp.projectRates.forEach(rate => {
                  const projectCost = emp.payroll.grossPay * rate.rate;
                  if (projectCost > 0) {
                      projectCostTransactions.push({
                          organization_id: activeOrgId,
                          date: payrollDate,
                          description: `Payroll Cost Allocation for ${emp.name}`,
                          account_id: payrollConfig.payrollExpenseAccountId,
                          type: 'Expense',
                          amount: projectCost,
                          notes: `Project cost allocation for ${rate.rate * 100}% of salary`,
                          project_id: rate.project_id
                      });
                  }
              });
          }
      });

      if (projectCostTransactions.length > 0) {
          const { error: projectTransError } = await supabase.from('transactions').insert(projectCostTransactions);
          if (projectTransError) {
              console.warn("Could not create project cost transactions:", projectTransError.message);
          }
      }

      await fetchDataForOrg(activeOrgId);
      toast({ title: 'Payroll Processed', description: 'Journal entry created successfully.' });

    } catch (error) {
      toast({ variant: 'destructive', title: 'Error Processing Payroll', description: error.message });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Payroll Processing</h1>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Payroll Settings</h2>
          <Button onClick={savePayrollSettings} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Cash/Bank Account</label>
              <AccountSelector accounts={accounts} value={payrollConfig.cashAccountId} onChange={(v) => handleConfigChange('cashAccountId', v)} categoryFilter={['Assets']} placeholder="Select account for payments" disabledParent={true} />
            </div>
            <div>
              <label className="text-sm font-medium">PAYE Liability Account</label>
              <AccountSelector accounts={accounts} value={payrollConfig.payeLiabilityAccountId} onChange={(v) => handleConfigChange('payeLiabilityAccountId', v)} categoryFilter={['Liabilities']} placeholder="Select liability account" disabledParent={true} />
            </div>
            <div>
              <label className="text-sm font-medium">Pension Liability Account</label>
              <AccountSelector accounts={accounts} value={payrollConfig.pensionLiabilityAccountId} onChange={(v) => handleConfigChange('pensionLiabilityAccountId', v)} categoryFilter={['Liabilities']} placeholder="Select liability account" disabledParent={true} />
            </div>
            <div>
              <label className="text-sm font-medium">Other Deductions Liability</label>
              <AccountSelector accounts={accounts} value={payrollConfig.otherDeductionsLiabilityAccountId} onChange={(v) => handleConfigChange('otherDeductionsLiabilityAccountId', v)} categoryFilter={['Liabilities']} placeholder="Select liability account" disabledParent={true} />
            </div>
            <div>
              <label className="text-sm font-medium">Payroll Expense Account</label>
              <AccountSelector accounts={accounts} value={payrollConfig.payrollExpenseAccountId} onChange={(v) => handleConfigChange('payrollExpenseAccountId', v)} categoryFilter={['Expenses']} placeholder="Select expense account" disabledParent={true} />
            </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-white rounded-lg shadow-sm border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Employee', 'Gross Pay', 'PAYE', 'Pension', 'Other', 'Loan', 'Total Deductions', 'Net Pay', 'Employer Pension', 'Other Taxes', 'Total Cost'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {payrollSummary.map(emp => (
              <tr key={emp.id}>
                <td className="px-4 py-3 font-medium">{emp.name}</td>
                <td className="px-4 py-3 font-mono">{(emp.payroll.grossPay || 0).toFixed(2)}</td>
                <td className="px-4 py-3 font-mono">{(emp.payroll.paye || 0).toFixed(2)}</td>
                <td className="px-4 py-3 font-mono">{(emp.payroll.pension || 0).toFixed(2)}</td>
                <td className="px-4 py-3 font-mono">{(emp.payroll.otherDeductions || 0).toFixed(2)}</td>
                <td className="px-4 py-3 font-mono">{(emp.payroll.advanceLoan || 0).toFixed(2)}</td>
                <td className="px-4 py-3 font-mono text-red-600">{(emp.payroll.totalDeductions || 0).toFixed(2)}</td>
                <td className="px-4 py-3 font-mono font-bold text-green-600">{(emp.payroll.netPay || 0).toFixed(2)}</td>
                <td className="px-4 py-3 font-mono">{(emp.payroll.employerPension || 0).toFixed(2)}</td>
                <td className="px-4 py-3 font-mono">{(emp.payroll.otherTaxes || 0).toFixed(2)}</td>
                <td className="px-4 py-3 font-mono font-bold text-blue-600">{(emp.payroll.totalEmployerCost || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-100">
            <tr className="font-bold">
              <td className="px-4 py-3">Totals</td>
              <td className="px-4 py-3 font-mono">{(totals.grossPay || 0).toFixed(2)}</td>
              <td className="px-4 py-3 font-mono">{(totals.paye || 0).toFixed(2)}</td>
              <td className="px-4 py-3 font-mono">{(totals.pension || 0).toFixed(2)}</td>
              <td className="px-4 py-3 font-mono">{(totals.otherDeductions || 0).toFixed(2)}</td>
              <td className="px-4 py-3 font-mono">{(totals.advanceLoan || 0).toFixed(2)}</td>
              <td className="px-4 py-3 font-mono text-red-600">{((totals.paye || 0) + (totals.pension || 0) + (totals.otherDeductions || 0) + (totals.advanceLoan || 0)).toFixed(2)}</td>
              <td className="px-4 py-3 font-mono text-green-600">{(totals.netPay || 0).toFixed(2)}</td>
              <td className="px-4 py-3 font-mono">{(totals.employerPension || 0).toFixed(2)}</td>
              <td className="px-4 py-3 font-mono">{(totals.otherTaxes || 0).toFixed(2)}</td>
              <td className="px-4 py-3 font-mono text-blue-600">{(totals.totalEmployerCost || 0).toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="mt-8 flex justify-end items-center gap-4">
        <div>
          <label htmlFor="payrollDate" className="text-sm font-medium mr-2">Payroll Date</label>
          <Input id="payrollDate" type="date" value={payrollDate} onChange={(e) => setPayrollDate(e.target.value)} className="w-auto inline-block"/>
        </div>
        <Button onClick={runPayroll} disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Run Payroll & Create Journal Entry'}
        </Button>
      </motion.div>
    </div>
  );
}