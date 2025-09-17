import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import EmployeeForm from '@/components/hr/EmployeeForm';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { supabase } from '@/lib/customSupabaseClient';
import { useOutletContext } from 'react-router-dom';

const EmployeeRow = ({ employee, onEdit, onDelete }) => {
  return (
    <motion.tr
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="hover:bg-gray-50 group"
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.title}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.department}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">${(employee.gross_pay || 0).toLocaleString()}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" onClick={() => onEdit(employee)}><Edit className="w-4 h-4 text-gray-500" /></Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(employee)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
        </div>
      </td>
    </motion.tr>
  );
};

export default function Employees() {
  const { allData, activeOrgId, fetchDataForOrg, loadingData } = useOutletContext();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const { employees, projects } = useMemo(() => {
    return {
      employees: allData?.employees || [],
      projects: allData?.projects || [],
    };
  }, [allData]);

  const handleAddNew = () => {
    setSelectedEmployee(null);
    setIsFormOpen(true);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsFormOpen(true);
  };

  const handleDelete = (employee) => {
    setEmployeeToDelete(employee);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;
    const { error } = await supabase.from('employees').delete().eq('id', employeeToDelete.id);
    if (error) {
      toast({ variant: 'destructive', title: 'Error deleting employee', description: error.message });
    } else {
      await fetchDataForOrg(activeOrgId);
      toast({ title: "Success", description: "Employee removed successfully." });
    }
    setIsConfirmOpen(false);
    setEmployeeToDelete(null);
  };

  const handleSave = async (employeeData) => {
    const { projectRates, ...mainData } = employeeData;
    const dataToSave = { 
      organization_id: activeOrgId,
      name: mainData.name,
      title: mainData.title,
      department: mainData.department,
      gross_pay: mainData.grossPay,
      exemption_rate: mainData.exemptionRate,
      employee_pension_rate: mainData.employeePensionRate,
      employer_pension_rate: mainData.employerPensionRate,
      other_deduction_rate: mainData.otherDeductionRate,
      paye_rate: mainData.payeRate,
      other_taxes_rate: mainData.otherTaxesRate,
      advance_loan: mainData.advanceLoan
    };

    let employeeId;
    if (selectedEmployee) {
      employeeId = selectedEmployee.id;
      const { error } = await supabase.from('employees').update(dataToSave).eq('id', selectedEmployee.id);
      if (error) {
        toast({ variant: "destructive", title: "Error updating employee", description: error.message });
        return;
      }
      toast({ title: "Success", description: "Employee updated successfully." });
    } else {
      const { data, error } = await supabase.from('employees').insert(dataToSave).select().single();
      if (error) {
        toast({ variant: "destructive", title: "Error adding employee", description: error.message });
        return;
      }
      employeeId = data.id;
      toast({ title: "Success", description: "Employee added successfully." });
    }

    await supabase.from('employee_project_rates').delete().eq('employee_id', employeeId);
    if(projectRates && projectRates.length > 0) {
      const ratesToInsert = projectRates
        .filter(pr => pr.projectId)
        .map(pr => ({
          employee_id: employeeId,
          project_id: pr.projectId,
          rate: pr.rate
        }));

      if (ratesToInsert.length > 0) {
        const { error } = await supabase.from('employee_project_rates').insert(ratesToInsert);
        if (error) {
          toast({ variant: "destructive", title: "Error saving project rates", description: error.message });
        }
      }
    }
    
    await fetchDataForOrg(activeOrgId);
    setIsFormOpen(false);
    setSelectedEmployee(null);
  };

  if (loadingData) {
    return (
        <div className="flex items-center justify-center h-full">
            <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">Employees</h1>
        <Button onClick={handleAddNew}>
          <Plus className="w-4 h-4 mr-2" /> New Employee
        </Button>
      </motion.div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Pay</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map(employee => (
              <EmployeeRow key={employee.id} employee={employee} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
             {employees.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-500">
                    No employees found. Get started by adding a new employee.
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>

      <EmployeeForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleSave}
        employee={selectedEmployee}
        projects={projects}
      />
      <DeleteConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        itemName={employeeToDelete?.name}
        itemType="employee"
      />
    </div>
  );
}