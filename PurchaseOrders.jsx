import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreVertical, Edit, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import PurchaseOrderForm from '@/components/supply-chain/PurchaseOrderForm';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { supabase } from '@/lib/customSupabaseClient';
import { useOutletContext } from 'react-router-dom';

export default function PurchaseOrders() {
  const { purchaseOrders = [], purchaseRequests, accounts, organizationSettings, activeOrgId, fetchDataForOrg } = useOutletContext();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const handleNewOrder = () => {
    setSelectedOrder(null);
    setIsFormOpen(true);
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setIsFormOpen(true);
  };

  const handleSaveOrder = async (formData) => {
    const { items, ...mainData } = formData;
    const dataToSave = { 
        ...mainData, 
        organization_id: activeOrgId,
        total_cost: mainData.items.reduce((sum, item) => sum + (item.amount || 0), 0) - (mainData.discount || 0)
    };
    
    delete dataToSave.id;
    delete dataToSave.items;


    let orderId;

    if (selectedOrder) {
      orderId = selectedOrder.id;
      const { data, error } = await supabase.from('purchase_orders').update(dataToSave).eq('id', selectedOrder.id).select().single();
      if (error) {
        toast({ variant: 'destructive', title: 'Error updating PO', description: error.message });
        return;
      }
      toast({ title: "Success", description: "Purchase Order updated successfully." });
    } else {
      const { data, error } = await supabase.from('purchase_orders').insert(dataToSave).select().single();
      if (error) {
        toast({ variant: 'destructive', title: 'Error creating PO', description: error.message });
        return;
      }
      orderId = data.id;
      toast({ title: "Success", description: "Purchase Order created successfully." });
    }

    await supabase.from('purchase_order_items').delete().eq('purchase_order_id', orderId);
    if(items && items.length > 0) {
        const itemsToInsert = items.map(item => ({
            purchase_order_id: orderId,
            ...item
        }));
        await supabase.from('purchase_order_items').insert(itemsToInsert);
    }
    
    await fetchDataForOrg(activeOrgId);
    setIsFormOpen(false);
    setSelectedOrder(null);
  };

  const handleDeleteOrder = (order) => {
    setOrderToDelete(order);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;
    await supabase.from('purchase_order_items').delete().eq('purchase_order_id', orderToDelete.id);
    const { error } = await supabase.from('purchase_orders').delete().eq('id', orderToDelete.id);
    if (error) {
      toast({ variant: 'destructive', title: 'Error deleting PO', description: error.message });
    } else {
      await fetchDataForOrg(activeOrgId);
      toast({ title: "🗑️ Deleted", description: "The purchase order has been deleted." });
    }
    setIsDeleteDialogOpen(false);
    setOrderToDelete(null);
  };

  const handleDownloadPdf = (order) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    if (organizationSettings?.logo) {
        doc.addImage(organizationSettings.logo, 'PNG', 14, 15, 10, 10);
    }
    doc.text(organizationSettings?.name || "PURCHASE ORDER", 105, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    doc.text("Vendor Name:", 14, 35);
    doc.text(order.vendor_name || "N/A", 40, 35);
    doc.rect(80, 25, 116, 20);
    doc.text(`PO No: ${order.po_number}`, 82, 30);
    doc.text(`PRF No: ${order.prf_number || 'N/A'}`, 82, 35);
    doc.text(`Order Date: ${order.order_date}`, 82, 40);

    doc.text("Delivery Date:", 14, 55);
    doc.text(order.delivery_date, 40, 55);
    doc.text("Deliver at:", 80, 55);
    doc.text(order.deliver_at, 100, 55);
    doc.text("Payment Terms:", 140, 55);
    doc.text(order.payment_terms, 170, 55);

    const tableColumn = ["S/N", "Account Code", "Detailed Description", "Unit", "Qty", "Unit Price", "Project Code", "Amount"];
    const tableRows = [];

    (order.items || []).forEach((item, index) => {
      const itemData = [
        index + 1,
        item.accountCode,
        item.description,
        item.unit,
        item.quantity,
        (item.unitPrice || 0).toFixed(2),
        item.projectCode,
        (item.totalCost || 0).toFixed(2)
      ];
      tableRows.push(itemData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 65,
      theme: 'grid',
      headStyles: { fillColor: [22, 163, 74] },
    });

    let finalY = doc.lastAutoTable.finalY;
    doc.text(`Total: $${(order.total_cost || 0).toFixed(2)}`, 190, finalY + 10, { align: 'right' });

    doc.save(`PO_${order.po_number}.pdf`);
    toast({ title: "PDF Generated", description: `PO_${order.po_number}.pdf has been downloaded.` });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">Purchase Orders</h1>
        <Button onClick={handleNewOrder} className="bg-gradient-to-r from-emerald-500 to-green-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Order
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PO Number</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {(purchaseOrders || []).map((order) => (
                  <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} layout>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">{order.po_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.order_date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.vendor_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${(order.total_cost || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditOrder(order)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownloadPdf(order)}>
                            <Download className="mr-2 h-4 w-4" />
                            <span>Download PDF</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteOrder(order)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      <AnimatePresence>
        {isFormOpen && (
          <PurchaseOrderForm
            onSave={handleSaveOrder}
            onCancel={() => setIsFormOpen(false)}
            order={selectedOrder}
            purchaseRequests={purchaseRequests}
            accounts={accounts}
            settings={organizationSettings}
          />
        )}
      </AnimatePresence>
      
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        itemName={orderToDelete?.po_number}
        itemType="Purchase Order"
      />
    </div>
  );
}