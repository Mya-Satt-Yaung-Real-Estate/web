import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectApi } from '@/services/api/projects';
import { projectKeys } from '@/services/queries/projects';
import type { ProjectFormPayload } from '@/types/projects';

export function useCreateMyProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProjectFormPayload) => projectApi.createMyProject(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.mine() });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

export function useUpdateMyProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<ProjectFormPayload> }) =>
      projectApi.updateMyProject(id, data),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(projectKeys.myDetail(String(variables.id)), response);
      queryClient.invalidateQueries({ queryKey: projectKeys.mine() });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

export function useDeleteMyProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => projectApi.deleteMyProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.mine() });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}
