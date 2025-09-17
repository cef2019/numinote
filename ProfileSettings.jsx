import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SettingsPanel from '@/components/settings/SettingsPanel';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const DisplayItem = ({ label, value }) => (
  <div className="flex text-sm">
    <dt className="w-1/3 text-gray-500">{label}</dt>
    <dd className="w-2/3 text-gray-700 font-medium">{value}</dd>
  </div>
);

export default function ProfileSettings() {
  const { userProfile, loadingData } = useOutletContext();
  const { refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userProfile) {
      setProfile({
        full_name: userProfile.full_name || '',
        email: userProfile.email || '',
      });
    }
  }, [userProfile]);

  const handleChange = (id, value) => {
    setProfile((prev) => ({ ...prev, [id]: value }));
  };

  const onSave = async () => {
    if (!profile) return;
    setIsSaving(true);
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { full_name: profile.full_name },
      });

      if (error) throw error;
      
      await refreshUser();
      return { success: true };
    } catch (error) {
      console.error("Error saving profile:", error);
      return { success: false, error };
    } finally {
      setIsSaving(false);
    }
  };

  if (loadingData || !profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="ml-4 text-lg text-gray-600">Loading Profile...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-sm border"
    >
      <SettingsPanel
        title="Your Profile"
        description="Update your personal information."
        data={profile}
        onSave={onSave}
        isSaving={isSaving}
        renderDisplay={(data) => (
          <dl className="space-y-1">
            <DisplayItem label="Full Name" value={data.full_name} />
            <DisplayItem label="Email" value={data.email} />
          </dl>
        )}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="full_name">Full Name</Label>
            <Input id="full_name" value={profile.full_name} onChange={(e) => handleChange('full_name', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={profile.email} disabled />
            <p className="text-xs text-gray-500 mt-1">Email address cannot be changed.</p>
          </div>
        </div>
      </SettingsPanel>
    </motion.div>
  );
}