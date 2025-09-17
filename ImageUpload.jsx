import React, { useState, useRef } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, X } from 'lucide-react';

export default function ImageUpload({
  bucketName,
  filePath,
  currentImageUrl,
  onUploadSuccess,
}) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      handleUpload(file);
    }
  };

  const handleUpload = async (file) => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please select an image to upload.',
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${filePath}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      onUploadSuccess(publicUrl);
      setPreviewUrl(null); 
      toast({
        title: 'Upload Successful!',
        description: 'Your image has been uploaded.',
        variant: 'success',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: error.message,
      });
    } finally {
      setUploading(false);
      if(fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };
  
  const displayUrl = previewUrl || currentImageUrl;

  return (
    <div className="flex items-center gap-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/png, image/jpeg, image/gif, image/svg+xml"
        className="hidden"
        disabled={uploading}
      />
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border">
        {displayUrl ? (
          <img src={displayUrl} alt="Logo Preview" className="w-full h-full object-cover" />
        ) : (
          <Upload className="w-8 h-8 text-gray-400" />
        )}
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={triggerFileSelect}
        disabled={uploading}
      >
        {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
        {uploading ? 'Uploading...' : 'Change Logo'}
      </Button>
    </div>
  );
}