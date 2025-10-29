import { lazy, Suspense } from 'react';
import { PageLoader } from './components/shared';
import { ProtectedRoute } from './components/ProtectedRoute';

// Lazy load protected page components
const MyWantedList = lazy(() => import('../pages/myWantedListings/list'));
const CreateWantedList = lazy(() => import('../pages/myWantedListings/create'));
const EditWantedList = lazy(() => import('../pages/myWantedListings/edit'));
const WantingListDetail = lazy(() => import('../pages/myWantedListings/detail'));
const AppointmentList = lazy(() => import('../pages/appointments/list'));

// Protected routes configuration
export const protectedRoutes = [
  // My Wanted Listings routes
  {
    path: '/my-wanted-listings/list',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <MyWantedList />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/my-wanted-listings/create',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <CreateWantedList />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/my-wanted-listings/edit/:id',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <EditWantedList />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/my-wanted-listings/detail/:id',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <WantingListDetail />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  // Appointments routes
  {
    path: '/appointments',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <AppointmentList />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  // TODO: Add more protected routes here when features are implemented
  // Example:
  // {
  //   path: '/profile',
  //   element: (
  //     <ProtectedRoute>
  //       <Suspense fallback={<PageLoader />}>
  //         <ProfilePage />
  //       </Suspense>
  //     </ProtectedRoute>
  //   ),
  // },
];
