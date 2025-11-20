/**
 * Purchase Modal Component
 * 
 * Confirmation modal for point package purchase.
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Package, Star } from 'lucide-react';
import type { PointPackage } from '@/types/points';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  package: PointPackage | null;
  isLoading?: boolean;
}

export function PurchaseModal({
  isOpen,
  onClose,
  onConfirm,
  package: pkg,
  isLoading,
}: PurchaseModalProps) {
  const { t, language } = useLanguage();

  if (!pkg) return null;

  const getPackageName = () => {
    return language === 'mm' ? pkg.name_mm : pkg.name_en;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            {t('points.packages.confirmPurchase') || 'Confirm Purchase'}
          </DialogTitle>
          <DialogDescription>
            {t('points.packages.confirmPurchaseDesc') || 'Please confirm your point package purchase'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {t('points.packages.package') || 'Package'}
              </span>
              <span className="font-semibold">{getPackageName()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {t('points.balance.points') || 'Points'}
              </span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold">{pkg.points.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {t('points.packages.price') || 'Price'}
              </span>
              <span className="font-semibold text-primary">{pkg.formatted_price}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {t('forms.cancel') || 'Cancel'}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading
              ? t('points.packages.processing') || 'Processing...'
              : t('points.packages.confirm') || 'Confirm Purchase'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

