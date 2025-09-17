import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const getInitialFormData = (employee = null) => {
  const defaults = {
    name: '',
    title: '',
    department: '',
    grossPay: 0,
    exemptionRate: 0.15,
    employeePensionRate: 0.05,
    employerPensionRate: 0.05,
    otherDeductionRate: 0.02,
    payeRate: 0.20,
    otherTaxesRate: 0.01,
    advanceLoan: 0,
    projectRates: [],
  };

  if (employee) {
    return {
      name: employee.name || defaults.name,
      title: employee.title || defaults.title,
      department: employee.department || defaults.department,
      grossPay: employee.gross_pay || defaults.grossPay,
      exemptionRate: employee.exemption_rate || defaults.exemptionRate,
      employeePensionRate: employee.employee_pension_rate || defaults.employeePensionRate,
      employerPensionRate: employee.employer_pension_rate || defaults.employerPensionRate,
      otherDeductionRate: employee.other_deduction_rate || defaults.otherDeductionRate,
      payeRate: employee.paye_rate || defaults.payeRate,
      otherTaxesRate: employee.other_taxes_rate || defaults.otherTaxesRate,
      advanceLoan: employee.advance_loan || defaults.advanceLoan,
      projectRates: employee.projectRates || defaults.projectRates,
    };
  }
  return defaults;
};

export default function EmployeeForm({ open, onOpenChange, onSave, employee, projects }) {
  const [formData, setFormData] = useState(getInitialFormData(employee));
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setFormData(getInitialFormData(employee));
    }
  }, [employee, open]);

  const handleChange = (e) => {
    const { id, value, type } = e.target;
    setFormData(prev => ({ ...prev, [id]: type === 'number' ? parseFloat(value) || 0 : value }));
  };

  const handleProjectRateChange = (index, field, value) => {
    const newProjectRates = [...formData.projectRates];
    newProjectRates[index][field] = value;
    setFormData(prev => ({ ...prev, projectRates: newProjectRates }));
  };

  const addProjectRate = () => {
    setFormData(prev => ({
      ...prev,
      projectRates: [...prev.projectRates, { projectId: '', rate: 0 }]
    }));
  };

  const removeProjectRate = (index) => {
    const newProjectRates = formData.projectRates.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, projectRates: newProjectRates }));
  };

  const handleSubmit = () => {
    const totalRate = formData.projectRates.reduce((sum, pr) => sum + (parseFloat(pr.rate) || 0), 0);
    if (formData.projectRates.length > 0 && Math.abs(totalRate - 1.0) > 0.001) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: `Total project contribution rates must equal 100%. Current total is ${(totalRate * 100).toFixed(2)}%.`,
      });
      return;
    }

    onSave({
      ...formData,
      id: employee ? employee.id : undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{employee ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
          <DialogDescription>
            {employee ? 'Update the details of the employee.' : 'Enter the details for the new employee.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value={formData.name} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input id="title" value={formData.title} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">Department</Label>
            <Input id="department" value={formData.department} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="grossPay" className="text-right">Gross Pay</Label>
            <Input id="grossPay" type="number" value={formData.grossPay} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="advanceLoan" className="text-right">Advance/Loan</Label>
            <Input id="advanceLoan" type="number" value={formData.advanceLoan} onChange={handleChange} className="col-span-3" />
          </div>
          <h3 className="col-span-4 text-lg font-semibold mt-4">Payroll Rates</h3>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="exemptionRate" className="text-right">Exemption (%)</Label>
            <Input id="exemptionRate" type="number" step="0.01" placeholder="e.g. 0.15 for 15%" value={formData.exemptionRate} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="employeePensionRate" className="text-right">Employee Pension (%)</Label>
            <Input id="employeePensionRate" type="number" step="0.01" value={formData.employeePensionRate} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="employerPensionRate" className="text-right">Employer Pension (%)</Label>
            <Input id="employerPensionRate" type="number" step="0.01" value={formData.employerPensionRate} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="otherDeductionRate" className="text-right">Other Deduction (%)</Label>
            <Input id="otherDeductionRate" type="number" step="0.01" value={formData.otherDeductionRate} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="payeRate" className="text-right">PAYE (%)</Label>
            <Input id="payeRate" type="number" step="0.01" value={formData.payeRate} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="otherTaxesRate" className="text-right">Other Taxes (%)</Label>
            <Input id="otherTaxesRate" type="number" step="0.01" value={formData.otherTaxesRate} onChange={handleChange} className="col-span-3" />
          </div>
           
          <h3 className="col-span-4 text-lg font-semibold mt-4">Project Contribution Rates</h3>
          <p className="col-span-4 text-sm text-gray-500 -mt-2">Define what percentage of this employee's salary is funded by each project. Total must be 100%.</p>
          <div className="col-span-4 space-y-3">
              {formData.projectRates.map((pr, index) => (
                <div key={index} className="flex items-center gap-2">
                    <Select value={String(pr.projectId || '')} onValueChange={(value) => handleProjectRateChange(index, 'projectId', value)}>
                        <SelectTrigger><SelectValue placeholder="Select Project..." /></SelectTrigger>
                        <SelectContent>
                            {(projects || []).map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Input 
                        type="number" 
                        placeholder="Rate (e.g., 0.5 for 50%)" 
                        step="0.01" 
                        value={pr.rate} 
                        onChange={(e) => handleProjectRateChange(index, 'rate', e.target.value)}
                        className="w-48"
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeProjectRate(index)}><X className="w-4 h-4 text-red-500" /></Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addProjectRate}><Plus className="w-4 h-4 mr-2" /> Add Project Rate</Button>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit}>Save Employee</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}