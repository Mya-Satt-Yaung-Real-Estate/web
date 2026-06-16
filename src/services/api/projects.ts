import { api } from './client';
import type { ProjectFilters, ProjectFormPayload, ProjectListResponse, ProjectResponse } from '@/types/projects';

export const projectApi = {
  getPublicProjects: (filters: ProjectFilters = {}) => {
    return api.get<ProjectListResponse>('/api/v2/public/projects', {
      params: filters,
    });
  },

  getPublicProject: (idOrSlug: string) => {
    return api.get<ProjectResponse>(`/api/v2/public/projects/${idOrSlug}`);
  },

  getMyProjects: (filters: ProjectFilters = {}) => {
    return api.get<ProjectListResponse>('/api/v2/my-projects', {
      params: filters,
    });
  },

  createMyProject: (payload: ProjectFormPayload) => {
    return api.post<ProjectResponse>('/api/v2/my-projects', payload);
  },

  getMyProject: (id: string | number) => {
    return api.get<ProjectResponse>(`/api/v2/my-projects/${id}`);
  },

  updateMyProject: (id: string | number, payload: Partial<ProjectFormPayload>) => {
    return api.put<ProjectResponse>(`/api/v2/my-projects/${id}`, payload);
  },

  deleteMyProject: (id: string | number) => {
    return api.delete<{ success: boolean; message?: string }>(`/api/v2/my-projects/${id}`);
  },
};
