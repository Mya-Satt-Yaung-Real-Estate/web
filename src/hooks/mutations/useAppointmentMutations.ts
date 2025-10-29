import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentApi } from '@/services/api/appointment';
import { appointmentKeys } from '@/services/queries/appointment';
import type { CreateAppointmentData } from '@/types/appointment';

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
