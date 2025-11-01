import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, X, Video, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { useAuthStore } from '@/stores/authStore';
import { CONFIG } from '@/lib/config';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

export interface MediaFile {
  id: number;
  url: string;
  filename: string;
  type: 'image' | 'video';
  size: number;
  isUploaded: boolean;
  isUploading?: boolean;
}

interface MediaUploadProps {
  onUploadComplete: (mediaIds: number[]) => void;
  onUploadError: (error: string) => void;
  onLoadingChange?: (isLoading: boolean) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  className?: string;
  initialFiles?: Array<{
    id: number;
    url: string;
    filename: string;
    type: 'image' | 'video';
    size?: number;
  }>;
}

export function MediaUpload({
  onUploadComplete,
  onUploadError,
  onLoadingChange,
  maxFiles = 5,
  acceptedTypes = ['image/*', 'video/*'],
  className = '',
  initialFiles
}: MediaUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorText, setErrorText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  // Initialize with existing files (e.g., edit mode)
  useEffect(() => {
    if (initialFiles && initialFiles.length > 0 && uploadedFiles.length === 0) {
      const normalized: MediaFile[] = initialFiles.map(f => ({
        id: f.id,
        url: f.url,
        filename: f.filename,
        type: f.type,
        size: f.size ?? 0,
        isUploaded: true,
      }));
      setUploadedFiles(normalized);
      onUploadComplete(normalized.map(f => f.id));
    }
  }, [initialFiles]);

  // Notify parent of loading state changes
  useEffect(() => {
    const isLoading = uploading || deleting;
    onLoadingChange?.(isLoading);
  }, [uploading, deleting, onLoadingChange]);

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    
    // Clear previous error
    setErrorText('');

    // Check file count
    if (uploadedFiles.length + fileArray.length > maxFiles) {
      onUploadError(`Maximum ${maxFiles} files allowed`);
      setErrorText(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadPromises = fileArray.map(async (file, index) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('media_type', file.type.startsWith('video/') ? 'video' : 'image');


        // Use fetch directly for file uploads to avoid JSON.stringify
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

        // Update progress
        const progress = Math.round(((index + 1) / fileArray.length) * 100);
        setUploadProgress(progress);

        return {
          id: responseData.data.id,
          url: responseData.data.url,
          filename: responseData.data.filename,
          type: file.type.startsWith('video/') ? 'video' as const : 'image' as const,
          size: responseData.data.size ?? file.size,
          isUploaded: true,
        };
      });

      const uploadedMedia = await Promise.all(uploadPromises);
      const newFiles = [...uploadedFiles, ...uploadedMedia];
      
      setUploadedFiles(newFiles);
      setErrorText('');
      onUploadComplete(newFiles.map(file => file.id));
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || t('validation.uploadFailed');
      setErrorText(errorMessage);
      onUploadError(errorMessage);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      // Loading state will be updated by useEffect that watches uploading/deleting
    }
  }, [uploadedFiles, maxFiles, onUploadError, onUploadComplete]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const removeFile = async (fileId: number) => {
    try {
      setDeleting(true);
      
      // Call delete API before removing locally
      const token = useAuthStore.getState().token;
      const response = await fetch(`${CONFIG.api.baseUrl}/api/v1/media/${fileId}`, {
        method: 'DELETE',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = (errorData && errorData.message) ? errorData.message : 'Failed to delete media';
        setErrorText(message);
        onUploadError(message);
        setDeleting(false);
        return;
      }

      const newFiles = uploadedFiles.filter(file => file.id !== fileId);
      setUploadedFiles(newFiles);
      setErrorText('');
      onUploadComplete(newFiles.map(file => file.id));
      
      // Show success toast
      toast.success(t('mediaUpload.deleteSuccess') || 'Media deleted successfully');
      setDeleting(false);
    } catch (e: any) {
      const message = e?.message || 'Failed to delete media';
      setErrorText(message);
      onUploadError(message);
      setDeleting(false);
    }
  };


  const formatFileSize = (bytes: number | undefined | null) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-colors cursor-pointer hover:border-primary/50 ${
          uploading ? 'border-primary' : 'border-muted-foreground/25'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center py-8">
          {uploading ? (
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
              <div className="space-y-2">
                <p className="text-sm font-medium">Uploading files...</p>
                <Progress value={uploadProgress} className="w-48" />
                <p className="text-xs text-muted-foreground">{uploadProgress}% complete</p>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  Images and videos up to {maxFiles} files
                </p>
                <p className="text-xs text-muted-foreground">
                  Accepted: {acceptedTypes.join(', ')}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Inline Error Message */}
      {errorText && (
        <p className="text-sm text-red-500">{errorText}</p>
      )}

      {/* Uploaded Files Preview */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Uploaded Files ({uploadedFiles.length}/{maxFiles})</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="relative group">
                <Card className="overflow-hidden">
                  <CardContent className="p-2">
                    <div className="relative">
                      {file.type === 'image' ? (
                        <ImageWithFallback
                          src={file.url}
                          alt={file.filename}
                          className="w-full max-w-[400px] aspect-square object-cover rounded"
                        />
                      ) : (
                        <div className="w-full max-w-[400px] aspect-square bg-muted flex items-center justify-center rounded">
                          <Video className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      {uploadedFiles.length > 1 && (
                        <button
                          type="button"
                          className="absolute top-1 right-1 h-7 w-7 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 text-red-500 hover:text-red-600 transition-colors shadow-md"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeFile(file.id);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    {file.size !== undefined && file.size !== null && file.size > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
