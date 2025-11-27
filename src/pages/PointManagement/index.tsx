/**
 * Point Management Page
 * 
 * Main page for managing user points, packages, and transactions.
 */

import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { useModal } from '@/contexts/ModalContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';
import { BalanceCard, PackageList, TransactionList } from './components';
import { useQueryClient } from '@tanstack/react-query';
import { pointKeys } from '@/services/queries/points';

export function PointManagement() {
  const { user, isAuthenticated } = useAuthStore();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showSuccess, showError, showWarning } = useModal();
  const queryClient = useQueryClient();
  const seo = seoUtils.getPageSEO('point-management');

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/signin');
    }
  }, [isAuthenticated, user, navigate]);

  // Handle payment return query parameters
  useEffect(() => {
    const merchantOrderId = searchParams.get('merchantOrderId');
    const state = searchParams.get('state');

    if (merchantOrderId && state) {
      // Refresh point data
      queryClient.invalidateQueries({ queryKey: pointKeys.packages() });
      queryClient.invalidateQueries({ queryKey: pointKeys.fifo() });
      queryClient.invalidateQueries({ queryKey: pointKeys.transactions() });

      // Show appropriate alert based on state
      const stateUpper = state.toUpperCase();
      
      if (stateUpper === 'SUCCESS') {
        showSuccess(
          t('payments.paymentReturnSuccess') || 'Payment completed successfully! Points have been added to your account.',
          t('payments.paymentSuccess') || 'Payment Successful'
        );
      } else if (stateUpper === 'TIMEOUT') {
        showWarning(
          t('payments.paymentReturnTimeout') || 'Payment timeout. Please check your payment status or contact support if the payment was completed.',
          t('payments.paymentTimeout') || 'Payment Timeout'
        );
      } else if (stateUpper === 'ERROR' || stateUpper === 'SYSTEM_ERROR') {
        showError(
          t('payments.paymentReturnError') || 'Payment failed. Please try again or contact support if the issue persists.',
          t('payments.paymentError') || 'Payment Error'
        );
      } else if (stateUpper === 'CANCELLED') {
        showWarning(
          t('payments.paymentReturnCancelled') || 'Payment was cancelled. You can try again when ready.',
          t('payments.paymentCancelled') || 'Payment Cancelled'
        );
      } else if (stateUpper === 'DECLINED') {
        showError(
          t('payments.paymentReturnDeclined') || 'Payment was declined. Please check your payment method and try again.',
          t('payments.paymentDeclined') || 'Payment Declined'
        );
      } else {
        // Unknown state
        showWarning(
          t('payments.paymentReturnUnknown', { state }) || `Payment status: ${state}. Please check your payment status.`,
          t('payments.paymentStatus') || 'Payment Status'
        );
      }

      // Clear query parameters after showing alert
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('merchantOrderId');
      newSearchParams.delete('state');
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, showSuccess, showError, showWarning, t, queryClient]);

  if (!user || !isAuthenticated) {
    return null;
  }

  return (
    <>
      <SEOHead seo={seo} path="/point-management" />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
                {t('points.title') || 'Point Management'}
              </h1>
              <p className="text-muted-foreground mt-2">
                {t('points.subtitle') || 'Manage your points, view packages, and track transactions'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="hover:bg-primary/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('common.back') || 'Back'}
              </Button>
            </div>
          </div>

          {/* Balance Card Section */}
          <div className="mb-8">
            <BalanceCard />
          </div>

          {/* Package List Section */}
          <div className="mb-8">
            <PackageList />
          </div>

          {/* Transaction List Section */}
          <div className="mb-8">
            <TransactionList />
          </div>
        </div>
      </div>
    </>
  );
}

