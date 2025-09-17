import React from 'react';
import { motion } from 'framer-motion';

const LoadingDashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center h-full p-8"
      style={{ minHeight: 'calc(100vh - 120px)' }}
    >
      <div className="flex items-center space-x-3 text-primary">
        <svg
          className="animate-spin h-8 w-8 text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="text-xl font-semibold">Loading Dashboard...</p>
      </div>
      <p className="mt-4 text-gray-500">Just a moment while we gather your organization's data.</p>
    </motion.div>
  );
};

export default LoadingDashboard;