import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Tag, PlusCircle, Wrench, Zap, ShieldCheck } from 'lucide-react';

const changelogData = [
  {
    version: "v2.5.0",
    date: "August 22, 2025",
    changes: [
      { type: "New", description: "Launched the Template Library with downloadable PDFs for finance, HR, and project management.", icon: PlusCircle, color: "green" },
      { type: "New", description: "Added interactive previews for all form-based templates.", icon: PlusCircle, color: "green" },
      { type: "Improved", description: "Revamped the entire public-facing website with a fresh, modern design.", icon: Wrench, color: "blue" },
    ]
  },
  {
    version: "v2.4.0",
    date: "August 15, 2025",
    changes: [
      { type: "New", description: "Introduced a full-featured Supply Chain module, including Purchase Requests, Purchase Orders, and Inventory Management.", icon: PlusCircle, color: "green" },
      { type: "Improved", description: "Purchase Request forms now feed directly into Purchase Orders for a seamless procurement workflow.", icon: Wrench, color: "blue" },
      { type: "Fixed", description: "Corrected calculation errors in inventory valuation.", icon: Zap, color: "red" },
    ]
  },
  {
    version: "v2.3.0",
    date: "August 5, 2025",
    changes: [
      { type: "New", description: "Launched the Human Resources (HR) module with Employee management and Payroll processing capabilities.", icon: PlusCircle, color: "green" },
      { type: "Improved", description: "User invitation flow now supports assigning roles and permissions directly upon invite.", icon: Wrench, color: "blue" },
    ]
  },
   {
    version: "v2.2.0",
    date: "July 28, 2025",
    changes: [
      { type: "New", description: "Implemented a comprehensive Project Management suite, including project creation, task management, and team assignments.", icon: PlusCircle, color: "green" },
      { type: "Improved", description: "The main dashboard now includes a 'My Tasks' widget for quick access to assigned work.", icon: Wrench, color: "blue" },
      { type: "Fixed", description: "Resolved an issue where project budgets were not updating in real-time.", icon: Zap, color: "red" },
    ]
  },
  {
    version: "v2.1.0",
    date: "July 24, 2025",
    changes: [
      { type: "New", description: "Launched Public Footer and informational pages (About, Contact, Privacy, etc.).", icon: PlusCircle, color: "green" },
      { type: "Improved", description: "Enhanced Super Admin views for organization support and management.", icon: Wrench, color: "blue" },
      { type: "Fixed", description: "Resolved session errors on logout and improved token handling.", icon: Zap, color: "red" },
    ]
  },
  {
    version: "v2.0.0",
    date: "July 15, 2025",
    changes: [
      { type: "New", description: "Introduced real-time data updates across the entire application using Supabase subscriptions.", icon: PlusCircle, color: "green" },
      { type: "New", description: "Added dynamic, branded PDF reporting for financial statements and project summaries.", icon: PlusCircle, color: "green" },
      { type: "Improved", description: "Overhauled the project overview dashboard with live metrics and charts.", icon: Wrench, color: "blue" },
    ]
  },
  {
    version: "v1.5.0",
    date: "June 30, 2025",
    changes: [
        { type: "New", description: "Full invoicing and billing modules are now live! Create, send, and track customer invoices and vendor bills.", icon: PlusCircle, color: "green" },
        { type: "New", description: "Implemented a robust Journal Entry system for manual adjustments.", icon: PlusCircle, color: "green" },
        { type: "Improved", description: "Chart of Accounts now supports nested sub-accounts for granular tracking.", icon: Wrench, color: "blue" },
    ]
  },
  {
    version: "v1.2.0",
    date: "June 10, 2025",
    changes: [
        { type: "New", description: "Introduced Fund Accounting to track restricted and unrestricted funds.", icon: PlusCircle, color: "green" },
        { type: "New", description: "The Budgeting module is here! Create annual or project-based budgets and track variance.", icon: PlusCircle, color: "green" },
        { type: "Fixed", description: "Fixed a bug that caused incorrect balances when deleting transactions.", icon: Zap, color: "red" },
    ]
  },
  {
    version: "v1.0.0",
    date: "May 20, 2025",
    changes: [
      { type: "New", description: "Numinote is live! Initial launch includes core accounting features: Dashboard, Chart of Accounts, and Transaction recording.", icon: PlusCircle, color: "green" },
      { type: "New", description: "Secure user authentication and multi-organization support from day one.", icon: ShieldCheck, color: "green" },
      { type: "New", description: "Initial setup of settings panels for Profile and Organization management.", icon: PlusCircle, color: "green" },
    ]
  },
];

const ChangelogEntry = ({ version, date, changes }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="bg-white p-8 rounded-xl shadow-lg mb-12"
  >
    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center">
        <Tag className="mr-3 text-primary" /> Version {version}
      </h2>
      <span className="text-gray-500 font-medium">{date}</span>
    </div>
    <div className="border-t border-gray-200 pt-4">
      <ul className="space-y-4">
        {changes.map((change, index) => (
          <li key={index} className="flex items-start">
            <div className={`flex-shrink-0 h-8 w-8 rounded-full bg-${change.color}-100 flex items-center justify-center mr-4 mt-1`}>
              {React.createElement(change.icon, { className: `h-5 w-5 text-${change.color}-600` })}
            </div>
            <div>
              <span className={`px-2 py-1 text-xs font-semibold text-${change.color}-800 bg-${change.color}-100 rounded-full`}>{change.type}</span>
              <p className="mt-1 text-gray-600">{change.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </motion.div>
);

const ChangelogPage = () => {
  return (
    <>
      <Helmet>
        <title>Changelog | Numinote</title>
        <meta name="description" content="See the latest updates, improvements, and bug fixes for Numinote. We're always making our platform better for you." />
      </Helmet>
      <div className="bg-gray-50/50">
        <div className="pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-base font-semibold text-primary uppercase tracking-wide">Changelog</p>
              <h1 className="mt-2 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
                What's New at Numinote
              </h1>
              <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-gray-600">
                We're committed to transparency and continuous improvement. Here's a log of all the recent changes we've made.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="pb-20 sm:pb-28">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {changelogData.map(entry => <ChangelogEntry key={entry.version} {...entry} />)}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangelogPage;