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
const MyAdvertisementsList = lazy(() => import('../pages/myAdvertisements/list'));
const CreateAdvertisement = lazy(() => import('../pages/myAdvertisements/create'));
const EditAdvertisement = lazy(() => import('../pages/myAdvertisements/edit'));
const AdvertisementDetail = lazy(() => import('../pages/myAdvertisements/detail'));
const MyPropertiesList = lazy(() => import('../pages/myProperties/list'));
const CreateProperty = lazy(() => import('../pages/myProperties/create'));
const EditProperty = lazy(() => import('../pages/myProperties/edit'));
const PropertyDetail = lazy(() => import('../pages/myProperties/detail'));
const CreateLoanRequest = lazy(() => import('../pages/loanRequest/create').then(module => ({ default: module.default })));
const Settings = lazy(() => import('../pages/Settings').then(module => ({ default: module.Settings })));
const Profile = lazy(() => import('../pages/Profile').then(module => ({ default: module.Profile })));
const EditProfile = lazy(() => import('../pages/EditProfile').then(module => ({ default: module.EditProfile })));
const Favorites = lazy(() => import('../pages/Favorites').then(module => ({ default: module.Favorites })));

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
  // Properties routes (authenticated - my properties)
  {
    path: '/my-properties',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <MyPropertiesList />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/my-properties/create',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <CreateProperty />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/my-properties/edit/:slug',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <EditProperty />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/my-properties/:slug',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <PropertyDetail />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  // Loan Request routes
  {
    path: '/loan-request',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <CreateLoanRequest />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  // Settings route
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <Settings />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <Profile />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile/edit',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <EditProfile />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/favorites',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <Favorites />
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
