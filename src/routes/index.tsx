import { createBrowserRouter } from 'react-router-dom';
import { Suspense } from 'react';
import { PageLoader } from './components/shared';
import { Layout } from './components/layout';
import { lazyWithRetry } from '../utils/lazyWithRetry';

// Import feature routes
import { publicRoutes } from './public';
import { protectedRoutes } from './protected';

// Lazy load NotFoundPage with retry mechanism
const NotFoundPage = lazyWithRetry(() => import('../pages/NotFound').then(module => ({ default: module.NotFound })));

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
