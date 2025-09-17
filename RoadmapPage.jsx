import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { CheckCircle, Zap, Clock } from 'lucide-react';

const RoadmapColumn = ({ title, icon, items, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg">
    <div className={`flex items-center mb-4 text-${color}-600`}>
      {React.createElement(icon, { className: "h-6 w-6 mr-3" })}
      <h3 className="text-xl font-bold text-gray-800">{title}</h3>
    </div>
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={index} className="flex items-start">
          <CheckCircle className={`flex-shrink-0 h-5 w-5 text-${color}-500 mr-3 mt-1`} />
          <span className="text-gray-600">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const RoadmapPage = () => {
  const plannedItems = ["Advanced Grant Management Module", "Volunteer Management Portal", "Mobile App for Field Operations", "Customizable Reporting Dashboards"];
  const inProgressItems = ["AI-Powered Financial Forecasting", "Stripe Integration for Online Donations", "Enhanced User Roles & Permissions", "Multi-language Support"];
  const completedItems = ["Full Suite Fund Accounting", "Project Management & Task Tracking", "HR & Payroll Management", "Supply Chain & Inventory Control"];

  return (
    <>
      <Helmet>
        <title>Roadmap | Numinote</title>
        <meta name="description" content="See what we're working on and what's next for Numinote. Our public roadmap shows our commitment to continuous improvement." />
      </Helmet>
      <div className="bg-gray-50">
        <div className="pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-base font-semibold text-primary uppercase tracking-wide">Our Roadmap</p>
              <h1 className="mt-2 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
                Building the Future of Nonprofit Tech
              </h1>
              <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-gray-600">
                We're constantly innovating to bring you the best tools. Here's a look at what's planned, in progress, and already launched.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="pb-20 sm:pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <RoadmapColumn title="Planned" icon={Clock} items={plannedItems} color="blue" />
              <RoadmapColumn title="In Progress" icon={Zap} items={inProgressItems} color="yellow" />
              <RoadmapColumn title="Completed" icon={CheckCircle} items={completedItems} color="green" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoadmapPage;