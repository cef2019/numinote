import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

const GanttChart = ({ projects }) => {
  if (!projects || projects.length === 0) {
    return <div className="text-center text-gray-500 py-10">No projects to display in Gantt chart.</div>;
  }

  const validProjects = projects.filter(p => p.start_date && p.end_date);

  if (validProjects.length === 0) {
    return <div className="text-center text-gray-500 py-10">No projects with valid start and end dates to display.</div>;
  }

  const projectDates = validProjects.flatMap(p => [new Date(p.start_date), new Date(p.end_date)]);
  const minDate = new Date(Math.min.apply(null, projectDates));
  const maxDate = new Date(Math.max.apply(null, projectDates));

  minDate.setDate(minDate.getDate() - 7);
  maxDate.setDate(maxDate.getDate() + 7);

  const totalDays = (maxDate - minDate) / (1000 * 60 * 60 * 24);

  const getMonthHeaders = () => {
    const months = [];
    let currentDate = new Date(minDate);
    while (currentDate <= maxDate) {
      months.push(new Date(currentDate));
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    return months;
  };

  const monthHeaders = getMonthHeaders();

  return (
    <div className="overflow-x-auto">
      <div className="relative" style={{ minWidth: `${totalDays * 3}px` }}>
        <div className="flex h-10 sticky top-0 bg-gray-50 dark:bg-gray-800 z-10 border-b">
          {monthHeaders.map((month, index) => {
            const nextMonth = index + 1 < monthHeaders.length ? monthHeaders[index + 1] : maxDate;
            const daysInMonth = (nextMonth - month) / (1000 * 60 * 60 * 24);
            return (
              <div key={index} className="flex-shrink-0 text-center font-semibold text-sm py-2 border-r" style={{ width: `${daysInMonth * 3}px` }}>
                {month.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </div>
            );
          })}
        </div>
        <div className="pt-2">
          {validProjects.map((project, index) => {
            const startDate = new Date(project.start_date);
            const endDate = new Date(project.end_date);
            const startOffset = ((startDate - minDate) / (1000 * 60 * 60 * 24) / totalDays) * 100;
            const durationWidth = ((endDate - startDate) / (1000 * 60 * 60 * 24) / totalDays) * 100;
            const budget = project.budget || 0;
            const spent = project.spent || 0;
            const progress = budget > 0 ? (spent / budget) * 100 : 0;

            return (
              <div key={project.id} className="flex items-center h-12 border-b">
                <div className="w-48 px-2 text-sm font-medium truncate sticky left-0 bg-white dark:bg-card">{project.name}</div>
                <div className="flex-grow h-full relative">
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-6 bg-gray-200 dark:bg-gray-700 rounded-md"
                    style={{ left: `${startOffset}%`, width: `${durationWidth}%` }}
                  >
                    <div className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-md" style={{ width: `${progress}%` }}></div>
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-white font-semibold truncate pr-2">{project.name}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div
          className="absolute top-10 bottom-0 border-l-2 border-red-500"
          style={{ left: `${((new Date() - minDate) / (1000 * 60 * 60 * 24) / totalDays) * 100}%` }}
        >
          <div className="absolute -top-5 -translate-x-1/2 text-xs text-red-500">Today</div>
        </div>
      </div>
    </div>
  );
};

export default function Gantt() {
  const { allData } = useOutletContext();
  const { projects } = allData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Project Timelines</CardTitle>
        </CardHeader>
        <CardContent>
          <GanttChart projects={projects} />
        </CardContent>
      </Card>
    </motion.div>
  );
}