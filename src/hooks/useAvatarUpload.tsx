import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useAvatarUpload = () => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  const uploadAvatar = async (file: File): Promise<{ url: string | null; error: Error | null }> => {
    if (!user) {
      return { url: null, error: new Error("Not authenticated") };
    }

    setUploading(true);

    try {
      // Create unique file path using user id
      const fileExt = file.name.split(".").pop();
      const fileName = `avatar.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Delete existing avatar if any
      await supabase.storage.from("avatars").remove([filePath]);

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Add timestamp to bust cache
      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      return { url: publicUrl, error: null };
    } catch (error) {
      console.error("Error uploading avatar:", error);
      return { url: null, error: error as Error };
    } finally {
      setUploading(false);
    }
  };

  return { uploadAvatar, uploading };
};
