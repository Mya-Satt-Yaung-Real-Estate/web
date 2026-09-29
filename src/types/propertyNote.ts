/**
 * Website Property Note types (V2 — /api/v2/frontend/property-notes).
 * Matches Website/V2 resources (not mobile Frontend V2).
 */

export type PropertyNoteStatus = 'active' | 'sold' | 'rented';
export type PropertyNoteAccessStatus =
  | 'pending'
  | 'admin_approved'
  | 'approved'
  | 'rejected'
  | 'revoked'
  | null;

export type PropertyNotePinType = 'note' | 'property';

export interface PropertyNoteNamedPlace {
  id: number;
  name_en: string;
  name_mm: string;
  slug?: string | null;
}

export interface PropertyNoteListingType {
  id: number;
  name_en: string;
  name_mm: string;
  slug: string;
}

export interface PropertyNoteMediaImage {
  id: number;
  type?: string;
  filename?: string;
  is_primary?: boolean;
  status?: string;
  url?: string;
  thumbnail_url?: string;
  small_url?: string;
  medium_url?: string;
}

export interface PropertyNoteAccess {
  is_allowed: boolean;
  status: PropertyNoteAccessStatus;
  required_points: number;
  access_days: number;
  current_balance: number;
  unlocked_at: string | null;
  expires_at: string | null;
  remaining_days: number | null;
  reject_reason: string | null;
  /**
   * True when usable User+Device grant exists but no Any-device (web denied).
   */
  blocked_by_device_grant?: boolean;
  /**
   * True when access was revoked and Admin has not re-granted yet.
   */
  blocked_by_revoke?: boolean;
}

export interface PropertyNoteUnlockResult {
  is_allowed: boolean;
  status: PropertyNoteAccessStatus;
  already_unlocked: boolean;
  already_pending: boolean;
  points_consumed: number;
  current_balance: number;
  access_days: number;
  remaining_days: number | null;
  unlocked_at: string | null;
  expires_at: string | null;
}

export interface PropertyNoteListItem {
  id: number;
  note_code: string;
  listing_type: PropertyNoteListingType | null;
  status: PropertyNoteStatus;
  is_locked: boolean;
  region: PropertyNoteNamedPlace | null;
  township: PropertyNoteNamedPlace | null;
  ward: string | null;
  road: string | null;
  latitude: number | null;
  longitude: number | null;
  primary_image: PropertyNoteMediaImage | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface PropertyNoteDetail extends PropertyNoteListItem {
  length_ft: number | null;
  width_ft: number | null;
  images: PropertyNoteMediaImage[];
}

export interface PropertyNoteMapPinOwner {
  type: 'user' | 'company';
  name: string | null;
  avatar_url: string;
}

export interface PropertyNoteMapPin {
  pin_type: PropertyNotePinType;
  id: number;
  /** Property listing slug — present when pin_type is property. */
  slug?: string | null;
  title: string;
  code: string | null;
  property_type: { name_en: string; name_mm: string } | null;
  listing_type: PropertyNoteListingType | null;
  price_display: string | null;
  phone_numbers: string[];
  region: PropertyNoteNamedPlace | null;
  township: PropertyNoteNamedPlace | null;
  primary_image: PropertyNoteMediaImage | null;
  /**
   * Note owner avatar for map pin. Null on property pins (use Jade logo).
   */
  owner?: PropertyNoteMapPinOwner | null;
  latitude: number | null;
  longitude: number | null;
}

export interface PropertyNoteMapLocation {
  region: PropertyNoteNamedPlace | null;
  township: PropertyNoteNamedPlace | null;
  ward: string | null;
  road: string | null;
  address: string | null;
  location_string: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface PropertyNoteMapDetail {
  pin_type: PropertyNotePinType;
  id: number;
  /** Property listing slug — present when pin_type is property. */
  slug?: string | null;
  code: string | null;
  status: string | null;
  property_type: {
    id: number;
    name_en: string;
    name_mm: string;
  } | null;
  listing_type: PropertyNoteListingType | null;
  phone_numbers: string[];
  length_ft: number | null;
  width_ft: number | null;
  location: PropertyNoteMapLocation;
  images: PropertyNoteMediaImage[];
  primary_image: PropertyNoteMediaImage | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface PropertyNoteMapCounts {
  notes: number;
  properties: number;
  total: number;
}

export interface PropertyNotePagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number | null;
  to: number | null;
  has_more_pages: boolean;
}

/** Full JSON body from Website API (wrapped again by api client as `.data`). */
export interface PropertyNoteApiBody<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: PropertyNotePagination;
}

export interface PropertyNoteMapData {
  pins: PropertyNoteMapPin[];
  counts: PropertyNoteMapCounts;
}

export interface PropertyNoteListFilters {
  search?: string;
  status?: PropertyNoteStatus;
  listing_type_id?: number;
  region_id?: number;
  township_id?: number;
  page?: number;
  per_page?: number;
}

export interface PropertyNoteMapFilters {
  paginate?: boolean;
  page?: number;
  per_page?: number;
  note_code?: string;
  region_id?: number;
  township_id?: number;
  status?: PropertyNoteStatus;
  listing_type_id?: number;
}

export interface PropertyNoteCreateData {
  listing_type_id: number;
  region_id: number;
  township_id: number;
  ward?: string | null;
  road?: string | null;
  length_ft?: number | null;
  width_ft?: number | null;
  latitude: number;
  longitude: number;
  media_ids: number[];
}

export type PropertyNoteUpdateData = Partial<PropertyNoteCreateData>;

/** Approver list filter — never includes raw pending. */
export type PropertyNoteApprovalFilterStatus =
  | 'admin_approved'
  | 'approved'
  | 'rejected'
  | 'revoked'
  | 'all';

export interface PropertyNoteApprovalUser {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  user_type: string;
  current_point_balance: number;
}

/**
 * Who acted (approve / reject / revoke), or "System approved".
 */
export interface PropertyNoteApprovalActionBy {
  name: string;
}

export interface PropertyNoteApprovalItem {
  id: number;
  status: PropertyNoteAccessStatus;
  source: string | null;
  points_amount: number;
  reject_reason: string | null;
  requested_at: string | null;
  admin_approved_at: string | null;
  approved_at: string | null;
  expires_at: string | null;
  action_by: PropertyNoteApprovalActionBy | null;
  user: PropertyNoteApprovalUser | null;
  admin: { id: number; name: string } | null;
}

export interface PropertyNoteApprovalStatistics {
  total: number;
  pending: number;
  admin_approved: number;
  approved: number;
  rejected: number;
  revoked: number;
}

export interface PropertyNoteApprovalsListBody {
  success: boolean;
  message: string;
  data: PropertyNoteApprovalItem[];
  statistics: PropertyNoteApprovalStatistics;
  pending_count: number;
  pagination: PropertyNotePagination;
}

export interface PropertyNoteApprovalFilters {
  status?: PropertyNoteApprovalFilterStatus;
  search?: string;
  page?: number;
  per_page?: number;
}
