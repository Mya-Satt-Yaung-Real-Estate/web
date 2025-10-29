/**
 * Appointment Types
 * 
 * TypeScript interfaces for appointment API responses and data structures.
 */

export interface AppointmentPropertyType {
  id: number;
  name_en: string;
  name_mm: string;
}

export interface AppointmentPreferTime {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
}

export interface Appointment {
  id: number;
  user_id: number;
  property_listing_type_id: number;
  prefer_time_id?: number;
  prefer_time_name?: string;
  prefer_start_time?: string;
  prefer_end_time?: string;
  prefer_time_range?: string;
  schedule_time_range?: string;
  display_time_range?: string;
  date: string;
  is_anytime: boolean;
  schedule_date?: string;
  schedule_start_time?: string;
  schedule_end_time?: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  advance_amount?: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  admin_notes?: string;
  created_at: string;
  updated_at?: string;
  property_listing_type?: AppointmentPropertyType;
  prefer_time?: AppointmentPreferTime;
}

export interface AppointmentFilters {
  search?: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  date?: string;
  date_from?: string;
  date_to?: string;
  property_listing_type_id?: number;
  prefer_time_id?: number;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface AppointmentListData {
  data: Appointment[];
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface AppointmentResponse {
  data: Appointment;
  message: string;
  success: boolean;
}

export interface AppointmentListResponse {
  data: Appointment[];
  message: string;
  success: boolean;
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface AppointmentTimeSlot {
  id: number;
  name: string;
}

export interface AppointmentTimeSlotResponse {
  success: boolean;
  message: string;
  data: AppointmentTimeSlot[];
}

export interface PropertyListingType {
  id: number;
  name_en: string;
  name_mm: string;
  full_name: string;
  slug: string;
  description: string;
  is_active: boolean;
  sort_order: number;
}

export interface PropertyListingTypeResponse {
  success: boolean;
  message: string;
  data: PropertyListingType[];
}

export interface CreateAppointmentData {
  property_listing_type_id: number;
  prefer_time_id?: number;
  is_anytime: boolean;
  date: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  advance_amount?: number;
  message?: string;
}
