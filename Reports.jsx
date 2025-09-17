import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/DatePickerWithRange.jsx';
import { Eye, Download, Printer } from 'lucide-react';
import ReportPreview from '@/components/finance/ReportPreview';
import { reportGenerators } from '@/lib/reportGenerator';

const reportTypes = [
  { value: 'balance-sheet', label: 'Balance Sheet' },
  { value: 'income-statement', label: 'Income Statement (P&L)' },
  { value: 'cash-flow', label: 'Statement of Cash Flows' },
  { value: 'fund-balance', label: 'Fund Balance Report' },
  { value: 'project-summary', label: 'Project Summary Report' },
  { value: 'budget-vs-actual', label: 'Budget vs. Actuals' },
];

export default function Reports({ allData }) {
  const [reportType, setReportType] = useState('balance-sheet');
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });
  const [selectedProjectId, setSelectedProjectId] = useState('all');
  const [selectedBudgetId, setSelectedBudgetId] = useState('all');

  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const [reportConfig, setReportConfig] = useState(null);

  const { transactions, accounts, projects, funds, budgets, organizationSettings } = allData || {};

  const reportData = useMemo(() => {
    return {
      transactions,
      accounts,
      projects,
      funds,
      budgets,
      organizationSettings,
      dateRange,
      selectedProjectId,
      selectedBudgetId,
    };
  }, [transactions, accounts, projects, funds, budgets, organizationSettings, dateRange, selectedProjectId, selectedBudgetId]);

  const handleGenerateAndPreview = () => {
    const generator = reportGenerators[reportType];
    if (generator) {
      const config = generator(reportData);
      setReportConfig(config);
      setPreviewOpen(true);
    }
  };

  const currentReportInfo = reportTypes.find(r => r.value === reportType);

  return (
    <>
      <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800">Financial Reports</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {reportTypes.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            {(currentReportInfo.value !== 'balance-sheet') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <DatePickerWithRange date={dateRange} setDate={setDateRange} />
              </div>
            )}
            
            {currentReportInfo.value === 'balance-sheet' && (
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">As of Date</label>
                <DatePickerWithRange date={dateRange.to} setDate={(newDate) => setDateRange({ from: dateRange.from, to: newDate })} singleDate />
              </div>
            )}

            {currentReportInfo.value === 'project-summary' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                  <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {(projects || []).map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

            {currentReportInfo.value === 'budget-vs-actual' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                <Select value={selectedBudgetId} onValueChange={setSelectedBudgetId}>
                  <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Select a Budget</SelectItem>
                    {(budgets || []).map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="lg:col-start-4 flex justify-end">
              <Button onClick={handleGenerateAndPreview} className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md hover:shadow-lg transition-shadow">
                <Eye className="w-4 h-4 mr-2" />
                Generate & Preview
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 text-center"
        >
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Ready to Dive In?</h2>
            <p className="text-gray-600 mb-6">
              Select a report type and date range above, then click "Generate & Preview" to see your data come to life. 
              You'll be able to download a professional PDF or print it directly from the preview window.
            </p>
            <div className="flex justify-center items-center space-x-4 text-gray-500">
                <div className="flex items-center"><Eye className="w-5 h-5 mr-2 text-green-500" /> Preview</div>
                <div className="flex items-center"><Download className="w-5 h-5 mr-2 text-green-500" /> Download PDF</div>
                <div className="flex items-center"><Printer className="w-5 h-5 mr-2 text-green-500" /> Print</div>
            </div>
          </div>
        </motion.div>
      </div>
      <ReportPreview
        isOpen={isPreviewOpen}
        onOpenChange={setPreviewOpen}
        reportConfig={reportConfig}
        data={reportData}
      />
    </>
  );
}