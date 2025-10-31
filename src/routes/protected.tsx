import { lazy, Suspense } from 'react';
import { PageLoader } from './components/shared';
import { ProtectedRoute } from './components/ProtectedRoute';

// Lazy load protected page components
const MyWantedList = lazy(() => import('../pages/myWantedListings/list'));
const CreateWantedList = lazy(() => import('../pages/myWantedListings/create'));
const EditWantedList = lazy(() => import('../pages/myWantedListings/edit'));
const WantingListDetail = lazy(() => import('../pages/myWantedListings/detail'));
const AppointmentList = lazy(() => import('../pages/appointments/list'));
const EditAppointment = lazy(() => import('../pages/appointments/edit'));
const MyAdvertisementsList = lazy(() => import('../pages/advertisements/list'));
const CreateAdvertisement = lazy(() => import('../pages/advertisements/create'));
const EditAdvertisement = lazy(() => import('../pages/advertisements/edit'));
const AdvertisementDetail = lazy(() => import('../pages/advertisements/detail'));
const MyPropertiesList = lazy(() => import('../pages/properties/list'));
const CreateProperty = lazy(() => import('../pages/properties/create'));

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
  {
    path: '/appointments/edit/:id',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <EditAppointment />
        </Suspense>
      </ProtectedRoute>
    ),
  },
        // Advertisement routes
        {
          path: '/advertisements',
          element: (
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <MyAdvertisementsList />
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: '/advertisements/create',
          element: (
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <CreateAdvertisement />
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: '/advertisements/edit/:id',
          element: (
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <EditAdvertisement />
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: '/advertisements/detail/:id',
          element: (
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <AdvertisementDetail />
              </Suspense>
            </ProtectedRoute>
          ),
        },
  // Properties routes
  {
    path: '/properties',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <MyPropertiesList />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/properties/create',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <CreateProperty />
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
