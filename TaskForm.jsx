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

const STATUS_OPTIONS = ['Not Started', 'In Progress', 'Completed'];

export default function TaskForm({ open, onOpenChange, onSave, task, projects, employees, selectedProjectId }) {
  const [formData, setFormData] = useState({
    title: '',
    assignee: '',
    due_date: '',
    status: 'Not Started',
    project_id: '',
  });

  useEffect(() => {
    const initialProjectId = selectedProjectId || (projects && projects.length > 0 ? projects[0].id : '');
    if (task) {
      setFormData({
        title: task.title || '',
        assignee: task.assignee || '',
        due_date: task.due_date || '',
        status: task.status || 'Not Started',
        project_id: task.project_id || initialProjectId,
      });
    } else {
      setFormData({
        title: '',
        assignee: '',
        due_date: '',
        status: 'Not Started',
        project_id: initialProjectId,
      });
    }
  }, [task, open, selectedProjectId, projects]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave({
      ...formData,
      id: task ? task.id : undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Add New Task'}</DialogTitle>
          <DialogDescription>
            {task ? 'Update the details of the task.' : 'Enter the details for the new task.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="project_id" className="text-right">Project</Label>
            <Select value={formData.project_id} onValueChange={(value) => handleSelectChange('project_id', value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {(projects || []).map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input id="title" value={formData.title} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assignee" className="text-right">Assignee</Label>
             <Select value={formData.assignee} onValueChange={(value) => handleSelectChange('assignee', value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select an assignee" />
              </SelectTrigger>
              <SelectContent>
                {(employees || []).map(e => <SelectItem key={e.id} value={e.name}>{e.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="due_date" className="text-right">Due Date</Label>
            <Input id="due_date" type="date" value={formData.due_date} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit} className="bg-gradient-to-r from-emerald-500 to-green-600">Save Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}