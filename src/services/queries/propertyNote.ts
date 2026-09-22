import { propertyNoteApi } from '../api/propertyNote';
import type {
  PropertyNoteListFilters,
  PropertyNoteMapFilters,
  PropertyNotePinType,
} from '@/types/propertyNote';

export const propertyNoteKeys = {
  all: ['property-notes'] as const,
  access: () => [...propertyNoteKeys.all, 'access'] as const,
  lists: () => [...propertyNoteKeys.all, 'list'] as const,
  list: (filters?: PropertyNoteListFilters) => [...propertyNoteKeys.lists(), filters] as const,
  details: () => [...propertyNoteKeys.all, 'detail'] as const,
  detail: (id: number) => [...propertyNoteKeys.details(), id] as const,
  maps: () => [...propertyNoteKeys.all, 'map'] as const,
  map: (filters?: PropertyNoteMapFilters) => [...propertyNoteKeys.maps(), filters] as const,
  mapDetails: () => [...propertyNoteKeys.all, 'map-detail'] as const,
  mapDetail: (id: number, pinType: PropertyNotePinType) =>
    [...propertyNoteKeys.mapDetails(), id, pinType] as const,
};

export const propertyNoteQueries = {
  getAccess: () => propertyNoteApi.getAccess(),
  getList: (filters?: PropertyNoteListFilters) => propertyNoteApi.getList(filters),
  getDetail: (id: number) => propertyNoteApi.getDetail(id),
  getMap: (filters?: PropertyNoteMapFilters) => propertyNoteApi.getMap(filters),
  getMapDetail: (id: number, pinType: PropertyNotePinType) =>
    propertyNoteApi.getMapDetail(id, pinType),
};
