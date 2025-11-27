import { Suspense } from 'react';
import { PageLoader } from './components/shared';
import { lazyWithRetry } from '../utils/lazyWithRetry';

// Lazy load mobile page components with retry mechanism
const MobileWantedDetail = lazyWithRetry(() => import('../pages/mobile/wantedDetail').then(module => ({ default: module.default })));

// Mobile routes configuration - standalone pages without Layout
export const mobileRoutes = [
  {
    path: '/mobile/wanted/:slug',
    element: (
      <Suspense fallback={<PageLoader />}>
        <MobileWantedDetail />
      </Suspense>
    ),
  },
];

