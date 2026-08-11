/**
 * Package Card Component
 * 
 * Displays individual point package with purchase button.
 */

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FeatureBadge } from '@/components/ui/FeatureBadge';
import { ExpiryBadge } from '@/components/ui/ExpiryBadge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Package, Star } from 'lucide-react';
import type { PointPackage } from '@/types/points';

interface PackageCardProps {
  package: PointPackage;
  onPurchase: (packageId: number) => void;
  isLoading?: boolean;
}

export function PackageCard({ package: pkg, onPurchase, isLoading }: PackageCardProps) {
  const { t, language } = useLanguage();

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getPackageName = () => {
    return language === 'mm' ? pkg.name_mm : pkg.name_en;
  };

  const getDescription = () => {
    if (language === 'mm' && pkg.description_mm) {
      return pkg.description_mm;
    }
    return pkg.description_en || '';
  };

  return (
    <Card className="relative h-full flex flex-col hover:shadow-lg transition-shadow">
      {pkg.feature && (
        <div className="absolute top-3 left-3 z-10">
          <FeatureBadge label={pkg.feature} />
        </div>
      )}
      {pkg.expiry_days != null && (
        <div className="absolute top-3 right-3 z-10">
          <ExpiryBadge
            label={`${formatNumber(pkg.expiry_days)} ${t('points.packages.days') || 'days'}`}
          />
        </div>
      )}
      <CardContent className="p-6 pt-8 flex flex-col flex-1">
        {/* Package Header */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Package className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">
              {getPackageName()}
            </h3>
          </div>
          {getDescription() && (
            <p className="text-sm text-muted-foreground">
              {getDescription()}
            </p>
          )}
        </div>

        {/* Points Display */}
        <div className="text-center mb-6 flex-1">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
            <span className="text-3xl font-bold text-primary">
              {formatNumber(pkg.points)}
            </span>
            <span className="text-lg text-muted-foreground">
              {t('points.balance.points') || 'Points'}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="text-center mb-6">
          <p className="text-2xl font-bold text-primary mb-1">
            {pkg.formatted_price}
          </p>
          <p className="text-xs text-muted-foreground">
            {t('points.packages.price') || 'One-time payment'}
          </p>
        </div>

        {/* Buy Now Button */}
        <Button
          onClick={() => onPurchase(pkg.id)}
          disabled={isLoading}
          // className="flex-1 bg-primary/10 text-primary hover:bg-primary/20"
          className="w-full shadow-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all"
          size="lg"
          variant={'outline'}
        >
          {isLoading ? (
            <>
              {t('points.packages.processing') || 'Processing...'}
            </>
          ) : (
            <>
              {t('points.packages.buyNow') || 'Buy Now'}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

