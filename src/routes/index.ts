// Route definitions for the application
export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  title: string;
  public?: boolean;
  protected?: boolean;
  exact?: boolean;
}

// Import page components
import { Home } from '../pages/Home';
import { About } from '../pages/About';
import { NotFound } from '../pages/NotFound';

// Route configuration - Home, About, and 404 pages
export const routes: RouteConfig[] = [
  { path: '/', component: Home, title: 'Home', public: true, exact: true },
  { path: '/about', component: About, title: 'About Us', public: true },
  { path: '/404', component: NotFound, title: 'Page Not Found', public: true },
];

// Navigation menu configuration - Only public navigation
export const navigationConfig = {
  public: [
    { name: 'Home', path: '/', icon: 'Home' },
    { name: 'About', path: '/about', icon: 'Info' },
  ],
  authenticated: [
    // No authenticated routes for now
  ],
};

// Helper functions
export const getPublicRoutes = () => routes.filter(route => route.public);
export const getProtectedRoutes = () => routes.filter(route => route.protected);
export const getRouteByPath = (path: string) => routes.find(route => route.path === path);
