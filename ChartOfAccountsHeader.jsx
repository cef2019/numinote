import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ChartOfAccountsHeader = ({ onAddNew, onExport, onImportClick, onDownloadTemplate, isImporting }) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-8 flex-wrap gap-4"
      >
        <h1 className="text-3xl font-bold text-gray-800">Chart of Accounts</h1>
        <div className="flex space-x-2 items-center">
          <Button variant="outline" onClick={onImportClick} disabled={isImporting}>
            {isImporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
            Import
          </Button>
          <Button variant="outline" onClick={onExport}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button onClick={onAddNew}>
            <Plus className="w-4 h-4 mr-2" /> New Account
          </Button>
        </div>
      </motion.div>
      <div className="text-sm text-gray-500 mb-4">
        Need help with importing?{' '}
        <Button variant="link" className="p-0 h-auto" onClick={onDownloadTemplate}>
          Download our CSV template.
        </Button>
      </div>
    </>
  );
};

export default ChartOfAccountsHeader;