import { useEffect, useState } from 'react';

interface UseImagePreloadOptions {
  src: string | null;
  enabled?: boolean;
}

export function useImagePreload({ src, enabled = true }: UseImagePreloadOptions) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src || !enabled) {
      setIsLoaded(false);
      setHasError(false);
      return;
    }

    const img = new Image();
    
    const handleLoad = () => {
      setIsLoaded(true);
      setHasError(false);
    };

    const handleError = () => {
      setIsLoaded(false);
      setHasError(true);
    };

    img.onload = handleLoad;
    img.onerror = handleError;
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, enabled]);

  return { isLoaded, hasError };
}

