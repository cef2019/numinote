import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SettingsPanel from '@/components/settings/SettingsPanel';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useOutletContext } from 'react-router-dom';

const DisplayItem = ({ label, value }) => (
  <div className="flex text-sm">
    <dt className="w-1/3 text-gray-500">{label}</dt>
    <dd className="w-2/3 text-gray-700 font-medium">{value}</dd>
  </div>
);

const defaultSalesSettings = {
  defaultTerms: 'Net 30',
  defaultTitle: 'Invoice',
  defaultMemo: 'Thank you for your partnership!',
};

export default function SalesSettings() {
  const { organizationSettings, setOrganizationSettings, activeOrgId, loadingData } = useOutletContext();
  const [salesSettings, setSalesSettings] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (organizationSettings) {
      setSalesSettings(organizationSettings.sales || defaultSalesSettings);
    }
  }, [organizationSettings]);

  const handleChange = (id, value) => {
    setSalesSettings((prev) => ({ ...prev, [id]: value }));
  };

  const onSave = async () => {
    if (!activeOrgId || !salesSettings) return;
    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('organization_settings')
        .update({ sales: salesSettings })
        .eq('organization_id', activeOrgId)
        .select()
        .single();

      if (error) throw error;
      
      setOrganizationSettings(data);
      return { success: true };
    } catch (error) {
      console.error("Error saving settings:", error);
      return { success: false, error };
    } finally {
      setIsSaving(false);
    }
  };

  if (loadingData || !salesSettings) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="ml-4 text-lg text-gray-600">Loading Sales Settings...</p>
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
        title="Default Invoice Settings"
        description="Set default values for new invoices."
        data={salesSettings}
        onSave={onSave}
        isSaving={isSaving}
        renderDisplay={(data) => (
          <dl className="space-y-1">
            <DisplayItem label="Default terms" value={data.defaultTerms} />
            <DisplayItem label="Default title" value={data.defaultTitle} />
            <DisplayItem label="Default memo" value={data.defaultMemo} />
          </dl>
        )}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="defaultTerms">Default terms</Label>
            <Input
              id="defaultTerms"
              value={salesSettings.defaultTerms || ''}
              onChange={(e) => handleChange('defaultTerms', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="defaultTitle">Default title</Label>
            <Input
              id="defaultTitle"
              value={salesSettings.defaultTitle || ''}
              onChange={(e) => handleChange('defaultTitle', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="defaultMemo">Default memo</Label>
            <Textarea
              id="defaultMemo"
              value={salesSettings.defaultMemo || ''}
              onChange={(e) => handleChange('defaultMemo', e.target.value)}
            />
          </div>
        </div>
      </SettingsPanel>
    </motion.div>
  );
}