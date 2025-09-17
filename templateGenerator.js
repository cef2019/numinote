import jsPDF from 'jspdf';
import 'jspdf-autotable';

const addHeader = (doc, title) => {
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 105, 20, { align: 'center' });
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text('Template from Numinote', 105, 27, { align: 'center' });
  doc.setDrawColor(230);
  doc.line(14, 32, 196, 32);
  return 40;
};

const addFooter = (doc, title) => {
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${pageCount} | ${title}`, 14, doc.internal.pageSize.height - 10);
    doc.text('© Numinote', doc.internal.pageSize.width - 14, doc.internal.pageSize.height - 10, { align: 'right' });
  }
};

const addSectionTitle = (doc, title, y) => {
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0);
  doc.text(title, 14, y);
  return y + 7;
};

const addField = (doc, label, y, options = {}) => {
  const { placeholder = '', height = 10 } = options;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0);
  doc.text(label, 15, y + 6);
  doc.setDrawColor(200);
  doc.rect(14, y, 182, height);
  if (placeholder) {
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(150);
    doc.text(placeholder, 18, y + 6);
  }
  return y + height + 5;
};

const addCheckbox = (doc, label, y) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0);
    doc.setDrawColor(100);
    doc.rect(14, y, 4, 4);
    doc.text(label, 22, y + 3);
    return y + 8;
};

const generators = {
  // Financial Management
  'Annual Budget Template': () => {
    const doc = new jsPDF();
    let y = addHeader(doc, 'Annual Budget Template');
    y = addField(doc, 'Budget Name:', y, { placeholder: 'e.g., Annual Operating Budget 2025' });
    y = addField(doc, 'Fiscal Year:', y, { placeholder: '2025' });
    
    doc.autoTable({
      startY: y + 5,
      head: [['Account Code', 'Account Name', 'Budgeted Amount', 'Notes']],
      body: [
        ['5010', 'Salaries & Wages', '', ''],
        ['5020', 'Program Supplies', '', ''],
        ['6010', 'Rent & Utilities', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
      ],
      foot: [['', 'Total', '', '']],
      theme: 'grid',
      headStyles: { fillColor: [23, 37, 84] },
      footStyles: { fontStyle: 'bold', fillColor: [241, 245, 249] },
    });
    addFooter(doc, 'Annual Budget Template');
    return doc;
  },
  'Financial Statement Report': () => {
    const doc = new jsPDF();
    let y = addHeader(doc, 'Financial Statement');
    y = addSectionTitle(doc, 'Income Statement', y);
    doc.autoTable({ startY: y, head: [['Account', 'Amount']], body: [['4010 - Grants', ''], ['4020 - Donations', '']], foot: [['Total Income', '']], theme: 'striped' });
    addFooter(doc, 'Financial Statement');
    return doc;
  },
  'Expense Report Form': () => {
    const doc = new jsPDF();
    let y = addHeader(doc, 'Expense Report');
    y = addField(doc, 'Employee Name:', y);
    y = addField(doc, 'Period Covered:', y);
    doc.autoTable({ startY: y + 5, head: [['Date', 'Description', 'Category', 'Amount']], body: [['', '', '', ''], ['', '', '', '']], foot: [['Total', '', '', '']] });
    addFooter(doc, 'Expense Report Form');
    return doc;
  },
  'Donation Tracking Sheet': () => {
    const doc = new jsPDF();
    let y = addHeader(doc, 'Donation Tracking Sheet');
    y = addField(doc, 'Fund/Campaign:', y);
    doc.autoTable({ startY: y + 5, head: [['Date', 'Donor Name', 'Amount', 'Type', 'Notes']], body: [['', '', '', '', ''], ['', '', '', '', '']] });
    addFooter(doc, 'Donation Tracking Sheet');
    return doc;
  },
  // Grant & Fundraising
  'Grant Proposal Outline': () => {
    const doc = new jsPDF();
    let y = addHeader(doc, 'Grant Proposal Outline');
    y = addSectionTitle(doc, '1. Executive Summary', y);
    y = addField(doc, '', y + 2, { height: 40 });
    y = addSectionTitle(doc, '2. Statement of Need', y);
    y = addField(doc, '', y + 2, { height: 40 });
    y = addSectionTitle(doc, '3. Project Description', y);
    y = addField(doc, '', y + 2, { height: 50 });
    addFooter(doc, 'Grant Proposal Outline');
    return doc;
  },
  'Fundraising Campaign Planner': () => {
    const doc = new jsPDF();
    let y = addHeader(doc, 'Fundraising Campaign Planner');
    y = addSectionTitle(doc, 'Campaign Details', y);
    y = addField(doc, 'Campaign Name:', y);
    y = addField(doc, 'Goal Amount:', y);
    y = addSectionTitle(doc, 'Key Activities & Timeline', y);
    doc.autoTable({ startY: y, head: [['Activity', 'Owner', 'Due Date', 'Status']], body: [['', '', '', '']] });
    addFooter(doc, 'Fundraising Campaign Planner');
    return doc;
  },
  'Donor Thank You Letter': () => {
    const doc = new jsPDF();
    let y = addHeader(doc, 'Donor Thank You Letter');
    y = addField(doc, 'Date:', y);
    y = addField(doc, 'Donor Name & Address:', y, { height: 20 });
    y = addField(doc, 'Body:', y, { height: 80, placeholder: 'Dear [Donor Name], Thank you so much for your generous gift of...' });
    y = addField(doc, 'Sincerely,', y);
    addFooter(doc, 'Donor Thank You Letter');
    return doc;
  },
  // Project Management
  'Project Plan Template': () => {
    const doc = new jsPDF();
    let y = addHeader(doc, 'Project Plan');
    y = addSectionTitle(doc, 'Project Overview', y);
    y = addField(doc, 'Project Name:', y);
    y = addField(doc, 'Project Manager:', y);
    y = addField(doc, 'Start & End Dates:', y);
    y = addSectionTitle(doc, 'Tasks & Milestones', y);
    doc.autoTable({ startY: y, head: [['Task', 'Assignee', 'Due Date', 'Status']], body: [['', '', '', '']] });
    addFooter(doc, 'Project Plan Template');
    return doc;
  },
  'Project Status Report': () => {
    const doc = new jsPDF();
    let y = addHeader(doc, 'Project Status Report');
    y = addField(doc, 'Project Name:', y);
    y = addField(doc, 'Reporting Period:', y);
    y = addSectionTitle(doc, 'Key Accomplishments:', y, { height: 30 });
    y = addField(doc, '', y, { height: 30 });
    y = addSectionTitle(doc, 'Upcoming Activities:', y, { height: 30 });
    y = addField(doc, '', y, { height: 30 });
    addFooter(doc, 'Project Status Report');
    return doc;
  },
  'Risk Assessment Matrix': () => {
    const doc = new jsPDF();
    addHeader(doc, 'Risk Assessment Matrix');
    doc.autoTable({ startY: 40, head: [['Risk Description', 'Likelihood (1-5)', 'Impact (1-5)', 'Score', 'Mitigation Plan']], body: [['', '', '', '', '']] });
    addFooter(doc, 'Risk Assessment Matrix');
    return doc;
  },
  // Human Resources
  'Job Offer Letter Template': () => {
    const doc = new jsPDF();
    let y = addHeader(doc, 'Job Offer Letter');
    y = addField(doc, 'Date:', y);
    y = addField(doc, 'Candidate Name & Address:', y, { height: 20 });
    y = addField(doc, 'Body:', y, { height: 80, placeholder: 'Dear [Candidate Name], We are pleased to offer you the position of...' });
    addFooter(doc, 'Job Offer Letter Template');
    return doc;
  },
  'Employee Onboarding Checklist': () => {
    const doc = new jsPDF();
    let y = addHeader(doc, 'Employee Onboarding Checklist');
    y = addSectionTitle(doc, 'Pre-First Day', y);
    y = addCheckbox(doc, 'Send welcome email', y);
    y = addCheckbox(doc, 'Set up workstation & accounts', y);
    y = addSectionTitle(doc, 'First Day', y);
    y = addCheckbox(doc, 'Office tour & team introductions', y);
    y = addCheckbox(doc, 'Review job description & goals', y);
    addFooter(doc, 'Employee Onboarding Checklist');
    return doc;
  },
  'Performance Review Form': () => {
    const doc = new jsPDF();
    let y = addHeader(doc, 'Performance Review Form');
    y = addField(doc, 'Employee Name:', y);
    y = addField(doc, 'Review Period:', y);
    y = addSectionTitle(doc, 'Strengths:', y);
    y = addField(doc, '', y, { height: 30 });
    y = addSectionTitle(doc, 'Areas for Improvement:', y);
    y = addField(doc, '', y, { height: 30 });
    addFooter(doc, 'Performance Review Form');
    return doc;
  },
  // Supply Chain
  'Purchase Request Form': () => {
    const doc = new jsPDF();
    let y = addHeader(doc, 'Purchase Request Form');
    y = addField(doc, 'Department:', y);
    y = addField(doc, 'Project:', y);
    doc.autoTable({ startY: y + 5, head: [['Item Description', 'Quantity', 'Unit Cost', 'Total Cost']], body: [['', '', '', '']] });
    addFooter(doc, 'Purchase Request Form');
    return doc;
  },
  'Purchase Order Form': () => {
    const doc = new jsPDF();
    let y = addHeader(doc, 'Purchase Order');
    y = addField(doc, 'Vendor:', y);
    y = addField(doc, 'PO Number:', y);
    doc.autoTable({ startY: y + 5, head: [['Item Description', 'Quantity', 'Unit Price', 'Total']], body: [['', '', '', '']] });
    addFooter(doc, 'Purchase Order Form');
    return doc;
  },
  'Inventory Tracking Sheet': () => {
    const doc = new jsPDF();
    addHeader(doc, 'Inventory Tracking Sheet');
    doc.autoTable({ startY: 40, head: [['Item Name', 'SKU', 'Location', 'Quantity', 'Reorder Level']], body: [['', '', '', '', '']] });
    addFooter(doc, 'Inventory Tracking Sheet');
    return doc;
  },
  'Supplier Contract Template': () => {
    const doc = new jsPDF();
    let y = addHeader(doc, 'Supplier Contract Template');
    y = addSectionTitle(doc, '1. Parties', y);
    y = addField(doc, '', y, { height: 20, placeholder: '[Your Organization] and [Supplier Name]' });
    y = addSectionTitle(doc, '2. Scope of Work', y);
    y = addField(doc, '', y, { height: 40 });
    addFooter(doc, 'Supplier Contract Template');
    return doc;
  },
  'Logistics & Shipping Tracker': () => {
    const doc = new jsPDF();
    addHeader(doc, 'Logistics & Shipping Tracker');
    doc.autoTable({ startY: 40, head: [['Date', 'Shipment ID', 'Origin', 'Destination', 'Status']], body: [['', '', '', '', '']] });
    addFooter(doc, 'Logistics & Shipping Tracker');
    return doc;
  },
};

export const generateTemplatePdf = (templateTitle) => {
  if (generators[templateTitle]) {
    const doc = generators[templateTitle]();
    const filename = `${templateTitle.replace(/ /g, '_')}.pdf`;
    doc.save(filename);
    return true;
  }
  return false;
};