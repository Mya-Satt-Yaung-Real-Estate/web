import { projectApi } from '../api/projects';
import type { ProjectFilters } from '@/types/projects';

export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters?: ProjectFilters) => [...projectKeys.lists(), filters] as const,
  infiniteList: (filters?: ProjectFilters) => [...projectKeys.lists(), 'infinite', filters] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (idOrSlug: string) => [...projectKeys.details(), idOrSlug] as const,
  mine: () => [...projectKeys.all, 'mine'] as const,
  myList: (filters?: ProjectFilters) => [...projectKeys.mine(), filters] as const,
  myDetail: (id: string) => [...projectKeys.mine(), 'detail', id] as const,
} as const;

export const projectQueries = {
  getPublicProjects: (filters?: ProjectFilters) => {
    return projectApi.getPublicProjects(filters);
  },

  getPublicProject: (idOrSlug: string) => {
    return projectApi.getPublicProject(idOrSlug);
  },

  getMyProjects: (filters?: ProjectFilters) => {
    return projectApi.getMyProjects(filters);
  },

  getMyProject: (id: string) => {
    return projectApi.getMyProject(id);
  },
};
