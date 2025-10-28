import { lazy } from 'react';

// Lazy load shared components
const ProtectedRoute = lazy(() => import('./ProtectedRoute').then(module => ({ default: module.ProtectedRoute })));

// Page loader component
export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Export shared components
export { ProtectedRoute };
