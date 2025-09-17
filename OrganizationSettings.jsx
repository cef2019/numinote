import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SettingsPanel from '@/components/settings/SettingsPanel';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useOutletContext } from 'react-router-dom';
import ImageUpload from '@/components/ImageUpload';
import { Textarea } from '@/components/ui/textarea';

const DisplayItem = ({ label, value }) => (
  <div className="flex text-sm py-1">
    <dt className="w-1/3 text-gray-500">{label}</dt>
    <dd className="w-2/3 text-gray-700 font-medium whitespace-pre-wrap">{value}</dd>
  </div>
);

export default function OrganizationSettings() {
  const { organizationSettings, fetchDataForOrg, activeOrgId, loadingData } = useOutletContext();
  const [orgDetails, setOrgDetails] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (organizationSettings) {
      setOrgDetails({
        name: organizationSettings.name || '',
        logo: organizationSettings.logo || '',
        email: organizationSettings.email || '',
        phone: organizationSettings.phone || '',
        website: organizationSettings.website || '',
        address: organizationSettings.address || '',
      });
    }
  }, [organizationSettings]);

  const handleChange = (id, value) => {
    setOrgDetails((prev) => ({ ...prev, [id]: value }));
  };

  const handleLogoUpload = (url) => {
    setOrgDetails((prev) => ({ ...prev, logo: url }));
  };

  const onSave = async () => {
    if (!activeOrgId || !orgDetails) return;
    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('organization_settings')
        .update({
          name: orgDetails.name,
          logo: orgDetails.logo,
          email: orgDetails.email,
          phone: orgDetails.phone,
          website: orgDetails.website,
          address: orgDetails.address,
        })
        .eq('organization_id', activeOrgId)
        .select()
        .single();

      if (error) throw error;
      
      await fetchDataForOrg(activeOrgId);
      return { success: true };
    } catch (error) {
      console.error("Error saving settings:", error);
      return { success: false, error };
    } finally {
      setIsSaving(false);
    }
  };

  if (loadingData || !orgDetails) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="ml-4 text-lg text-gray-600">Loading Organization Settings...</p>
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
        title="Organization Details"
        description="Update your organization's public information and branding."
        data={orgDetails}
        onSave={onSave}
        isSaving={isSaving}
        renderDisplay={(data) => (
          <dl className="space-y-1">
            <DisplayItem label="Organization Name" value={data.name} />
            {data.logo && (
              <div className="flex text-sm py-1 items-center">
                <dt className="w-1/3 text-gray-500">Logo</dt>
                <dd className="w-2/3">
                  <img src={data.logo} className="h-10 w-auto rounded-md object-contain" alt={`${data.name} logo`} />
                </dd>
              </div>
            )}
            <DisplayItem label="Contact Email" value={data.email} />
            <DisplayItem label="Phone" value={data.phone} />
            <DisplayItem label="Website" value={data.website} />
            <DisplayItem label="Address" value={data.address} />
          </dl>
        )}
      >
        <div className="space-y-4">
          <div>
            <Label>Logo</Label>
            <ImageUpload
              bucketName="organization-logos"
              filePath={`${activeOrgId}/logo`}
              currentImageUrl={orgDetails.logo}
              onUploadSuccess={handleLogoUpload}
            />
          </div>
          <div>
            <Label htmlFor="name">Organization Name</Label>
            <Input id="name" value={orgDetails.name} onChange={(e) => handleChange('name', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="email">Contact Email</Label>
            <Input id="email" type="email" value={orgDetails.email} onChange={(e) => handleChange('email', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={orgDetails.phone} onChange={(e) => handleChange('phone', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="website">Website</Label>
            <Input id="website" placeholder="https://example.com" value={orgDetails.website} onChange={(e) => handleChange('website', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" value={orgDetails.address} onChange={(e) => handleChange('address', e.target.value)} />
          </div>
        </div>
      </SettingsPanel>
    </motion.div>
  );
}