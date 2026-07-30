import { Suspense } from 'react';
import { PageLoader } from './components/shared';
import { ProtectedRoute } from './components/ProtectedRoute';
import { lazyWithRetry } from '../utils/lazyWithRetry';

// Lazy load protected page components with retry mechanism
const MyWantedList = lazyWithRetry(() => import('../pages/myWantedListings/list'));
const CreateWantedList = lazyWithRetry(() => import('../pages/myWantedListings/create'));
const EditWantedList = lazyWithRetry(() => import('../pages/myWantedListings/edit'));
const WantingListDetail = lazyWithRetry(() => import('../pages/myWantedListings/detail'));
const MyShareProfitList = lazyWithRetry(() => import('../pages/myShareProfitListings/list'));
const CreateShareProfitListing = lazyWithRetry(() => import('../pages/myShareProfitListings/create'));
const EditShareProfitListing = lazyWithRetry(() => import('../pages/myShareProfitListings/edit'));
const MyShareProfitDetail = lazyWithRetry(() => import('../pages/myShareProfitListings/detail'));
const AppointmentList = lazyWithRetry(() => import('../pages/appointments/list'));
const EditAppointment = lazyWithRetry(() => import('../pages/appointments/edit'));
const MyAdvertisementsList = lazyWithRetry(() => import('../pages/myAdvertisements/list'));
const CreateAdvertisement = lazyWithRetry(() => import('../pages/myAdvertisements/create'));
const EditAdvertisement = lazyWithRetry(() => import('../pages/myAdvertisements/edit'));
const AdvertisementDetail = lazyWithRetry(() => import('../pages/myAdvertisements/detail'));
const MyPropertiesList = lazyWithRetry(() => import('../pages/myProperties/list'));
const CreateProperty = lazyWithRetry(() => import('../pages/myProperties/create'));
const EditProperty = lazyWithRetry(() => import('../pages/myProperties/edit'));
const PropertyDetail = lazyWithRetry(() => import('../pages/myProperties/detail'));
const MyProjectsList = lazyWithRetry(() => import('../pages/myProjects/list'));
const CreateProject = lazyWithRetry(() => import('../pages/myProjects/create'));
const EditProject = lazyWithRetry(() => import('../pages/myProjects/edit'));
const CreateLoanRequest = lazyWithRetry(() => import('../pages/loanRequest/create').then(module => ({ default: module.default })));
const Settings = lazyWithRetry(() => import('../pages/Settings').then(module => ({ default: module.Settings })));
const Profile = lazyWithRetry(() => import('../pages/Profile').then(module => ({ default: module.Profile })));
const EditProfile = lazyWithRetry(() => import('../pages/EditProfile').then(module => ({ default: module.EditProfile })));
const Favorites = lazyWithRetry(() => import('../pages/Favorites').then(module => ({ default: module.Favorites })));
const RecentViews = lazyWithRetry(() => import('../pages/RecentViews').then(module => ({ default: module.RecentViews })));
const PointManagement = lazyWithRetry(() => import('../pages/PointManagement').then(module => ({ default: module.PointManagement })));

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
  {
    path: '/my-share-profit-listings/list',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <MyShareProfitList />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/my-share-profit-listings/create',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <CreateShareProfitListing />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/my-share-profit-listings/edit/:id',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <EditShareProfitListing />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/my-share-profit-listings/detail/:id',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <MyShareProfitDetail />
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
  // Projects routes
  {
    path: '/my-projects',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <MyProjectsList />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/my-projects/create',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <CreateProject />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/my-projects/edit/:id',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <EditProject />
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
  {
    path: '/recent-views',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <RecentViews />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/point-management',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <PointManagement />
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
