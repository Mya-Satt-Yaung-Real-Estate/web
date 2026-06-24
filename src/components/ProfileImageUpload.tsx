import { useState, useRef, useCallback } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { useAuthStore } from '@/stores/authStore';
import { CONFIG } from '@/lib/config';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface ProfileImageUploadProps {
  onUploadComplete: (mediaId: number | null) => void;
  onUploadError: (error: string) => void;
  onLoadingChange?: (isLoading: boolean) => void;
  initialImage?: {
    id: number;
    url: string;
  } | null;
  disabled?: boolean;
  className?: string;
  variant?: 'profile' | 'cover';
}

export function ProfileImageUpload({
  onUploadComplete,
  onUploadError,
  onLoadingChange,
  initialImage,
  disabled = false,
  className = '',
  variant = 'profile',
}: ProfileImageUploadProps) {
  const [uploadedImage, setUploadedImage] = useState<{
    id: number;
    url: string;
  } | null>(initialImage || null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorText, setErrorText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  // Notify parent of loading state changes
  const notifyLoading = useCallback((isLoading: boolean) => {
    onLoadingChange?.(isLoading);
  }, [onLoadingChange]);

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Clear previous error
    setErrorText('');

    // Check file type
    if (!file.type.startsWith('image/')) {
      const error = t('validation.imageRequired') || 'Please select an image file';
      setErrorText(error);
      onUploadError(error);
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    notifyLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('media_type', 'image');

      // Use fetch directly for file uploads
      const token = useAuthStore.getState().token;
      const response = await fetch(`${CONFIG.api.baseUrl}/api/v1/media`, {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        const translated = (errorData?.errors?.file?.length
          ? t('validation.fileRequired')
          : errorData?.errors?.media_type?.length
          ? t('validation.mediaTypeRequired')
          : (errorData?.message || t('validation.uploadFailed')));
        setErrorText(translated);
        onUploadError(translated);
        throw new Error(translated);
      }

      const responseData = await response.json();
      setUploadProgress(100);

      const newImage = {
        id: responseData.data.id,
        url: responseData.data.url,
      };

      setUploadedImage(newImage);
      onUploadComplete(newImage.id);
      toast.success(t('validation.uploadSuccess') || 'Image uploaded successfully');
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error.message || t('validation.uploadFailed') || 'Upload failed';
      setErrorText(errorMessage);
      onUploadError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUploading(false);
      notifyLoading(false);
      setUploadProgress(0);
    }
  }, [t, onUploadError, onUploadComplete, notifyLoading]);

  const handleRemove = useCallback(() => {
    setUploadedImage(null);
    onUploadComplete(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onUploadComplete]);

  const handleClick = () => {
    if (disabled || uploading) return;
    fileInputRef.current?.click();
  };

  const isCover = variant === 'cover';
  const previewClassName = isCover
    ? 'w-[480px] max-w-full h-[240px] rounded-lg overflow-hidden'
    : 'w-[240px] max-w-full aspect-square rounded-lg overflow-hidden';
  const dropzoneClassName = isCover
    ? 'flex flex-col items-center justify-center gap-4 w-[480px] max-w-full h-[240px] p-4'
    : 'flex flex-col items-center justify-center gap-4 w-[240px] h-[240px]';
  const uploadLabel = isCover
    ? (t('editProfile.uploadCoverImage') || 'Upload Cover Image')
    : (t('profile.uploadImage') || 'Upload Profile Image');
  const previewAlt = isCover ? 'Cover image' : 'Profile image';

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
        disabled={disabled || uploading}
      />

      {uploadedImage ? (
        <Card className="relative w-fit">
          <CardContent className="!p-0">
            <div className="relative group">
              <div className={previewClassName}>
                <ImageWithFallback
                  src={uploadedImage.url}
                  alt={previewAlt}
                  className="w-full h-full object-cover"
                />
              </div>
              {!disabled && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 opacity-100 transition-opacity shadow-lg"
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card
          className={`cursor-pointer border-dashed hover:border-primary transition-colors w-fit ${
            disabled || uploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleClick}
        >
          <CardContent className="p-0">
            <div className={dropzoneClassName}>
              {uploading ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <div className="w-full">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-2 text-center">
                      {uploadProgress}%
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-sm font-medium">
                      {uploadLabel}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('profile.imageFormat') || 'PNG, JPG up to 5MB'}
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {errorText && (
        <p className="text-sm text-destructive mt-2">{errorText}</p>
      )}
    </div>
  );
}

