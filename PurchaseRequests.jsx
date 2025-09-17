import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreVertical, Edit, Trash2, FileText, CheckCircle, XCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import PurchaseRequestForm from '@/pages/supply-chain/PurchaseRequestForm';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { supabase } from '@/lib/customSupabaseClient';
import { useOutletContext } from 'react-router-dom';

export default function PurchaseRequests() {
  const { purchaseRequests = [], accounts, projects, organizationSettings, activeOrgId, fetchDataForOrg } = useOutletContext();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);

  const handleNewRequest = () => {
    setSelectedRequest(null);
    setIsFormOpen(true);
  };

  const handleEditRequest = (request) => {
    setSelectedRequest(request);
    setIsFormOpen(true);
  };

  const handleSaveRequest = async (formData) => {
    const { items, ...mainData } = formData;
    
    // Calculate total cost from items
    const totalCost = items.reduce((sum, item) => sum + (parseFloat(item.total_cost) || 0), 0);

    const dataToSave = { 
        ...mainData, 
        organization_id: activeOrgId,
        total_cost: totalCost
    };
    
    // Remove id from data to save to avoid issues on insert
    if (!selectedRequest) {
      delete dataToSave.id;
    }

    let requestId;
    let error;
    
    if (selectedRequest) {
      const { data, error: updateError } = await supabase
        .from('purchase_requests')
        .update(dataToSave)
        .eq('id', selectedRequest.id)
        .select()
        .single();
      if(updateError) error = updateError;
      else requestId = data.id;

    } else {
      const { data, error: insertError } = await supabase
        .from('purchase_requests')
        .insert(dataToSave)
        .select()
        .single();
       if(insertError) error = insertError;
       else requestId = data.id;
    }

    if (error) {
        toast({ variant: 'destructive', title: 'Error saving Purchase Request', description: error.message });
        return;
    }

    // Upsert items
    const { error: deleteItemsError } = await supabase.from('purchase_request_items').delete().eq('purchase_request_id', requestId);
    if(deleteItemsError) {
        toast({ variant: 'destructive', title: 'Error updating items', description: deleteItemsError.message });
    }

    if(items && items.length > 0) {
        const itemsToInsert = items.map(item => ({
            purchase_request_id: requestId,
            account_id: item.account_id,
            description: item.description,
            unit: item.unit,
            quantity: item.quantity,
            unit_cost: item.unit_cost,
            total_cost: item.total_cost,
        }));
        const { error: insertItemsError } = await supabase.from('purchase_request_items').insert(itemsToInsert);
        if(insertItemsError) {
            toast({ variant: 'destructive', title: 'Error saving items', description: insertItemsError.message });
        }
    }
    
    toast({ title: 'Success', description: `Purchase Request ${selectedRequest ? 'updated' : 'created'} successfully.` });
    await fetchDataForOrg(activeOrgId);
    setIsFormOpen(false);
    setSelectedRequest(null);
  };

  const handleDeleteRequest = (request) => {
    setRequestToDelete(request);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!requestToDelete) return;
    await supabase.from('purchase_request_items').delete().eq('purchase_request_id', requestToDelete.id);
    const { error } = await supabase.from('purchase_requests').delete().eq('id', requestToDelete.id);
    if (error) {
      toast({ variant: 'destructive', title: 'Error deleting PR', description: error.message });
    } else {
      await fetchDataForOrg(activeOrgId);
      toast({ title: "🗑️ Deleted", description: "The purchase request has been deleted." });
    }
    setIsDeleteDialogOpen(false);
    setRequestToDelete(null);
  };
  
  const updateStatus = async (request, newStatus) => {
      const { error } = await supabase.from('purchase_requests').update({ status: newStatus }).eq('id', request.id);
      if(error) {
          toast({ variant: 'destructive', title: 'Error updating status', description: error.message });
      } else {
          await fetchDataForOrg(activeOrgId);
          toast({ title: 'Status Updated', description: `Request ${request.prf_number} has been ${newStatus}.`});
      }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
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
        <h1 className="text-3xl font-bold text-gray-800">Purchase Requests</h1>
        <Button onClick={handleNewRequest} className="bg-gradient-to-r from-emerald-500 to-green-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Request
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRF Number</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {(purchaseRequests || []).map((request) => (
                  <motion.tr key={request.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} layout>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">{request.prf_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.date_of_request}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{request.purpose_of_request}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${(request.total_cost || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
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
                           <DropdownMenuItem onClick={() => handleEditRequest(request)}><Edit className="mr-2 h-4 w-4" /><span>Edit</span></DropdownMenuItem>
                           <DropdownMenuItem onClick={() => updateStatus(request, 'Pending')}><Send className="mr-2 h-4 w-4" /><span>Submit for Approval</span></DropdownMenuItem>
                           <DropdownMenuItem onClick={() => updateStatus(request, 'Approved')}><CheckCircle className="mr-2 h-4 w-4" /><span>Approve</span></DropdownMenuItem>
                           <DropdownMenuItem onClick={() => updateStatus(request, 'Rejected')} className="text-red-600"><XCircle className="mr-2 h-4 w-4" /><span>Reject</span></DropdownMenuItem>
                           <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteRequest(request)}><Trash2 className="mr-2 h-4 w-4" /><span>Delete</span></DropdownMenuItem>
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

      
      {isFormOpen && (
          <PurchaseRequestForm
            open={isFormOpen}
            onOpenChange={setIsFormOpen}
            onSave={handleSaveRequest}
            purchaseRequest={selectedRequest}
            accounts={accounts}
            projects={projects}
          />
      )}
      
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        itemName={requestToDelete?.prf_number}
        itemType="Purchase Request"
      />
    </div>
  );
}