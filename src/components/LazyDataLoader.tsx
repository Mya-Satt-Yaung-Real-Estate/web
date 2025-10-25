/**
 * LazyDataLoader Component
 * 
 * Lazy loads data when component comes into viewport.
 * Provides loading states and error handling.
 */

import { useState, useEffect, useRef, type ReactNode } from 'react';

interface LazyDataLoaderProps<T> {
  children: (data: T, isLoading: boolean, error: Error | null) => ReactNode;
  dataLoader: () => Promise<T>;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
  onDataLoad?: (data: T) => void;
}

export function LazyDataLoader<T>({
  children,
  dataLoader,
  fallback = <div className="h-32 bg-muted/20 animate-pulse rounded-lg" />,
  rootMargin = '100px',
  threshold = 0.1,
  className = '',
  onDataLoad,
}: LazyDataLoaderProps<T>) {
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          loadData();
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasLoaded, rootMargin, threshold]);

  const loadData = async () => {
    if (hasLoaded) return;
    
    setIsLoading(true);
    setError(null);
    setHasLoaded(true);

    try {
      const result = await dataLoader();
      setData(result);
      onDataLoad?.(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load data'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={sectionRef} className={className}>
      {isVisible ? (
        <div className="animate-fade-in">
          {children(data as T, isLoading, error)}
        </div>
      ) : (
        fallback
      )}
    </div>
  );
}
