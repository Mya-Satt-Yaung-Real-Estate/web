import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { PageLoader } from './components/shared';
import { Layout } from './components/layout';

// Import feature routes
import { publicRoutes } from './public';
import { protectedRoutes } from './protected';

// Lazy load NotFoundPage
const NotFoundPage = lazy(() => import('../pages/NotFound').then(module => ({ default: module.NotFound })));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // Feature routes
      ...publicRoutes,
      ...protectedRoutes,
    ],
  },
  
  // Catch-all route
  {
    path: '*',
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
]);
