import { useQuery } from '@tanstack/react-query';
import { projectKeys, projectQueries } from '@/services/queries/projects';
import type { ProjectFilters } from '@/types/projects';

export function useProjects(filters?: ProjectFilters) {
  return useQuery({
    queryKey: projectKeys.list(filters),
    queryFn: () => projectQueries.getPublicProjects(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProject(idOrSlug: string) {
  return useQuery({
    queryKey: projectKeys.detail(idOrSlug),
    queryFn: () => projectQueries.getPublicProject(idOrSlug),
    enabled: !!idOrSlug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useMyProjects(filters?: ProjectFilters) {
  return useQuery({
    queryKey: projectKeys.myList(filters),
    queryFn: () => projectQueries.getMyProjects(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMyProject(id: string) {
  return useQuery({
    queryKey: projectKeys.myDetail(id),
    queryFn: () => projectQueries.getMyProject(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: 'always',
  });
}
