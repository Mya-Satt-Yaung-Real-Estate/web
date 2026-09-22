import { api } from './client';
import type {
  PropertyNoteApiBody,
  PropertyNoteAccess,
  PropertyNoteApprovalFilters,
  PropertyNoteApprovalItem,
  PropertyNoteApprovalsListBody,
  PropertyNoteCreateData,
  PropertyNoteDetail,
  PropertyNoteListFilters,
  PropertyNoteListItem,
  PropertyNoteMapData,
  PropertyNoteMapDetail,
  PropertyNoteMapFilters,
  PropertyNoteUnlockResult,
  PropertyNoteUpdateData,
} from '@/types/propertyNote';

const BASE = '/api/v2/frontend/property-notes';

/**
 * Website Property Note V2 — auth required; no device_id.
 */
export const propertyNoteApi = {
  getAccess: () => {
    return api.get<PropertyNoteApiBody<PropertyNoteAccess>>(`${BASE}/access`);
  },

  unlock: () => {
    return api.post<PropertyNoteApiBody<PropertyNoteUnlockResult>>(`${BASE}/unlock`);
  },

  getMap: (filters: PropertyNoteMapFilters = {}) => {
    return api.get<PropertyNoteApiBody<PropertyNoteMapData>>(BASE + '/map', {
      params: filters,
    });
  },

  getMapDetail: (id: number, pinType: 'note' | 'property') => {
    return api.get<PropertyNoteApiBody<PropertyNoteMapDetail>>(`${BASE}/map/${id}`, {
      params: { pin_type: pinType },
    });
  },

  getList: (filters: PropertyNoteListFilters = {}) => {
    return api.get<PropertyNoteApiBody<PropertyNoteListItem[]>>(BASE, {
      params: {
        ...filters,
        per_page: filters.per_page ?? 20,
      },
    });
  },

  getDetail: (id: number) => {
    return api.get<PropertyNoteApiBody<PropertyNoteDetail>>(`${BASE}/${id}`);
  },

  create: (data: PropertyNoteCreateData) => {
    return api.post<PropertyNoteApiBody<PropertyNoteDetail>>(BASE, data);
  },

  update: (id: number, data: PropertyNoteUpdateData) => {
    return api.put<PropertyNoteApiBody<PropertyNoteDetail>>(`${BASE}/${id}`, data);
  },

  updateStatus: (id: number, status: 'sold' | 'rented') => {
    return api.patch<PropertyNoteApiBody<PropertyNoteDetail>>(`${BASE}/${id}/status`, { status });
  },

  remove: (id: number) => {
    return api.delete<PropertyNoteApiBody<null>>(`${BASE}/${id}`);
  },

  getApprovals: (filters: PropertyNoteApprovalFilters = {}) => {
    return api.get<PropertyNoteApprovalsListBody>(`${BASE}/approvals`, {
      params: {
        ...filters,
        per_page: filters.per_page ?? 20,
      },
    });
  },

  approveRequest: (id: number) => {
    return api.post<PropertyNoteApiBody<PropertyNoteApprovalItem>>(
      `${BASE}/approvals/${id}/approve`
    );
  },

  rejectRequest: (id: number, rejectReason?: string) => {
    return api.post<PropertyNoteApiBody<PropertyNoteApprovalItem>>(
      `${BASE}/approvals/${id}/reject`,
      rejectReason ? { reject_reason: rejectReason } : {}
    );
  },
};
