/**
 * Lazy load with retry mechanism for handling chunk load errors
 * This is especially useful in production when chunks might fail to load
 * due to network issues, caching problems, or deployment issues.
 */

import React from 'react';

export function lazyWithRetry<T extends React.ComponentType<any>>(
  componentImport: () => Promise<{ default: T } | T>,
  retries = 3,
  delay = 1000
): React.LazyExoticComponent<T> {
  return React.lazy(async () => {
    const result = await retryImport(componentImport, retries, delay);
    // Ensure the result has the correct structure for React.lazy
    if ('default' in result) {
      return result as { default: T };
    }
    return { default: result as T };
  });
}

async function retryImport<T>(
  importFn: () => Promise<T>,
  retries: number,
  delay: number
): Promise<T> {
  try {
    return await importFn();
  } catch (error) {
    // Check if it's a chunk load error
    if (
      error instanceof Error &&
      (error.message.includes('Failed to fetch dynamically imported module') ||
        error.message.includes('Loading chunk') ||
        error.message.includes('Loading CSS chunk') ||
        error.name === 'ChunkLoadError')
    ) {
      if (retries > 0) {
        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, delay));
        // Force reload the page on last retry if still failing
        if (retries === 1) {
          console.warn('Chunk load error: Reloading page...');
          window.location.reload();
          // Return a promise that never resolves to prevent rendering
          return new Promise(() => {});
        }
        // Retry the import
        return retryImport(importFn, retries - 1, delay);
      }
    }
    // If it's not a chunk load error or retries exhausted, throw
    throw error;
  }
}

