import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SettingsPanel from '@/components/settings/SettingsPanel';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
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

const defaultAdvancedSettings = {
  fiscalYearStart: 'January',
  accountingMethod: 'Accrual',
  enableCategories: true,
};

export default function AdvancedSettings() {
  const { organizationSettings, setOrganizationSettings, activeOrgId, loadingData } = useOutletContext();
  const [advancedSettings, setAdvancedSettings] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (organizationSettings) {
      setAdvancedSettings(organizationSettings.advanced || defaultAdvancedSettings);
    }
  }, [organizationSettings]);

  const handleSelectChange = (id, value) => {
    setAdvancedSettings((prev) => ({ ...prev, [id]: value }));
  };

  const handleSwitchChange = (id, checked) => {
    setAdvancedSettings((prev) => ({ ...prev, [id]: checked }));
  };

  const onSave = async () => {
    if (!activeOrgId || !advancedSettings) return;
    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('organization_settings')
        .update({ advanced: advancedSettings })
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
  
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  if (loadingData || !advancedSettings) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="ml-4 text-lg text-gray-600">Loading Advanced Settings...</p>
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
        title="Accounting"
        description="Set your fiscal year and accounting method."
        data={advancedSettings}
        onSave={onSave}
        isSaving={isSaving}
        renderDisplay={(data) => (
          <dl className="space-y-1">
            <DisplayItem label="First month of fiscal year" value={data.fiscalYearStart} />
            <DisplayItem label="Accounting method" value={data.accountingMethod} />
          </dl>
        )}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="fiscalYearStart">First month of fiscal year</Label>
            <Select id="fiscalYearStart" value={advancedSettings.fiscalYearStart || ''} onValueChange={value => handleSelectChange('fiscalYearStart', value)}>
              <SelectTrigger><SelectValue placeholder="Select a month" /></SelectTrigger>
              <SelectContent>
                {months.map(month => <SelectItem key={month} value={month}>{month}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="accountingMethod">Accounting method</Label>
            <Select id="accountingMethod" value={advancedSettings.accountingMethod || ''} onValueChange={value => handleSelectChange('accountingMethod', value)}>
              <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Accrual">Accrual</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SettingsPanel>

      <SettingsPanel
        title="Categories"
        description="Organize your finances with categories."
        data={advancedSettings}
        onSave={onSave}
        isSaving={isSaving}
        renderDisplay={(data) => (
          <dl className="space-y-1">
            <DisplayItem label="Enable categories" value={data.enableCategories ? 'On' : 'Off'} />
          </dl>
        )}
      >
        <div className="flex items-center justify-between">
          <Label htmlFor="enableCategories">Enable categories</Label>
          <Switch id="enableCategories" checked={!!advancedSettings.enableCategories} onCheckedChange={checked => handleSwitchChange('enableCategories', checked)} />
        </div>
      </SettingsPanel>
    </motion.div>
  );
}