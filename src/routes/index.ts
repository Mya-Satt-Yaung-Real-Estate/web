// Route definitions for the application
export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  title: string;
  public?: boolean;
  protected?: boolean;
  exact?: boolean;
}

// Lazy load page components for code splitting
import { lazy } from 'react';

// Lazy load page components
const Home = lazy(() => import('../pages/Home').then(module => ({ default: module.Home })));
const About = lazy(() => import('../pages/About').then(module => ({ default: module.About })));
const Companies = lazy(() => import('../pages/Companies').then(module => ({ default: module.Companies })));
const KnowledgeHub = lazy(() => import('../pages/KnowledgeHub').then(module => ({ default: module.KnowledgeHub })));
const KnowledgeDetail = lazy(() => import('../pages/KnowledgeDetail').then(module => ({ default: module.default })));
const Legacy = lazy(() => import('../pages/Legacy').then(module => ({ default: module.default })));
const LegacyDetail = lazy(() => import('../pages/LegacyDetail').then(module => ({ default: module.default })));
const FAQ = lazy(() => import('../pages/FAQ').then(module => ({ default: module.default })));
const Contact = lazy(() => import('../pages/Contact').then(module => ({ default: module.default })));
const NotFound = lazy(() => import('../pages/NotFound').then(module => ({ default: module.NotFound })));

// Route configuration - Home, About, Companies, Knowledge Hub, and 404 pages
export const routes: RouteConfig[] = [
  { path: '/', component: Home, title: 'Home', public: true, exact: true },
  { path: '/about', component: About, title: 'About Us', public: true },
  { path: '/companies', component: Companies, title: 'Companies', public: true },
  { path: '/knowledge-hub', component: KnowledgeHub, title: 'Knowledge Hub', public: true },
  { path: '/knowledge-hub/:slug', component: KnowledgeDetail, title: 'Knowledge Detail', public: true },
  { path: '/legacy', component: Legacy, title: 'Legacy Team', public: true },
  { path: '/legacy/:slug', component: LegacyDetail, title: 'Legacy Team Detail', public: true },
  { path: '/faq', component: FAQ, title: 'FAQ', public: true },
  { path: '/contact', component: Contact, title: 'Contact Us', public: true },
  { path: '/404', component: NotFound, title: 'Page Not Found', public: true },
];

// Navigation menu configuration - Only public navigation
export const navigationConfig = {
  public: [
    { name: 'Home', path: '/', icon: 'Home' },
    { name: 'About', path: '/about', icon: 'Info' },
    { name: 'Companies', path: '/companies', icon: 'Building2' },
    { name: 'Knowledge Hub', path: '/knowledge-hub', icon: 'BookOpen' },
    { name: 'FAQ', path: '/faq', icon: 'HelpCircle' },
    { name: 'Contact', path: '/contact', icon: 'Mail' },
  ],
  authenticated: [
    // No authenticated routes for now
  ],
};

// Helper functions
export const getPublicRoutes = () => routes.filter(route => route.public);
export const getProtectedRoutes = () => routes.filter(route => route.protected);
export const getRouteByPath = (path: string) => routes.find(route => route.path === path);
