import { lazy, Suspense } from 'react';
import { PageLoader } from './components/shared';

// Lazy load public page components
const Home = lazy(() => import('../pages/Home').then(module => ({ default: module.Home })));
const About = lazy(() => import('../pages/About').then(module => ({ default: module.About })));
const Companies = lazy(() => import('../pages/Companies').then(module => ({ default: module.Companies })));
const FAQ = lazy(() => import('../pages/FAQ').then(module => ({ default: module.default })));
const Contact = lazy(() => import('../pages/Contact').then(module => ({ default: module.default })));
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy').then(module => ({ default: module.PrivacyPolicy })));
const Feedback = lazy(() => import('../pages/Feedback').then(module => ({ default: module.Feedback })));
const SignIn = lazy(() => import('../pages/SignIn').then(module => ({ default: module.SignIn })));

// Knowledge pages
const KnowledgeHub = lazy(() => import('../pages/KnowledgeHub').then(module => ({ default: module.KnowledgeHub })));
const KnowledgeDetail = lazy(() => import('../pages/KnowledgeDetail').then(module => ({ default: module.default })));

// News pages
const NewsAndUpdates = lazy(() => import('../pages/NewsAndUpdates').then(module => ({ default: module.default })));
const NewsDetail = lazy(() => import('../pages/NewsDetail').then(module => ({ default: module.default })));

// Legacy pages
const Legacy = lazy(() => import('../pages/Legacy').then(module => ({ default: module.default })));
const LegacyDetail = lazy(() => import('../pages/LegacyDetail').then(module => ({ default: module.default })));

// Calculator pages
const YarPyatCalculator = lazy(() => import('../pages/calculators/yarpyatCalculator').then(module => ({ default: module.YarPyatCalculator })));

// Public routes configuration
export const publicRoutes = [
  // Basic pages
  {
    path: '/',
    element: (
      <Suspense fallback={<PageLoader />}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: '/about',
    element: (
      <Suspense fallback={<PageLoader />}>
        <About />
      </Suspense>
    ),
  },
  {
    path: '/companies',
    element: (
      <Suspense fallback={<PageLoader />}>
        <Companies />
      </Suspense>
    ),
  },
  {
    path: '/faq',
    element: (
      <Suspense fallback={<PageLoader />}>
        <FAQ />
      </Suspense>
    ),
  },
  {
    path: '/contact',
    element: (
      <Suspense fallback={<PageLoader />}>
        <Contact />
      </Suspense>
    ),
  },
  {
    path: '/privacy-policy',
    element: (
      <Suspense fallback={<PageLoader />}>
        <PrivacyPolicy />
      </Suspense>
    ),
  },
  {
    path: '/feedback',
    element: (
      <Suspense fallback={<PageLoader />}>
        <Feedback />
      </Suspense>
    ),
  },
  {
    path: '/signin',
    element: (
      <Suspense fallback={<PageLoader />}>
        <SignIn />
      </Suspense>
    ),
  },
  
  // Knowledge Hub routes
  {
    path: '/knowledge-hub',
    element: (
      <Suspense fallback={<PageLoader />}>
        <KnowledgeHub />
      </Suspense>
    ),
  },
  {
    path: '/knowledge-hub/:slug',
    element: (
      <Suspense fallback={<PageLoader />}>
        <KnowledgeDetail />
      </Suspense>
    ),
  },
  
  // News & Updates routes
  {
    path: '/news-and-updates',
    element: (
      <Suspense fallback={<PageLoader />}>
        <NewsAndUpdates />
      </Suspense>
    ),
  },
  {
    path: '/news-and-updates/:slug',
    element: (
      <Suspense fallback={<PageLoader />}>
        <NewsDetail />
      </Suspense>
    ),
  },
  
  // Legacy Team routes
  {
    path: '/legacy',
    element: (
      <Suspense fallback={<PageLoader />}>
        <Legacy />
      </Suspense>
    ),
  },
  {
    path: '/legacy/:slug',
    element: (
      <Suspense fallback={<PageLoader />}>
        <LegacyDetail />
      </Suspense>
    ),
  },
  
  // Calculator routes
  {
    path: '/yarpyat-taxes-calculator',
    element: (
      <Suspense fallback={<PageLoader />}>
        <YarPyatCalculator />
      </Suspense>
    ),
  },
];
