import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, BarChart2, Receipt, HeartHandshake, Award, Target, Mail, 
  GanttChartSquare, ClipboardList, ShieldAlert, UserPlus, ClipboardCheck, Star, Download, Eye,
  Truck, Warehouse, FileSignature
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/components/ui/use-toast';
import { generateTemplatePdf } from '@/lib/templateGenerator';
import TemplatePreview from '@/components/TemplatePreview';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useOutletContext } from 'react-router-dom';

const iconMap = {
  FileText, BarChart2, Receipt, HeartHandshake, Award, Target, Mail,
  GanttChartSquare, ClipboardList, ShieldAlert, UserPlus, ClipboardCheck, Star,
  Truck, Warehouse, FileSignature
};

const templateCategories = [
  {
    name: 'Financial Management',
    templates: [
      { title: 'Annual Budget Template', description: 'Plan your year with a comprehensive budget for all departments.', icon: 'BarChart2', hasPreview: true },
      { title: 'Financial Statement Report', description: 'Generate professional income statements, balance sheets, and cash flow statements.', icon: 'FileText', hasPreview: true },
      { title: 'Expense Report Form', description: 'Standardize expense tracking and reimbursement for your team.', icon: 'Receipt', hasPreview: true },
      { title: 'Donation Tracking Sheet', description: 'Monitor incoming donations and manage donor information effectively.', icon: 'HeartHandshake', hasPreview: true },
    ],
  },
  {
    name: 'Grant & Fundraising',
    templates: [
      { title: 'Grant Proposal Outline', description: 'Structure a compelling grant proposal that wins funding.', icon: 'Award', hasPreview: true },
      { title: 'Fundraising Campaign Planner', description: 'Organize your next fundraising event from start to finish.', icon: 'Target', hasPreview: true },
      { title: 'Donor Thank You Letter', description: 'Personalize your appreciation with professionally written thank you letters.', icon: 'Mail', hasPreview: true },
    ],
  },
  {
    name: 'Project Management',
    templates: [
      { title: 'Project Plan Template', description: 'Define project scope, timelines, and deliverables clearly.', icon: 'GanttChartSquare', hasPreview: true },
      { title: 'Project Status Report', description: 'Keep stakeholders informed with concise weekly or monthly updates.', icon: 'ClipboardList', hasPreview: true },
      { title: 'Risk Assessment Matrix', description: 'Identify and mitigate potential project risks proactively.', icon: 'ShieldAlert', hasPreview: true },
    ],
  },
  {
    name: 'Human Resources',
    templates: [
      { title: 'Job Offer Letter Template', description: 'Create professional and consistent job offer letters for new hires.', icon: 'UserPlus', hasPreview: true },
      { title: 'Employee Onboarding Checklist', description: 'Ensure a smooth and welcoming onboarding process for new team members.', icon: 'ClipboardCheck', hasPreview: true },
      { title: 'Performance Review Form', description: 'Conduct structured and fair employee performance evaluations.', icon: 'Star', hasPreview: true },
    ],
  },
  {
    name: 'Supply Chain',
    templates: [
      { title: 'Purchase Request Form', description: 'Standardize procurement requests with a form based on the in-app approval workflow.', icon: 'FileSignature', hasPreview: true },
      { title: 'Purchase Order Form', description: 'Create and track purchase orders with a standardized form.', icon: 'ClipboardList', hasPreview: true },
      { title: 'Inventory Tracking Sheet', description: 'Maintain accurate records of your stock levels and assets.', icon: 'Warehouse', hasPreview: true },
      { title: 'Supplier Contract Template', description: 'Establish clear terms with your vendors using this formal contract.', icon: 'FileSignature', hasPreview: true },
      { title: 'Logistics & Shipping Tracker', description: 'Monitor inbound and outbound shipments with a simple tracker.', icon: 'Truck', hasPreview: true },
    ],
  },
];

const TemplateCard = ({ template, index, onPreview }) => {
  const { toast } = useToast();
  const Icon = iconMap[template.icon] || FileText;

  const handleDownload = () => {
    const success = generateTemplatePdf(template.title);
    if (success) {
      toast({
        title: "✅ Download Started",
        description: `${template.title}.pdf is being downloaded.`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: "Template Not Found",
        description: "We couldn't generate a PDF for this template yet.",
      });
    }
  };

  const handlePreview = () => {
    if (template.hasPreview) {
      onPreview(template);
    } else {
      toast({
        title: "🚧 No Preview Available",
        description: "An interactive preview isn't available. Try downloading the PDF instead!",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full flex flex-col">
        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
          <div className="p-3 bg-green-100 rounded-lg">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle>{template.title}</CardTitle>
            <CardDescription className="mt-1">{template.description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex items-end justify-end gap-2">
          <Button variant="outline" size="sm" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const TemplatesPage = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const { isAuthenticated } = useAuth();
  
  const outletContext = useOutletContext();
  const allData = outletContext || {};

  const handlePreview = (template) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
  };

  const getDataForPreview = () => {
    if (isAuthenticated && outletContext) {
      return allData;
    }
    return { 
      accounts: [], 
      projects: [], 
      funds: [], 
      transactions: [], 
      purchaseRequests: [], 
      organizationSettings: {} 
    };
  };

  return (
    <>
      <Helmet>
        <title>Template Library | Numinote</title>
        <meta name="description" content="Accelerate your nonprofit's operations with Numinote's comprehensive library of templates for finance, fundraising, project management, and HR." />
      </Helmet>
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
              Numinote Template Library
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-gray-600">
              Stop reinventing the wheel. Get a head start with our curated collection of templates designed specifically for nonprofits.
            </p>
          </motion.div>

          <div className="mt-16">
            <Tabs defaultValue={templateCategories[0].name} className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
                {templateCategories.map(category => (
                  <TabsTrigger key={category.name} value={category.name}>{category.name}</TabsTrigger>
                ))}
              </TabsList>
              {templateCategories.map(category => (
                <TabsContent key={category.name} value={category.name}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                    {category.templates.map((template, index) => (
                      <TemplateCard key={template.title} template={template} index={index} onPreview={handlePreview} />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isPreviewOpen && (
          <TemplatePreview 
            open={isPreviewOpen}
            onOpenChange={setIsPreviewOpen}
            template={selectedTemplate}
            data={getDataForPreview()}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default TemplatesPage;