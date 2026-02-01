import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface UseDocumentUploadReturn {
  uploadDocument: (file: File, documentType: "license" | "vehicle_registration") => Promise<{ url: string | null; error: Error | null }>;
  uploading: boolean;
  progress: number;
}

export const useDocumentUpload = (): UseDocumentUploadReturn => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadDocument = async (
    file: File,
    documentType: "license" | "vehicle_registration"
  ): Promise<{ url: string | null; error: Error | null }> => {
    if (!user) {
      return { url: null, error: new Error("User not authenticated") };
    }

    setUploading(true);
    setProgress(0);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${documentType}_${Date.now()}.${fileExt}`;

      // Upload to provider-documents bucket
      const { error: uploadError } = await supabase.storage
        .from("provider-documents")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      setProgress(100);

      // Get public URL (though bucket is private, we store the path)
      const { data } = supabase.storage
        .from("provider-documents")
        .getPublicUrl(fileName);

      return { url: data.publicUrl, error: null };
    } catch (error) {
      return { url: null, error: error as Error };
    } finally {
      setUploading(false);
    }
  };

  return { uploadDocument, uploading, progress };
};
