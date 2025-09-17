import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Landmark, BarChart2, Users, Briefcase, ShoppingCart, FileText, Heart, Lightbulb, CheckCircle } from 'lucide-react';

const FeatureDetailCard = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="bg-white p-8 rounded-xl shadow-lg"
  >
    <div className="flex items-center mb-4">
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-br from-emerald-500 to-green-600 text-white">
          {React.createElement(icon, { className: "h-6 w-6" })}
        </div>
      </div>
      <div className="ml-4">
        <h3 className="text-xl leading-6 font-bold text-gray-900">{title}</h3>
      </div>
    </div>
    <p className="text-base text-gray-600">{description}</p>
  </motion.div>
);

const FeaturesPage = () => {
  const features = [
    { icon: Landmark, title: "Fund Accounting", description: "Manage restricted and unrestricted funds with a compliant, easy-to-use system." },
    { icon: BarChart2, title: "Financial Reporting", description: "Generate comprehensive financial statements, donor reports, and project summaries in seconds." },
    { icon: Briefcase, title: "Project Management", description: "Track project progress, budgets, and tasks to ensure your initiatives stay on track." },
    { icon: Users, title: "HR Management", description: "Handle employee records, payroll, and time tracking all in one place." },
    { icon: ShoppingCart, title: "Supply Chain", description: "Manage purchase requests, orders, and inventory to optimize your resources." },
    { icon: FileText, title: "Donation Tracking", description: "Record and manage donations, issue receipts, and track donor history effortlessly." },
    { icon: Heart, title: "Grant Management", description: "Track grant applications, deadlines, and reporting requirements to maximize funding opportunities." },
    { icon: Lightbulb, title: "Budgeting & Forecasting", description: "Create detailed budgets, compare actuals to forecasts, and plan for the future with confidence." },
  ];

  return (
    <>
      <Helmet>
        <title>Features | Numinote</title>
        <meta name="description" content="Explore the powerful features of Numinote, the all-in-one management software for nonprofits." />
      </Helmet>
      <div className="bg-gray-50">
        <div className="pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-base font-semibold text-primary uppercase tracking-wide">Our Features</p>
              <h1 className="mt-2 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
                A Powerful Toolkit for Your Mission
              </h1>
              <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-gray-600">
                Numinote is packed with features designed to streamline your operations, enhance transparency, and free you up to focus on what matters most.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="pb-20 sm:pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureDetailCard key={feature.title} {...feature} delay={index * 0.1} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeaturesPage;