import React, { lazy, Suspense } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { motion } from 'framer-motion';

const formMapping = {
  'Annual Budget Template': lazy(() => import('@/components/finance/BudgetForm')),
  'Purchase Request Form': lazy(() => import('@/components/supply-chain/PurchaseRequestForm')),
  'Purchase Order Form': lazy(() => import('@/components/supply-chain/PurchaseOrderForm')),
  'Inventory Tracking Sheet': lazy(() => import('@/components/supply-chain/InventoryItemForm')),
  'Donation Tracking Sheet': lazy(() => import('@/components/finance/DonationForm')),
  'Expense Report Form': lazy(() => import('@/components/finance/BillForm')),
  'Financial Statement Report': lazy(() => import('@/components/finance/ReportPreview')),
};

const StaticPreview = ({ title }) => {
    // This could be expanded with more detailed static previews
    const outlines = {
        'Grant Proposal Outline': ['Executive Summary', 'Statement of Need', 'Project Description', 'Budget', 'Organization Information'],
        'Fundraising Campaign Planner': ['Campaign Goal & Objective', 'Target Audience', 'Key Messages', 'Timeline & Activities', 'Budget & Resources'],
        'Donor Thank You Letter': ['Your Organization\'s Letterhead', 'Date', 'Donor\'s Name and Address', 'Salutation', 'Body of the Letter (Expressing Gratitude)', 'Closing and Signature'],
        'Project Plan Template': ['Project Overview', 'Goals and Objectives', 'Scope and Deliverables', 'Schedule and Milestones', 'Team Roles and Responsibilities'],
        'Project Status Report': ['Project Name & Date', 'Overall Status (On Track, At Risk, Off Track)', 'Key Accomplishments This Period', 'Upcoming Activities', 'Issues and Risks'],
        'Risk Assessment Matrix': ['Risk Description', 'Likelihood (1-5)', 'Impact (1-5)', 'Risk Score', 'Mitigation Plan'],
        'Job Offer Letter Template': ['Company Letterhead', 'Date', 'Candidate Details', 'Offer Details (Position, Salary, Start Date)', 'Acceptance Instructions'],
        'Employee Onboarding Checklist': ['Pre-First Day (Paperwork, System Setup)', 'First Day (Welcome, Introductions, Tour)', 'First Week (Training, Goal Setting)', 'First Month (Check-ins, Reviews)'],
        'Performance Review Form': ['Employee Information', 'Review Period', 'Goals from Previous Review', 'Accomplishments', 'Areas for Improvement', 'New Goals', 'Signatures'],
        'Supplier Contract Template': ['Parties Involved', 'Scope of Services/Goods', 'Payment Terms', 'Contract Duration', 'Confidentiality Clause', 'Termination Conditions'],
        'Logistics & Shipping Tracker': ['Shipment ID', 'Date Shipped', 'Origin', 'Destination', 'Carrier', 'Tracking Number', 'Status'],
    };

    const content = outlines[title] || ['A professional document structure will be generated in the PDF.'];

    return (
        <div className="p-4 border rounded-lg bg-gray-50/50">
            <h3 className="font-semibold text-lg mb-4 text-gray-800">Document Outline</h3>
            <ul className="space-y-3">
                {content.map((item, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                         <span className="bg-primary/10 text-primary font-bold text-xs rounded-full h-5 w-5 flex items-center justify-center mr-3">{index + 1}</span>
                         {item}
                    </li>
                ))}
            </ul>
        </div>
    );
};


const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-full min-h-[400px]">
        <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);

const TemplatePreview = ({ open, onOpenChange, template, data }) => {
  if (!template) return null;

  const FormComponent = formMapping[template.title];

  // Mock props for components that need them
  const mockProps = {
    onSave: () => {},
    onCancel: () => onOpenChange(false),
    accounts: data.accounts || [],
    projects: data.projects || [],
    funds: data.funds || [],
    transactions: data.transactions || [],
    purchaseRequests: data.purchaseRequests || [],
    settings: data.organizationSettings || {},
    item: null, // For forms like InventoryItemForm
    request: null,
    order: null,
    budget: null,
    donation: null,
    bill: null,
    isOpen: true, // for ReportPreview
    reportConfig: { // for ReportPreview
      title: 'Sample Financial Statement',
      isProjectSpecific: true,
      columns: ['Account', 'Amount'],
      generate: () => ({ body: [['Sample Revenue', '10,000'], ['Sample Expense', '4,000']], foot: [['Net Total', '6,000']] })
    },
    data: data, // for ReportPreview
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 border-0">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="relative bg-muted/40 p-6 rounded-t-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl">Template Preview: {template.title}</DialogTitle>
              <DialogDescription>{template.description}</DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {FormComponent ? (
              <Suspense fallback={<LoadingSpinner />}>
                <div className="pointer-events-none scale-95 origin-top-left -ml-4 -mt-4">
                  <FormComponent {...mockProps} />
                </div>
              </Suspense>
            ) : (
                <StaticPreview title={template.title} />
            )}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplatePreview;