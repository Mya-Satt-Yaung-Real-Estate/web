import { useQuery } from '@tanstack/react-query';
import { propertyNoteKeys, propertyNoteQueries } from '@/services/queries/propertyNote';
import type {
  PropertyNoteApprovalFilters,
  PropertyNoteListFilters,
  PropertyNoteMapFilters,
  PropertyNotePinType,
} from '@/types/propertyNote';

export function usePropertyNoteAccess(enabled = true) {
  return useQuery({
    queryKey: propertyNoteKeys.access(),
    queryFn: () => propertyNoteQueries.getAccess(),
    enabled,
    staleTime: 30 * 1000,
  });
}

export function usePropertyNotes(filters: PropertyNoteListFilters = {}, enabled = true) {
  return useQuery({
    queryKey: propertyNoteKeys.list(filters),
    queryFn: () => propertyNoteQueries.getList(filters),
    enabled,
    staleTime: 60 * 1000,
  });
}

export function usePropertyNoteDetail(id: number, enabled = true) {
  return useQuery({
    queryKey: propertyNoteKeys.detail(id),
    queryFn: () => propertyNoteQueries.getDetail(id),
    enabled: enabled && id > 0,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function usePropertyNoteMap(filters: PropertyNoteMapFilters = {}, enabled = true) {
  return useQuery({
    queryKey: propertyNoteKeys.map(filters),
    queryFn: () => propertyNoteQueries.getMap(filters),
    enabled,
    staleTime: 60 * 1000,
  });
}

export function usePropertyNoteMapDetail(
  id: number,
  pinType: PropertyNotePinType,
  enabled = true
) {
  return useQuery({
    queryKey: propertyNoteKeys.mapDetail(id, pinType),
    queryFn: () => propertyNoteQueries.getMapDetail(id, pinType),
    enabled: enabled && id > 0,
    staleTime: 0,
  });
}

export function usePropertyNoteApprovals(
  filters: PropertyNoteApprovalFilters = {},
  enabled = true
) {
  return useQuery({
    queryKey: propertyNoteKeys.approvalList(filters),
    queryFn: () => propertyNoteQueries.getApprovals(filters),
    enabled,
    staleTime: 30 * 1000,
  });
}
