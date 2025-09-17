import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SettingsPanel from '@/components/settings/SettingsPanel';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useOutletContext } from 'react-router-dom';

const DisplayItem = ({ label, value }) => (
  <div className="flex text-sm">
    <dt className="w-1/2 text-gray-500">{label}</dt>
    <dd className="w-1/2 text-gray-700 font-medium">{value}</dd>
  </div>
);

const defaultExpensesSettings = {
  defaultPaymentTerms: 'Net 30',
  trackExpensesByProject: true,
};

export default function ExpensesSettings() {
  const { organizationSettings, setOrganizationSettings, activeOrgId, loadingData } = useOutletContext();
  const [expensesSettings, setExpensesSettings] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (organizationSettings) {
      setExpensesSettings(organizationSettings.expenses || defaultExpensesSettings);
    }
  }, [organizationSettings]);

  const handleChange = (id, value) => {
    setExpensesSettings((prev) => ({ ...prev, [id]: value }));
  };

  const onSave = async () => {
    if (!activeOrgId || !expensesSettings) return;
    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('organization_settings')
        .update({ expenses: expensesSettings })
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

  if (loadingData || !expensesSettings) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="ml-4 text-lg text-gray-600">Loading Expenses Settings...</p>
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
        title="Default Expense Settings"
        description="Set default values for new bills and expenses."
        data={expensesSettings}
        onSave={onSave}
        isSaving={isSaving}
        renderDisplay={(data) => (
          <dl className="space-y-1">
            <DisplayItem label="Default payment terms" value={data.defaultPaymentTerms} />
            <DisplayItem label="Track expenses by project" value={data.trackExpensesByProject ? 'On' : 'Off'} />
          </dl>
        )}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="defaultPaymentTerms">Default payment terms</Label>
            <Input
              id="defaultPaymentTerms"
              value={expensesSettings.defaultPaymentTerms || ''}
              onChange={(e) => handleChange('defaultPaymentTerms', e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="trackExpensesByProject">Track expenses and items by project</Label>
            <Switch
              id="trackExpensesByProject"
              checked={!!expensesSettings.trackExpensesByProject}
              onCheckedChange={(checked) => handleChange('trackExpensesByProject', checked)}
            />
          </div>
        </div>
      </SettingsPanel>
    </motion.div>
  );
}