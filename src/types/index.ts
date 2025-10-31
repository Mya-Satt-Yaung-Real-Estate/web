/**
 * Type Definitions
 * 
 * Essential type definitions for the application.
 */

import type { ReactNode } from 'react';

// ============================================================================
// BASE TYPES
// ============================================================================

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ============================================================================
// USER & AUTHENTICATION
// ============================================================================

export interface User extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  isGuest: boolean;
  points: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ============================================================================
// PROPERTY TYPES
// ============================================================================

export type PropertyType = 
  | 'apartment'
  | 'house'
  | 'condo'
  | 'villa'
  | 'land'
  | 'commercial';

export type PropertyStatus = 'available' | 'sold' | 'rented' | 'pending';

export interface Property extends BaseEntity {
  title: string;
  description: string;
  price: number;
  currency: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  isPremium: boolean;
  isFeatured: boolean;
  views: number;
  favorites: number;
}

// ============================================================================
// SEARCH & FILTERS
// ============================================================================

export interface SearchFilters {
  keywords: string;
  propertyType: string;
  location: string;
  priceMin: number;
  priceMax: number;
  bedrooms: string;
  bathrooms: string;
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
}

export interface CardProps extends BaseComponentProps {
  variant?: 'default' | 'elevated' | 'glass';
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

// ============================================================================
// ROUTE TYPES
// ============================================================================

export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  title: string;
  public: boolean;
  exact?: boolean;
}

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================

export type {
  ReactNode,
  ComponentType,
  FC,
  PropsWithChildren,
} from 'react';

// Export company types
export type {
  Company,
  CompanyType,
  Region,
  Township,
  CompaniesResponse,
  CompanyTypeResponse,
  CompanyFilters,
} from './company';

// Export wanting list types
export type {
  WantingList,
  WantingListFilters,
  WantingListCreateData,
  WantingListUpdateData,
  WantingListResponse,
  WantingListListResponse,
  WantingListStatistics,
  WantingListStatisticsResponse,
  WantingListPropertyType,
  WantingListLocation,
  WantingListBudget,
  WantingListSpecifications,
  WantingListContact,
  WantingListStatus,
  WantingListUser,
} from './wantingList';

// Export property types
export type {
  Property,
  PropertyType,
  ListingType,
  PropertyCondition,
  PropertyRegion,
  PropertyTownship,
  PropertyLocation,
  PropertyContactInfo,
  PropertyStats,
  PropertyDates,
  PropertyMedia,
  PropertyPagination,
  PropertyResponse,
  PropertyListResponse,
  PropertyFilters,
  PropertyStatistics,
  PropertyStatisticsResponse,
} from './properties';