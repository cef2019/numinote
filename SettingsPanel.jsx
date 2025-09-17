import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Pencil, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function SettingsPanel({
  title,
  description,
  children,
  data,
  onSave,
  isSaving,
  renderDisplay,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    const result = await onSave();
    if (result && result.success) {
      toast({
        title: '✅ Success!',
        description: `${title} settings have been updated.`,
      });
      setIsEditing(false);
    } else {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: result?.error?.message || 'There was a problem saving your settings.',
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <motion.div
      layout
      className="border-b last:border-b-0 py-6"
    >
      <motion.div layout="position" className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          {!isEditing && (
            <div className="mt-2 text-gray-600 pr-8">{renderDisplay(data)}</div>
          )}
        </div>
        {!isEditing && (
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} disabled={isSaving}>
            <Pencil className="w-5 h-5 text-blue-600" />
            <span className="sr-only">Edit</span>
          </Button>
        )}
      </motion.div>

      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-4"
        >
          {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
          <div className="space-y-4">
            {children}
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white" disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}