import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const STATUS_OPTIONS = ['Not Started', 'In Progress', 'Completed', 'On Hold'];

export default function ProjectForm({ open, onOpenChange, onSave, project, employees }) {
  const [formData, setFormData] = useState({
    name: '',
    manager: '',
    start_date: '',
    end_date: '',
    status: 'Not Started',
    budget: '',
    team: [],
    milestones: [],
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        manager: project.manager || '',
        start_date: project.start_date || '',
        end_date: project.end_date || '',
        status: project.status || 'Not Started',
        budget: project.budget?.toString() || '',
        team: (project.project_team || []).map(pt => pt.employee_id),
        milestones: (project.project_milestones || []).map(m => ({ ...m, id: m.id || Date.now() })),
      });
    } else {
      setFormData({
        name: '',
        manager: '',
        start_date: '',
        end_date: '',
        status: 'Not Started',
        budget: '',
        team: [],
        milestones: [{ id: Date.now(), title: '', due_date: '', status: 'Upcoming' }],
      });
    }
  }, [project, open]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTeamChange = (memberId) => {
    setFormData(prev => {
      const newTeam = prev.team.includes(memberId)
        ? prev.team.filter(id => id !== memberId)
        : [...prev.team, memberId];
      return { ...prev, team: newTeam };
    });
  };

  const handleMilestoneChange = (index, field, value) => {
    const newMilestones = [...formData.milestones];
    newMilestones[index][field] = value;
    setFormData(prev => ({ ...prev, milestones: newMilestones }));
  };

  const addMilestone = () => {
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, { id: Date.now(), title: '', due_date: '', status: 'Upcoming' }]
    }));
  };

  const removeMilestone = (index) => {
    const newMilestones = formData.milestones.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, milestones: newMilestones }));
  };

  const handleSubmit = () => {
    onSave({
      ...formData,
      budget: parseFloat(formData.budget) || 0,
    });
    onOpenChange(false);
  };

  return (
    <AnimatePresence>
    {open && (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? 'Edit Project' : 'Add New Project'}</DialogTitle>
          <DialogDescription>
            {project ? 'Update the details of your project.' : 'Enter the details for the new project.'}
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="details" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="team">Team Manager</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="mt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={formData.name} onChange={handleChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="start_date" className="text-right">Start Date</Label>
                <Input id="start_date" type="date" value={formData.start_date} onChange={handleChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end_date" className="text-right">End Date</Label>
                <Input id="end_date" type="date" value={formData.end_date} onChange={handleChange} className="col-span-3" />
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="budget" className="text-right">Budget</Label>
                <Input id="budget" type="number" value={formData.budget} onChange={handleChange} className="col-span-3" />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="team" className="mt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="manager" className="text-right">Manager</Label>
                <Select value={formData.manager} onValueChange={(value) => handleSelectChange('manager', value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a manager" />
                  </SelectTrigger>
                  <SelectContent>
                    {(employees || []).map(employee => (
                      <SelectItem key={employee.id} value={employee.name}>{employee.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-semibold">Team Members</Label>
                <div className="mt-2 p-3 border rounded-md max-h-40 overflow-y-auto space-y-2">
                  {(employees || []).map(employee => (
                    <div key={employee.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`team-${employee.id}`}
                        checked={(formData.team || []).includes(employee.id)}
                        onCheckedChange={() => handleTeamChange(employee.id)}
                      />
                      <Label htmlFor={`team-${employee.id}`}>{employee.name} - <span className="text-gray-500">{employee.title}</span></Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="milestones" className="mt-6">
            <div className="space-y-3">
              {(formData.milestones || []).map((milestone, index) => (
                <div key={milestone.id} className="flex items-center gap-2">
                  <Input
                    placeholder="Milestone Title"
                    value={milestone.title}
                    onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
                  />
                  <Input
                    type="date"
                    value={milestone.due_date}
                    onChange={(e) => handleMilestoneChange(index, 'due_date', e.target.value)}
                  />
                  <Select value={milestone.status} onValueChange={(value) => handleMilestoneChange(index, 'status', value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Upcoming">Upcoming</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" onClick={() => removeMilestone(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addMilestone}>
                <Plus className="w-4 h-4 mr-2" /> Add Milestone
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button type="button" variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit} className="bg-gradient-to-r from-emerald-500 to-green-600">Save Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    )}
    </AnimatePresence>
  );
}