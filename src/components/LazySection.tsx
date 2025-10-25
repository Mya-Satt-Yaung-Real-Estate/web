/**
 * LazySection Component
 * 
 * Lazy loads content when it comes into viewport using Intersection Observer.
 * Provides loading state and smooth transitions.
 */

import { useState, useEffect, useRef, type ReactNode } from 'react';

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
  onLoad?: () => void;
}

export function LazySection({
  children,
  fallback = <div className="h-32 bg-muted/20 animate-pulse rounded-lg" />,
  rootMargin = '100px',
  threshold = 0.1,
  className = '',
  onLoad,
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoaded) {
          setIsVisible(true);
          setIsLoaded(true);
          onLoad?.();
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
  }, [isLoaded, onLoad, rootMargin, threshold]);

  return (
    <div ref={sectionRef} className={className}>
      {isVisible ? (
        <div className="animate-fade-in">
          {children}
        </div>
      ) : (
        fallback
      )}
    </div>
  );
}
