import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentApi } from '@/services/api/appointment';
import { appointmentKeys } from '@/services/queries/appointment';
import type { CreateAppointmentData, UpdateAppointmentData } from '@/types/appointment';

/**
 * Create appointment mutation hook
 */
export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAppointmentData) => appointmentApi.createAppointment(data),
    onSuccess: (response) => {
      // Invalidate and refetch appointments list
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      
      // Return response for component to use
      return response;
    },
  });
};

/**
 * Update appointment mutation hook
 */
export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAppointmentData }) => 
      appointmentApi.updateAppointment(id, data),
    onSuccess: (response, variables) => {
      // Invalidate and refetch appointments list
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      // Invalidate specific appointment detail
      queryClient.invalidateQueries({ queryKey: appointmentKeys.detail(variables.id) });
      
      // Return response for component to use
      return response;
    },
  });
};
