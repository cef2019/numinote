import React, { useState } from 'react';
import { useOutletContext, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import ProjectForm from '@/pages/projects/ProjectForm';
import TaskForm from '@/pages/projects/TaskForm';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { cn } from '@/lib/utils';

export default function Projects() {
  const outletContext = useOutletContext();
  const { allData, activeOrgId, fetchDataForOrg } = outletContext;
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemType, setItemType] = useState('');

  const handleAddNewProject = () => {
    setSelectedProject(null);
    setIsProjectFormOpen(true);
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setIsProjectFormOpen(true);
  };

  const handleDeleteProjectRequest = (project) => {
    setItemToDelete(project);
    setItemType('project');
    setIsConfirmOpen(true);
  };

  const handleAddNewTask = (projectId) => {
    setSelectedTask(null);
    setIsTaskFormOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsTaskFormOpen(true);
  };

  const handleDeleteTaskRequest = (task) => {
    setItemToDelete(task);
    setItemType('task');
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    let error;
    if (itemType === 'project') {
      await supabase.from('project_team').delete().eq('project_id', itemToDelete.id);
      await supabase.from('project_milestones').delete().eq('project_id', itemToDelete.id);
      await supabase.from('project_tasks').delete().eq('project_id', itemToDelete.id);
      const { error: projectError } = await supabase.from('projects').delete().eq('id', itemToDelete.id);
      error = projectError;
      if (!error) navigate('/app/projects/overview');
    } else if (itemType === 'task') {
      const { error: taskError } = await supabase.from('project_tasks').delete().eq('id', itemToDelete.id);
      error = taskError;
    }

    if (error) {
      toast({ variant: 'destructive', title: `Error deleting ${itemType}`, description: error.message });
    } else {
      await fetchDataForOrg(activeOrgId);
      toast({ title: 'Success', description: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} deleted successfully.` });
    }
    setIsConfirmOpen(false);
    setItemToDelete(null);
    setItemType('');
  };

  const handleSaveProject = async (projectData) => {
    const { team, milestones, ...mainData } = projectData;
    
    const dataToSave = { 
      organization_id: activeOrgId,
      name: mainData.name,
      manager: mainData.manager,
      start_date: mainData.start_date,
      end_date: mainData.end_date,
      status: mainData.status,
      budget: mainData.budget,
    };
    
    let projectId;
    let error;

    if (selectedProject?.id) {
      projectId = selectedProject.id;
      const { error: updateError } = await supabase.from('projects').update(dataToSave).eq('id', projectId);
      error = updateError;
    } else {
      const { data: newProject, error: insertError } = await supabase.from('projects').insert(dataToSave).select().single();
      if (newProject) projectId = newProject.id;
      error = insertError;
    }

    if (error) {
      toast({ variant: 'destructive', title: `Error saving project`, description: error.message });
      return;
    }

    if (!projectId) {
       toast({ variant: 'destructive', title: `Error saving project`, description: 'Could not get project ID.' });
       return;
    }
    
    await supabase.from('project_team').delete().eq('project_id', projectId);
    if (team && team.length > 0) {
      const teamToInsert = team.map(employee_id => ({ project_id: projectId, employee_id }));
      await supabase.from('project_team').insert(teamToInsert);
    }
    
    await supabase.from('project_milestones').delete().eq('project_id', projectId);
    if (milestones && milestones.length > 0) {
      const milestonesToInsert = milestones.filter(m => m.title).map(m => ({ project_id: projectId, title: m.title, due_date: m.due_date, status: m.status }));
      if (milestonesToInsert.length > 0) {
          await supabase.from('project_milestones').insert(milestonesToInsert);
      }
    }

    toast({ title: 'Success', description: `Project ${selectedProject?.id ? 'updated' : 'created'} successfully.` });
    await fetchDataForOrg(activeOrgId);
    setIsProjectFormOpen(false);
    setSelectedProject(null);
  };

  const handleSaveTask = async (taskData) => {
    const dataToSave = {
      project_id: taskData.project_id,
      title: taskData.title,
      assignee: taskData.assignee,
      due_date: taskData.due_date,
      status: taskData.status,
    };

    let error;
    if (selectedTask?.id) {
      const { error: updateError } = await supabase.from('project_tasks').update(dataToSave).eq('id', selectedTask.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('project_tasks').insert(dataToSave);
      error = insertError;
    }

    if (error) {
      toast({ variant: 'destructive', title: 'Error saving task', description: error.message });
    } else {
      toast({ title: 'Success', description: `Task ${selectedTask ? 'updated' : 'created'} successfully.` });
      await fetchDataForOrg(activeOrgId);
    }
    setIsTaskFormOpen(false);
    setSelectedTask(null);
  };
  
  const newOutletContext = {
    ...outletContext,
    handleAddNew: handleAddNewProject,
    handleEdit: handleEditProject,
    handleDelete: handleDeleteProjectRequest,
    handleAddNewTask,
    handleEditTask,
    handleDeleteTask: handleDeleteTaskRequest,
  };

  const tabs = [
    { name: 'Overview', path: '/app/projects/overview' },
    { name: 'Tasks', path: '/app/projects/tasks' },
    { name: 'Gantt Chart', path: '/app/projects/gantt' },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Project Management</h1>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                to={tab.path}
                className={cn(
                  location.pathname === tab.path
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                )}
              >
                {tab.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <Outlet context={newOutletContext} />

      <ProjectForm
        open={isProjectFormOpen}
        onOpenChange={setIsProjectFormOpen}
        onSave={handleSaveProject}
        project={selectedProject}
        employees={allData.employees}
      />
      <TaskForm
        open={isTaskFormOpen}
        onOpenChange={setIsTaskFormOpen}
        onSave={handleSaveTask}
        task={selectedTask}
        projects={allData.projects}
        employees={allData.employees}
      />
      <DeleteConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        itemName={itemToDelete?.name || itemToDelete?.title}
        itemType={itemType}
      />
    </>
  );
}