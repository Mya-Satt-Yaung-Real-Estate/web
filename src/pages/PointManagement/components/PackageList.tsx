/**
 * Package List Component
 * 
 * Displays available point packages with purchase functionality.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePointPackages } from '@/hooks/queries/usePoints';
import { usePurchasePoints } from '@/hooks/mutations/usePointMutations';
import { usePaymentIntegrationStatus } from '@/hooks/queries/usePaymentIntegrationStatus';
import { useModal } from '@/contexts/ModalContext';
import { useState, useRef } from 'react';
import { Package } from 'lucide-react';
import { PackageCard } from './PackageCard';
import { PurchaseModal } from './PurchaseModal';
import { PaymentModal } from './PaymentModal';
import type { PointPackage } from '@/types/points';

export function PackageList() {
  const { t } = useLanguage();
  const { data, isLoading, error } = usePointPackages();
  const purchaseMutation = usePurchasePoints();
  const { isPaymentEnabled } = usePaymentIntegrationStatus();
  const { showSuccess, showError } = useModal();
  const [selectedPackage, setSelectedPackage] = useState<PointPackage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  // Track if modal was closed by user (not by mutation success)
  const wasClosedByUserRef = useRef(false);
  // Track if payment was just completed successfully
  const paymentJustCompletedRef = useRef(false);

  const handlePurchaseClick = (packageId: number) => {
    const pkg = data?.data?.data?.package_list?.find((p: PointPackage) => p.id === packageId);
    if (pkg) {
      setSelectedPackage(pkg);
      // Check payment integration status to determine which modal to open
      if (isPaymentEnabled) {
        // Reset mutation state when opening payment modal to prevent stale alerts
        purchaseMutation.reset();
        setIsPaymentModalOpen(true);
      } else {
        setIsModalOpen(true);
      }
      wasClosedByUserRef.current = false; // Reset when opening modal
    }
  };

  const handleCloseModal = () => {
    wasClosedByUserRef.current = true; // Mark as closed by user
    setIsModalOpen(false);
    setIsPaymentModalOpen(false);
    setSelectedPackage(null);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedPackage(null);
    // Reset mutation state when closing payment modal to prevent stale alerts
    purchaseMutation.reset();
    // Reset payment completion flag after a delay to allow any pending alerts to complete
    setTimeout(() => {
      paymentJustCompletedRef.current = false;
    }, 1000);
  };

  const handleConfirmPurchase = () => {
    if (!selectedPackage) return;

    wasClosedByUserRef.current = false; // Reset when confirming purchase
    purchaseMutation.mutate(selectedPackage.id, {
      onSuccess: () => {
        // Close modal first
        setIsModalOpen(false);
        setSelectedPackage(null);
        
        // Only show success alert if:
        // 1. Modal wasn't closed by user
        // 2. Payment integration is NOT enabled (to prevent showing manual alert after payment success)
        // 3. Payment was not just completed (to prevent showing manual alert after payment success)
        // Use setTimeout to ensure modal closes before showing alert
        if (!wasClosedByUserRef.current && !isPaymentEnabled && !paymentJustCompletedRef.current) {
          setTimeout(() => {
            if (!wasClosedByUserRef.current && !isPaymentEnabled && !paymentJustCompletedRef.current) {
              showSuccess(
                t('points.packages.purchaseSuccessDesc') || 'Your purchase request is pending approval.',
                t('points.packages.purchaseSuccess') || 'Purchase Request Submitted'
              );
            }
          }, 100);
        }
      },
      onError: (error: any) => {
        // Close modal first
        setIsModalOpen(false);
        setSelectedPackage(null);
        
        // Only show error alert if modal wasn't closed by user
        // Use setTimeout to ensure modal closes before showing alert
        if (!wasClosedByUserRef.current) {
          setTimeout(() => {
            if (!wasClosedByUserRef.current) {
              const errorMessage = error?.response?.data?.message || 
                t('points.packages.purchaseError') || 'Failed to submit purchase request. Please try again.';
              showError(
                errorMessage,
                t('points.packages.purchaseError') || 'Purchase Failed'
              );
            }
          }, 100);
        }
      },
    });
  };

  if (isLoading) {
    return (
      <Card className="backdrop-blur-sm bg-background/95 shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="backdrop-blur-sm bg-background/95 shadow-sm border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600 text-base font-normal">
            {t('points.packages.error') || 'Error Loading Packages'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t('points.packages.errorMessage') || 'Failed to load point packages. Please try again later.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  const packages = (data?.data?.data?.package_list || []).filter(
    (pkg: PointPackage) => pkg.points > 0
  );

  if (packages.length === 0) {
    return (
      <Card className="backdrop-blur-sm bg-background/95 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-normal">
            <Package className="h-4 w-4 text-primary" />
            {t('points.packages.title') || 'Point Packages'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t('points.packages.noPackages') || 'No packages available at the moment'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="backdrop-blur-sm bg-background/95 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-normal">
            <Package className="h-4 w-4 text-primary" />
            {t('points.packages.title') || 'Point Packages'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg: PointPackage) => (
              <PackageCard
                key={pkg.id}
                package={pkg}
                onPurchase={handlePurchaseClick}
                isLoading={purchaseMutation.isPending}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Manual Purchase Modal (when payment integration is disabled) */}
      <PurchaseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmPurchase}
        package={selectedPackage}
        isLoading={purchaseMutation.isPending}
      />

      {/* Payment Integration Modal (when payment integration is enabled) */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        package={selectedPackage}
        onPaymentSuccess={() => {
          // Set flag to prevent manual purchase alert from showing
          paymentJustCompletedRef.current = true;
        }}
      />
    </>
  );
}

