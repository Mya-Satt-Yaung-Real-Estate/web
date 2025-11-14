import { Suspense } from 'react';
import { PageLoader } from './components/shared';
import { lazyWithRetry } from '../utils/lazyWithRetry';

// Lazy load public page components with retry mechanism
const Home = lazyWithRetry(() => import('../pages/Home').then(module => ({ default: module.Home })));
const About = lazyWithRetry(() => import('../pages/About').then(module => ({ default: module.About })));
const AboutApp = lazyWithRetry(() => import('../pages/AboutApp').then(module => ({ default: module.AboutApp })));
const Companies = lazyWithRetry(() => import('../pages/companies').then(module => ({ default: module.Companies })));
const CompanyDetail = lazyWithRetry(() => import('../pages/companies/detail').then(module => ({ default: module.default })));
const FAQ = lazyWithRetry(() => import('../pages/FAQ').then(module => ({ default: module.default })));
const Contact = lazyWithRetry(() => import('../pages/Contact').then(module => ({ default: module.default })));
const PrivacyPolicy = lazyWithRetry(() => import('../pages/PrivacyPolicy').then(module => ({ default: module.PrivacyPolicy })));
const Feedback = lazyWithRetry(() => import('../pages/Feedback').then(module => ({ default: module.Feedback })));
const SignIn = lazyWithRetry(() => import('../pages/SignIn').then(module => ({ default: module.SignIn })));

// Knowledge pages
const KnowledgeHub = lazyWithRetry(() => import('../pages/KnowledgeHub').then(module => ({ default: module.KnowledgeHub })));
const KnowledgeDetail = lazyWithRetry(() => import('../pages/KnowledgeDetail').then(module => ({ default: module.default })));

// News pages
const NewsAndUpdates = lazyWithRetry(() => import('../pages/NewsAndUpdates').then(module => ({ default: module.default })));
const NewsDetail = lazyWithRetry(() => import('../pages/NewsDetail').then(module => ({ default: module.default })));

// Legacy pages
const Legacy = lazyWithRetry(() => import('../pages/Legacy').then(module => ({ default: module.default })));
const LegacyDetail = lazyWithRetry(() => import('../pages/LegacyDetail').then(module => ({ default: module.default })));

// Calculator pages
const YarPyatCalculator = lazyWithRetry(() => import('../pages/calculators/yarpyatCalculator').then(module => ({ default: module.YarPyatCalculator })));
const LoanCalculator = lazyWithRetry(() => import('../pages/calculators/loanCalculator').then(module => ({ default: module.LoanCalculator })));

// Public Wanting List pages
const PublicWantedList = lazyWithRetry(() => import('../pages/publicWantedListings/list').then(module => ({ default: module.default })));

// Public Properties pages
const PublicProperties = lazyWithRetry(() => import('../pages/publicProperties').then(module => ({ default: module.default })));
const PublicPropertyDetail = lazyWithRetry(() => import('../pages/publicPropertyDetail').then(module => ({ default: module.default })));

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
    path: '/about-app',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AboutApp />
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
    path: '/companies/:slug',
    element: (
      <Suspense fallback={<PageLoader />}>
        <CompanyDetail />
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
  {
    path: '/loan-calculator',
    element: (
      <Suspense fallback={<PageLoader />}>
        <LoanCalculator />
      </Suspense>
    ),
  },
  
  {
    path: '/public-wanted-list',
    element: (
      <Suspense fallback={<PageLoader />}>
        <PublicWantedList />
      </Suspense>
    ),
  },
  {
    path: '/search',
    element: (
      <Suspense fallback={<PageLoader />}>
        <PublicProperties />
      </Suspense>
    ),
  },
  {
    path: '/properties/:slug',
    element: (
      <Suspense fallback={<PageLoader />}>
        <PublicPropertyDetail />
      </Suspense>
    ),
  },
];
