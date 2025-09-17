import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function BudgetFormFields({ formData, handleChange, handleSelectChange, projects }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div>
        <Label htmlFor="name" className="text-sm font-medium">Budget Name</Label>
        <Input 
          id="name" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          required 
          placeholder="e.g., Annual Operating Budget 2025" 
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="fiscalYear" className="text-sm font-medium">Fiscal Year</Label>
        <Input 
          id="fiscalYear" 
          name="fiscalYear" 
          type="number" 
          value={formData.fiscalYear} 
          onChange={handleChange} 
          required 
          placeholder="e.g., 2025" 
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="projectId" className="text-sm font-medium">Link to Project (Optional)</Label>
        <Select
          name="projectId"
          value={formData.projectId || 'none'}
          onValueChange={(value) => handleSelectChange('projectId', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Entire Organization</SelectItem>
            {(projects || []).map(p => (
              <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}