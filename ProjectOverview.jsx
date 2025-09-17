import React from 'react';
import { motion } from 'framer-motion';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import { CheckCircle, Clock, ListTodo, Users, DollarSign, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';

const StatCard = ({ icon, title, value, color, bgColor }) => {
  const Icon = icon;
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${bgColor}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

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

export default function ProjectOverview() {
  const { projectId } = useParams();
  const { allData, handleEdit, handleDelete } = useOutletContext();
  const { projects, employees } = allData;
  
  const project = projects?.find(p => p.id === projectId);

  if (!project) {
    return <Navigate to="/app/projects" replace />;
  }

  const budget = project.budget || 0;
  const spent = project.spent || 0;
  const progress = budget > 0 ? (spent / budget) * 100 : 0;

  const projectTeam = project.project_team || [];
  const projectMilestones = project.project_milestones || [];
  const projectTasks = project.project_tasks || [];
  const safeEmployees = employees || [];

  const teamMembers = projectTeam.map(tm => safeEmployees.find(e => e.id === tm.employee_id)).filter(Boolean);

  const stats = [
    { icon: ListTodo, title: 'Tasks', value: projectTasks.length, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
    { icon: CheckCircle, title: 'Milestones', value: projectMilestones.length, color: 'text-green-600', bgColor: 'bg-green-100' },
    { icon: Users, title: 'Team Members', value: teamMembers.length, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { icon: Clock, title: 'Days Remaining', value: project.end_date ? Math.max(0, Math.ceil((new Date(project.end_date) - new Date()) / (1000 * 60 * 60 * 24))) : 'N/A', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <Link to="/app/projects/overview" className="flex items-center text-sm text-gray-500 hover:text-gray-800">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Link>
        <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleEdit(project)}>
                <Edit className="w-4 h-4 mr-2" /> Edit
            </Button>
            <Button variant="destructive" onClick={() => handleDelete(project)}>
                <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-800">{project.name}</h1>
            <Badge variant={getStatusBadgeVariant(project.status)}>{project.status}</Badge>
        </div>
        <div className="text-sm text-gray-500">
          <p>Managed by: <span className="font-medium text-gray-700">{project.manager}</span></p>
          <p>Duration: <span className="font-medium text-gray-700">{project.start_date}</span> to <span className="font-medium text-gray-700">{project.end_date}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map(stat => <StatCard key={stat.title} {...stat} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Budget</span>
                  <span className="font-bold text-lg">${budget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Spent</span>
                  <span className="font-bold text-lg">${spent.toLocaleString()}</span>
                </div>
                <Progress value={progress} className="w-full" />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Remaining</span>
                  <span className="font-bold text-green-600">${(budget - spent).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Tasks</CardTitle></CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Assignee</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {projectTasks.length > 0 ? projectTasks.map(task => (
                            <TableRow key={task.id}>
                                <TableCell>{task.title}</TableCell>
                                <TableCell>{task.assignee}</TableCell>
                                <TableCell>{task.due_date}</TableCell>
                                <TableCell><Badge variant={getStatusBadgeVariant(task.status)}>{task.status}</Badge></TableCell>
                            </TableRow>
                        )) : (
                           <TableRow><TableCell colSpan={4} className="text-center">No tasks for this project yet.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Team</CardTitle>
                <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                    <Users className="w-4 h-4 mr-2" /> Manage Team
                </Button>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {teamMembers.length > 0 ? teamMembers.map(member => (
                  <li key={member.id} className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">{member.name.charAt(0)}</div>
                    <div>
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.title}</p>
                    </div>
                  </li>
                )) : (
                    <li className="text-center text-gray-500">No team members assigned.</li>
                )}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Milestones</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {projectMilestones.length > 0 ? projectMilestones.map(milestone => (
                  <li key={milestone.id} className="flex items-center">
                    <CheckCircle className={`w-5 h-5 mr-3 ${milestone.status === 'Completed' ? 'text-green-500' : 'text-gray-300'}`} />
                    <div className="flex-grow">
                      <p className="font-medium text-sm">{milestone.title}</p>
                      <p className="text-xs text-gray-500">{milestone.due_date}</p>
                    </div>
                  </li>
                )) : (
                    <li className="text-center text-gray-500">No milestones defined.</li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}