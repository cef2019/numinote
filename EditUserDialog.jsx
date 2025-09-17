import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const modulePermissions = [
  { id: 'finance', name: 'Finance' },
  { id: 'hr', name: 'Human Resources' },
  { id: 'supply_chain', name: 'Supply Chain' },
  { id: 'projects', name: 'Projects' },
  { id: 'reports', name: 'Reports' },
];

export default function EditUserDialog({ isOpen, setIsOpen, member, activeOrgId, onUserUpdated }) {
  const [role, setRole] = useState('');
  const [permissions, setPermissions] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (member) {
      setRole(member.role);
      setPermissions(member.permissions || {});
    }
  }, [member]);

  const handlePermissionChange = (moduleId, value) => {
    setPermissions(prev => ({ ...prev, [moduleId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onUserUpdated({
        ...member,
        role,
        permissions: role === 'admin' ? {} : permissions,
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to update user',
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!member) return null;

  const displayName = member.full_name || member.email;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit User: {displayName}</DialogTitle>
            <DialogDescription>
              Update the user's role and permissions within the organization.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
                        <Select
                          value={permissions[mod.id] || 'none'}
                          onValueChange={(value) => handlePermissionChange(mod.id, value)}
                        >
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
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}