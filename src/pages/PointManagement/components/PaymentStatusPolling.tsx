/**
 * Payment Status Polling Component
 * 
 * Hook and component for polling payment status
 */

import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { paymentQueries, paymentKeys } from '@/services/queries/payments';

interface UsePaymentStatusPollingOptions {
  orderId: string | null;
  enabled: boolean;
  onSuccess?: (status: string) => void;
  onError?: (error: Error) => void;
  pollInterval?: number;
  maxPollDuration?: number;
}

export function usePaymentStatusPolling({
  orderId,
  enabled,
  onSuccess,
  onError,
  pollInterval = 5000, // 5 seconds
  maxPollDuration = 600000, // 10 minutes
}: UsePaymentStatusPollingOptions) {
  const startTimeRef = useRef<number | null>(null);
  const hasCalledSuccessRef = useRef(false);

  // Initialize start time when polling begins
  useEffect(() => {
    if (enabled && orderId && !startTimeRef.current) {
      startTimeRef.current = Date.now();
    }
    if (!enabled) {
      startTimeRef.current = null;
      hasCalledSuccessRef.current = false;
    }
  }, [enabled, orderId]);

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: paymentKeys.orderStatus(orderId || ''),
    queryFn: () => {
      if (!orderId) throw new Error('Order ID is required');
      return paymentQueries.getPointOrderStatus(orderId);
    },
    enabled: enabled && !!orderId,
    refetchInterval: (query) => {
      // Check if max duration exceeded
      if (startTimeRef.current) {
        const elapsed = Date.now() - startTimeRef.current;
        if (elapsed >= maxPollDuration) {
          return false; // Stop polling
        }
      }

      // Check if payment is completed or failed
      const paymentStatus = query.state.data?.data?.data?.payment_status;
      if (paymentStatus === 'completed' || paymentStatus === 'failed' || paymentStatus === 'cancelled') {
        return false; // Stop polling
      }

      return pollInterval;
    },
    retry: 3,
    retryDelay: 2000,
  });

  // Handle success callback
  useEffect(() => {
    if (data?.data?.data) {
      const paymentStatus = data.data.data.payment_status;
      
      if (paymentStatus === 'completed' && !hasCalledSuccessRef.current) {
        hasCalledSuccessRef.current = true;
        onSuccess?.(paymentStatus);
      }
    }
  }, [data, onSuccess]);

  // Handle error callback
  useEffect(() => {
    if (error) {
      onError?.(error as Error);
    }
  }, [error, onError]);

  const order = data?.data?.data;
  const paymentStatus = order?.payment_status || null;
  const isCompleted = paymentStatus === 'completed';
  const isFailed = paymentStatus === 'failed' || paymentStatus === 'cancelled';
  const isPolling = enabled && !isCompleted && !isFailed && isLoading;

  // Check if timeout reached
  const isTimeout = startTimeRef.current
    ? Date.now() - startTimeRef.current >= maxPollDuration
    : false;

  return {
    order,
    paymentStatus,
    isLoading: isPolling,
    isCompleted,
    isFailed,
    isTimeout,
    error,
    refetch,
  };
}

