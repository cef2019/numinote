import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Edit, Trash2 } from 'lucide-react';

const getStatusBadgeVariant = (status) => {
  switch (status) {
    case 'Completed': return 'success';
    case 'In Progress': return 'default';
    case 'On Hold': return 'warning';
    case 'Not Started':
    default:
      return 'secondary';
  }
};

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const budget = project.budget || 0;
  const spent = project.spent || 0;
  const progress = budget > 0 ? (spent / budget) * 100 : 0;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate(`/app/projects/${project.id}`)}
    >
      <div>
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-gray-800 mb-2">{project.name}</h3>
          <Badge variant={getStatusBadgeVariant(project.status)}>{project.status}</Badge>
        </div>
        <p className="text-sm text-gray-500 mb-4">Managed by: {project.manager}</p>
        
        <div className="space-y-2 mt-4">
           <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{project.start_date}</span>
              <span>{project.end_date}</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-sm font-medium text-gray-700">
              <span>Spent: ${spent.toLocaleString()}</span>
              <span>Budget: ${budget.toLocaleString()}</span>
            </div>
        </div>
      </div>
      <div className="flex justify-end items-center mt-4 space-x-2">
        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onEdit(project); }}>
          <Edit className="w-4 h-4 mr-2" /> Edit
        </Button>
        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={(e) => { e.stopPropagation(); onDelete(project); }}>
          <Trash2 className="w-4 h-4 mr-2" /> Delete
        </Button>
      </div>
    </motion.div>
  );
};

export default function ProjectListPage() {
  const { allData, handleAddNew, handleEdit, handleDelete } = useOutletContext();
  const safeProjects = allData?.projects || [];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
        <Button onClick={handleAddNew} className="bg-gradient-to-r from-emerald-500 to-green-600">
          <Plus className="w-4 h-4 mr-2" /> New Project
        </Button>
      </motion.div>

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {safeProjects.map(project => (
          <ProjectCard key={project.id} project={project} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
        {safeProjects.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            <p>No projects found.</p>
            <p>Get started by clicking the "New Project" button.</p>
          </div>
        )}
      </motion.div>
    </>
  );
}