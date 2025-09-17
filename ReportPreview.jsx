import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Download, Printer, Briefcase, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

async function getImageDataUri(url) {
  if (!url) return null;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image to data URI:", error);
    return null;
  }
}

export default function ReportPreview({ isOpen, onOpenChange, reportConfig, data }) {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });
  const [selectedProjectId, setSelectedProjectId] = useState('all');
  const [previewData, setPreviewData] = useState({ body: [], foot: [] });
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const { toast } = useToast();

  const { title, generate } = reportConfig || {};
  const { organizationSettings, projects } = data || {};

  useEffect(() => {
    if (isOpen && generate) {
      const newReportData = { ...data, dateRange, selectedProjectId };
      const { body, foot } = generate(newReportData);
      setPreviewData({ body, foot });
    }
  }, [isOpen, generate, data, dateRange, selectedProjectId]);
  
  const generatePdf = async (action = 'download') => {
    if (!reportConfig) return;
    setIsProcessingPdf(true);

    try {
      const doc = new jsPDF(reportConfig.options?.orientation || 'p');
      const logoDataUri = await getImageDataUri(organizationSettings?.logo);

      const addHeaderToPdf = (docInstance) => {
        if (logoDataUri) {
          try {
            const imgProps = docInstance.getImageProperties(logoDataUri);
            const aspectRatio = imgProps.width / imgProps.height;
            const imgWidth = 20;
            const imgHeight = imgWidth / aspectRatio;
            docInstance.addImage(logoDataUri, 'PNG', 14, 15, imgWidth, imgHeight);
          } catch (e) {
            console.error("Error adding logo to PDF:", e);
            toast({
              variant: "destructive",
              title: "PDF Error",
              description: "Could not add the organization logo to the PDF."
            });
          }
        }
        
        const textX = logoDataUri ? 40 : 14;
        docInstance.setFontSize(18);
        docInstance.setFont('helvetica', 'bold');
        docInstance.text(organizationSettings?.name || '', textX, 22);
        
        let currentY = 28;
        if (organizationSettings?.address) {
          docInstance.setFontSize(10);
          docInstance.setFont('helvetica', 'normal');
          const addressLines = organizationSettings.address.split('\n');
          addressLines.forEach((line, index) => {
            docInstance.text(line, textX, currentY + (index * 4));
          });
          currentY += (addressLines.length * 4) + 2;
        } else {
            currentY = 30;
        }
        
        docInstance.setFontSize(16);
        docInstance.setFont('helvetica', 'bold');
        docInstance.text(title, 14, currentY);
        currentY += 7;
        
        docInstance.setFontSize(10);
        docInstance.setFont('helvetica', 'normal');
        if (reportConfig.isProjectSpecific) {
            docInstance.text(`Period: ${format(dateRange.from, "LLL dd, y")} to ${format(dateRange.to, "LLL dd, y")}`, 14, currentY);
            currentY += 6;
            if (selectedProjectId !== 'all' && projects) {
              const project = projects.find(p => p.id.toString() === selectedProjectId);
              docInstance.text(`Project: ${project ? project.name : 'N/A'}`, 14, currentY);
              currentY += 6;
            }
        }
        
        docInstance.text(`Generated: ${format(new Date(), "LLL dd, y 'at' h:mm a")}`, 14, currentY);
        
        return currentY + 7;
      };

      const addFooterToPdf = (docInstance) => {
          const pageCount = docInstance.internal.getNumberOfPages();
          for (let i = 1; i <= pageCount; i++) {
            docInstance.setPage(i);
            docInstance.setFontSize(8);
            docInstance.setFont('helvetica', 'italic');
            
            const footerText = `This report was generated by ${organizationSettings?.name || 'your organization'}. Financial management system, accrual basis.`;
            docInstance.text(footerText, 14, docInstance.internal.pageSize.height - 15);

            docInstance.setFont('helvetica', 'normal');
            docInstance.text(`${organizationSettings?.name || 'Organization'} - Page ${i} of ${pageCount}`, 14, docInstance.internal.pageSize.height - 10);
            if (organizationSettings?.website) {
              docInstance.text(organizationSettings.website, docInstance.internal.pageSize.width - 14, docInstance.internal.pageSize.height - 10, { align: 'right' });
            }
          }
      }

      const startY = addHeaderToPdf(doc);
      
      doc.autoTable({
        head: [reportConfig.columns],
        body: previewData.body,
        foot: previewData.foot ? [previewData.foot] : undefined,
        startY: startY,
        theme: 'grid',
        headStyles: { 
          fillColor: [23, 37, 84],
          textColor: 255,
          fontStyle: 'bold'
        },
        footStyles: { 
          fontStyle: 'bold', 
          fillColor: [241, 245, 249],
          textColor: 0
        },
        styles: {
          fontSize: 9,
          cellPadding: 3
        },
        ...reportConfig.options?.tableOptions
      });
      
      addFooterToPdf(doc);

      if (action === 'print') {
        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');
      } else {
        doc.save(`${organizationSettings?.name || 'Organization'}_${title.replace(/ /g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      }
    } catch (error) {
      console.error("PDF Generation Error:", error);
      toast({
        variant: "destructive",
        title: "PDF Generation Failed",
        description: "There was an issue creating the PDF. Please try again."
      });
    } finally {
      setIsProcessingPdf(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            {organizationSettings?.logo && (
              <img src={organizationSettings.logo} alt={`${organizationSettings?.name || 'Organization'} Logo`} className="w-8 h-8 object-contain rounded" />
            )}
            <span>{organizationSettings?.name ? `${organizationSettings.name} - ${title}` : title}</span>
          </DialogTitle>
          <DialogDescription>
            Customize your report period, preview the content, and download or print your report.
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            {reportConfig?.isProjectSpecific && (
            <>
              <div>
                <Label className="text-sm font-medium text-gray-700">Report Period</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn(
                        "w-[300px] justify-start text-left font-normal mt-1",
                        !dateRange && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Project</Label>
                <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                  <SelectTrigger className="w-[300px] mt-1">
                    <Briefcase className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects / Entire Organization</SelectItem>
                    {projects && projects.map(p => (
                      <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
            )}
            {!reportConfig?.isProjectSpecific && <p className="text-sm text-gray-600">This report reflects all data for the organization.</p>}
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => generatePdf('print')} variant="outline" disabled={isProcessingPdf}>
              {isProcessingPdf ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Printer className="w-4 h-4 mr-2" />}
              Print
            </Button>
            <Button onClick={() => generatePdf('download')} className="bg-gradient-to-r from-emerald-500 to-green-600" disabled={isProcessingPdf}>
              {isProcessingPdf ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
              Download PDF
            </Button>
          </div>
        </div>
        
        <div className="flex-grow overflow-auto border rounded-lg mt-4 bg-white">
          <div className="p-8">
            <div className="border-b pb-6 mb-6">
              <div className="flex items-start gap-4">
                {organizationSettings?.logo && (
                  <img 
                    src={organizationSettings.logo} 
                    alt="Organization Logo" 
                    className="h-16 w-16 object-contain rounded"
                  />
                )}
                <div className="flex-grow">
                  <h1 className="text-2xl font-bold text-gray-800">
                    {organizationSettings?.name || ''}
                  </h1>
                  {organizationSettings?.address && (
                    <div className="text-sm text-gray-600 mt-1">
                      {organizationSettings.address.split('\n').map((line, index) => (
                        <div key={index}>{line}</div>
                      ))}
                    </div>
                  )}
                  {(organizationSettings?.phone || organizationSettings?.email || organizationSettings?.website) && (
                    <div className="text-sm text-gray-600 mt-2 flex gap-4 flex-wrap">
                      {organizationSettings?.phone && <span>Phone: {organizationSettings.phone}</span>}
                      {organizationSettings?.email && <span>Email: {organizationSettings.email}</span>}
                      {organizationSettings?.website && <span>Web: {organizationSettings.website}</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">{title}</h2>
              {reportConfig?.isProjectSpecific && (
                 <p className="text-sm text-gray-600 mt-1">
                    For the period from {dateRange.from && format(dateRange.from, "MMMM dd, yyyy")} to {dateRange.to && format(dateRange.to, "MMMM dd, yyyy")}
                 </p>
              )}
              {reportConfig?.isProjectSpecific && selectedProjectId !== 'all' && projects && (
                <p className="text-sm text-gray-600 mt-1">
                  Project: {(projects || []).find(p => p.id.toString() === selectedProjectId)?.name}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Generated on {format(new Date(), "MMMM dd, yyyy 'at' h:mm a")}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700 border border-gray-200">
                <thead className="text-xs text-white uppercase bg-gradient-to-r from-emerald-500 to-green-600">
                  <tr>
                    {reportConfig?.columns.map((col, i) => (
                      <th key={i} scope="col" className="px-6 py-4 font-semibold">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {previewData.body.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      {row.map((cell, j) => (
                        <td key={j} className="px-6 py-4 whitespace-nowrap">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
                {previewData.foot && previewData.foot.length > 0 && (
                  <tfoot className="bg-gray-100">
                    <tr className="font-semibold text-gray-900">
                      {previewData.foot.map((cell, i) => (
                        <th key={i} scope="row" className="px-6 py-4 text-base">
                          {cell}
                        </th>
                      ))}
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            <div className="mt-8 pt-4 border-t text-center text-xs text-gray-500">
              <p>This report was generated by {organizationSettings?.name || 'your organization'}. Financial management system, accrual basis.</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}