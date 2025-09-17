import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Loader2 } from 'lucide-react';
import InviteUserDialog from '@/components/settings/InviteUserDialog';
import EditUserDialog from '@/components/settings/EditUserDialog';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

export default function UsersAndRolesSettings() {
  const { activeOrgId, loadingData } = useOutletContext();
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const { toast } = useToast();

  const fetchMembers = async () => {
    if (!activeOrgId) return;
    setLoadingMembers(true);
    try {
      const { data, error } = await supabase.rpc('get_organization_members', {
        p_organization_id: activeOrgId,
      });
      if (error) throw error;
      setMembers(data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error fetching members',
        description: error.message,
      });
    } finally {
      setLoadingMembers(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [activeOrgId]);

  const handleEdit = (member) => {
    setSelectedMember(member);
    setIsEditOpen(true);
  };

  const handleUpdateUser = async (updatedMemberData) => {
    const { error } = await supabase
      .from('memberships')
      .update({
        role: updatedMemberData.role,
        permissions: updatedMemberData.permissions,
      })
      .eq('organization_id', activeOrgId)
      .eq('user_id', updatedMemberData.user_id);

    if (error) {
      throw new Error(error.message);
    }

    toast({
      title: 'User Updated',
      description: `${updatedMemberData.full_name || updatedMemberData.email}'s role and permissions have been updated.`,
    });
    fetchMembers();
  };

  if (loadingData || loadingMembers) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="ml-4 text-lg text-gray-600">Loading Users & Roles...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-sm border"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Users & Roles</h2>
          <p className="text-gray-500">Manage who has access to your organization.</p>
        </div>
        <Button onClick={() => setIsInviteOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Invite User
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.user_id}>
                <TableCell className="font-medium">{member.full_name || 'N/A'}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>
                  <Badge variant={member.role === 'admin' ? 'default' : 'secondary'}>
                    {member.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(member)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <InviteUserDialog
        isOpen={isInviteOpen}
        setIsOpen={setIsInviteOpen}
        activeOrgId={activeOrgId}
        onInviteSent={fetchMembers}
      />
      {selectedMember && (
        <EditUserDialog
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
          member={selectedMember}
          activeOrgId={activeOrgId}
          onUserUpdated={handleUpdateUser}
        />
      )}
    </motion.div>
  );
}