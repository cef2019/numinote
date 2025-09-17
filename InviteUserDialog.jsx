import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

const modulePermissions = [
  { id: 'finance', name: 'Finance' },
  { id: 'hr', name: 'Human Resources' },
  { id: 'supply_chain', name: 'Supply Chain' },
  { id: 'projects', name: 'Projects' },
  { id: 'reports', name: 'Reports' },
];

export default function InviteUserDialog({ isOpen, setIsOpen, onInviteSent, activeOrgId }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [permissions, setPermissions] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handlePermissionChange = (moduleId, value) => {
    setPermissions(prev => ({ ...prev, [moduleId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeOrgId) {
      toast({ variant: 'destructive', title: 'No active organization selected.' });
      return;
    }
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('invite-user', {
        body: {
          organization_id: activeOrgId,
          email,
          role,
          permissions: role === 'admin' ? {} : permissions,
        },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      toast({
        title: 'Invitation Sent!',
        description: `An invitation has been sent to ${email}.`,
      });
      onInviteSent();
      setIsOpen(false);
      setEmail('');
      setRole('member');
      setPermissions({});
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to send invitation',
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Invite a new user</DialogTitle>
            <DialogDescription>
              Enter the user's email and set their role and permissions within the organization.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {role === 'member' && (
              <div>
                <h4 className="font-medium text-sm mb-2 mt-4">Module Permissions</h4>
                <div className="space-y-2 rounded-md border p-4">
                  {modulePermissions.map(mod => (
                    <div key={mod.id} className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor={`perm-${mod.id}`}>{mod.name}</Label>
                      <div className="col-span-2">
                        <Select onValueChange={(value) => handlePermissionChange(mod.id, value)} defaultValue="none">
                          <SelectTrigger>
                            <SelectValue placeholder="No Access" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No Access</SelectItem>
                            <SelectItem value="read">Read-Only</SelectItem>
                            <SelectItem value="write">Read & Write</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Invitation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}