import { supabase, isSupabaseConfigured } from '../supabase/client';

const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

export const StorageService = {
  /**
   * Uploads a vehicle image to the Supabase Storage 'vehicles' bucket.
   * Validates MIME type and file size.
   */
  async uploadVehicleImage(vehicleId: string, imageSource: string): Promise<string> {
    if (!isSupabaseConfigured || !supabase) {
      return imageSource;
    }

    // If it's already an HTTP/HTTPS URL, return as-is
    if (!imageSource.startsWith('data:')) {
      return imageSource;
    }

    try {
      const [header, base64Data] = imageSource.split(',');
      const mimeMatch = header.match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';

      if (!ALLOWED_IMAGE_MIME_TYPES.includes(mime)) {
        throw new Error(`Unsupported image type: ${mime}. Allowed types: JPEG, PNG, WEBP.`);
      }

      const binary = atob(base64Data);
      if (binary.length > MAX_IMAGE_SIZE_BYTES) {
        throw new Error('Image exceeds maximum allowed size of 15MB.');
      }

      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([array], { type: mime });
      const extension = mime.split('/')[1] || 'jpg';
      const fileName = `vehicles/${vehicleId}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${extension}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('vehicles')
        .upload(fileName, blob, {
          contentType: mime,
          upsert: true
        });

      if (uploadError) {
        console.warn('Supabase storage upload warning:', uploadError.message);
        return imageSource;
      }

      const { data: publicUrlData } = supabase.storage
        .from('vehicles')
        .getPublicUrl(uploadData.path);

      return publicUrlData?.publicUrl || imageSource;
    } catch (err) {
      console.warn('StorageService.uploadVehicleImage error:', err);
      return imageSource;
    }
  },

  /**
   * Uploads an avatar image to the Supabase Storage 'avatars' bucket.
   */
  async uploadAvatar(userId: string, imageSource: string): Promise<string> {
    if (!isSupabaseConfigured || !supabase || !imageSource.startsWith('data:')) {
      return imageSource;
    }

    try {
      const [header, base64Data] = imageSource.split(',');
      const mimeMatch = header.match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';

      const binary = atob(base64Data);
      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([array], { type: mime });
      const extension = mime.split('/')[1] || 'jpg';
      const fileName = `avatars/${userId}/${Date.now()}.${extension}`;

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, blob, { contentType: mime, upsert: true });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.path);

      return publicUrlData?.publicUrl || imageSource;
    } catch (err) {
      console.warn('StorageService.uploadAvatar error:', err);
      return imageSource;
    }
  }
};

export const uploadVehicleImageToSupabase = StorageService.uploadVehicleImage;
