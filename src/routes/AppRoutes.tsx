import { Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import { routes } from './index';
import { ProtectedRoute } from './ProtectedRoute';
import { NotFound } from '../pages/NotFound';

// Loading component for lazy loading
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {routes.map((route) => {
          const { 
            path, 
            component: Component, 
            protected: isProtected, 
            roles, 
            memberLevels, 
            guestAllowed, 
            redirectTo 
          } = route;
          
          // Wrap protected routes with ProtectedRoute component
          if (isProtected) {
            return (
              <Route
                key={path}
                path={path}
                element={
                  <ProtectedRoute 
                    roles={roles}
                    memberLevels={memberLevels}
                    guestAllowed={guestAllowed}
                    redirectTo={redirectTo}
                  >
                    <Component />
                  </ProtectedRoute>
                }
              />
            );
          }
          
          // Public routes don't need protection
          return (
            <Route
              key={path}
              path={path}
              element={<Component />}
            />
          );
        })}
        
        {/* 404 Route - Catch all unmatched routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
