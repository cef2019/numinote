import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const QuickActionButton = ({ icon: Icon, label, path }) => {
  const navigate = useNavigate();

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        variant="ghost"
        className="w-full justify-between items-center p-4 h-auto rounded-lg bg-gray-50 hover:bg-gray-100"
        onClick={() => navigate(path)}
      >
        <div className="flex items-center">
          <Icon className="w-5 h-5 mr-3 text-gray-600" />
          <span className="font-medium text-gray-700">{label}</span>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </Button>
    </motion.div>
  );
};

export default QuickActionButton;