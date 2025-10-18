import { Routes, Route } from 'react-router-dom';
import { routes } from './index';
import { NotFound } from '../pages/NotFound';

export function AppRoutes() {
  return (
    <Routes>
      {routes.map((route) => {
        const { path, component: Component } = route;
        
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
  );
}
