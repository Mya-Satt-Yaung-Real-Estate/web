import { createBrowserRouter } from 'react-router-dom';
import { Suspense } from 'react';
import { PageLoader } from './components/shared';
import { Layout } from './components/layout';
import { lazyWithRetry } from '../utils/lazyWithRetry';

// Import feature routes
import { publicRoutes } from './public';
import { protectedRoutes } from './protected';
import { mobileRoutes } from './mobile';

// Lazy load NotFoundPage with retry mechanism
const NotFoundPage = lazyWithRetry(() => import('../pages/NotFound').then(module => ({ default: module.NotFound })));

// Lazy load Mobile AI Assistant page (standalone, no layout)
const AiAssistantMobile = lazyWithRetry(() => import('../pages/mobile/AiAssistantMobile').then(module => ({ default: module.AiAssistantMobile })));
const MobileRouteGuard = lazyWithRetry(() => import('../components/guards/MobileRouteGuard').then(module => ({ default: module.MobileRouteGuard })));

// Lazy load Mobile Payment pages (standalone, no layout)
const PaymentSuccessMobile = lazyWithRetry(() => import('../pages/mobile/payment/success').then(module => ({ default: module.PaymentSuccessMobile })));
const PaymentFailMobile = lazyWithRetry(() => import('../pages/mobile/payment/fail').then(module => ({ default: module.PaymentFailMobile })));

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
  
  // Mobile AI Assistant - standalone route without Layout, protected by guard
  {
    path: '/mobile/ai-assistant',
    element: (
      <Suspense fallback={<PageLoader />}>
        <MobileRouteGuard>
          <AiAssistantMobile />
        </MobileRouteGuard>
      </Suspense>
    ),
  },
  
  // Mobile Payment Success - standalone route without Layout, protected by guard
  {
    path: '/mobile/payment/success',
    element: (
      <Suspense fallback={<PageLoader />}>
        <MobileRouteGuard>
          <PaymentSuccessMobile />
        </MobileRouteGuard>
      </Suspense>
    ),
  },
  
  // Mobile Payment Fail - standalone route without Layout, protected by guard
  {
    path: '/mobile/payment/fail',
    element: (
      <Suspense fallback={<PageLoader />}>
        <MobileRouteGuard>
          <PaymentFailMobile />
        </MobileRouteGuard>
      </Suspense>
    ),
  },
  
  // Mobile routes - standalone pages without Layout
  ...mobileRoutes,
  
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
