/**
 * Balance Card Component
 * 
 * Displays current point balance with FIFO breakdown.
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePointFifo } from '@/hooks/queries/usePoints';
import { Star, TrendingUp, TrendingDown, Clock, Package, ChevronDown, ChevronUp } from 'lucide-react';
import type { PointAllocation } from '@/types/points';

export function BalanceCard() {
  const { t, language } = useLanguage();
  const { data, isLoading, error } = usePointFifo();
  const [isFifoExpanded, setIsFifoExpanded] = useState(false);

  if (isLoading) {
    return (
      <Card className="backdrop-blur-sm bg-background/95 shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="backdrop-blur-sm bg-background/95 shadow-sm border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">
            {t('points.balance.error') || 'Error Loading Balance'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t('points.balance.errorMessage') || 'Failed to load point balance. Please try again later.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  const fifoData = data?.data?.data;
  if (!fifoData) {
    return null;
  }

  const { current_balance, summary, allocations } = fifoData;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getPackageName = (allocation: PointAllocation) => {
    if (!allocation.package) return 'N/A';
    return language === 'mm' ? allocation.package.name_mm : allocation.package.name_en;
  };

  const getStatusBadgeVariant = (status: PointAllocation['status']) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'partially_consumed':
        return 'secondary';
      case 'consumed':
        return 'outline';
      case 'expired':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="backdrop-blur-sm bg-background/95 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-normal">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          {t('points.balance.title') || 'Point Balance'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Statistics - Separate Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Current Balance Card */}
          <Card className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <p className="text-sm text-muted-foreground">
                {t('points.balance.currentBalance') || 'Current Balance'}
              </p>
            </div>
            <div className="flex items-baseline justify-center gap-2">
              <p className="text-2xl font-semibold text-primary">
                {formatNumber(current_balance)}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('points.balance.points') || 'Points'}
              </p>
            </div>
          </Card>

          {/* Total Allocated Card */}
          <Card className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <p className="text-sm text-muted-foreground">
                {t('points.balance.totalAllocated') || 'Total Allocated'}
              </p>
            </div>
            <p className="text-2xl font-semibold text-green-600">
              {formatNumber(summary.total_allocated)}
            </p>
          </Card>

          {/* Total Consumed Card */}
          <Card className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <p className="text-sm text-muted-foreground">
                {t('points.balance.totalConsumed') || 'Total Consumed'}
              </p>
            </div>
            <p className="text-2xl font-semibold text-red-600">
              {formatNumber(summary.total_consumed)}
            </p>
          </Card>

          {/* Active Packages Card */}
          <Card className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Package className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-muted-foreground">
                {t('points.balance.activeAllocations') || 'Active Packages'}
              </p>
            </div>
            <p className="text-2xl font-semibold text-blue-600">
              {summary.active_allocations_count}
            </p>
          </Card>
        </div>

        {/* FIFO Allocations List */}
        {allocations.length > 0 ? (
          <div className="space-y-4">
            <div 
              className="flex items-center justify-between cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
              onClick={() => setIsFifoExpanded(!isFifoExpanded)}
            >
              <h3 className="text-base font-normal flex items-center gap-2 text-primary hover:text-primary/80 hover:underline">
                <Clock className="h-4 w-4 text-primary" />
                {t('points.balance.fifoBreakdown') || 'Click here to check breakdown (Oldest first)'}
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {t('points.balance.consumptionOrder') || 'Consumption Order'}
                </Badge>
                {isFifoExpanded ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </div>

            {isFifoExpanded && (
              <div className="space-y-3">
                {allocations.map((allocation, index) => (
                <div
                  key={allocation.id}
                  className="p-4 rounded-lg border border-primary/30 bg-card/50 hover:border-primary/50 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                      #{index + 1}
                    </span>
                    <p className="font-semibold text-sm">
                      {getPackageName(allocation)}
                    </p>
                    {allocation.formatted_allocated_at && (
                      <p className="text-xs text-muted-foreground">
                        {t('points.balance.allocatedOn') || 'Allocated on'}: {allocation.formatted_allocated_at}
                      </p>
                    )}
                    <div className="flex items-center gap-2 ml-auto">
                      {allocation.expires_at && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {allocation.is_expired ? (
                            <span className="text-red-600">
                              {t('points.balance.expired') || 'Expired'} {allocation.formatted_expires_at}
                            </span>
                          ) : (
                            <span>
                              {t('points.balance.expiresOn') || 'Expires on'}: {allocation.formatted_expires_at}
                              {allocation.days_until_expiry !== null && (
                                <span className="ml-1">
                                  ({allocation.days_until_expiry} {t('points.balance.days') || 'days'})
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                      )}
                      {allocation.status !== 'partially_consumed' && allocation.status !== 'active' && (
                        <Badge variant={getStatusBadgeVariant(allocation.status)}>
                          {allocation.status_label}
                        </Badge>
                      )}
                      {allocation.days_until_expiry !== null && allocation.days_until_expiry <= 30 && !allocation.is_expired && (
                        <Badge variant="destructive" className="text-xs">
                          {allocation.days_until_expiry} {t('points.balance.daysLeft') || 'days left'}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Points Breakdown */}
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {t('points.balance.allocated') || 'Allocated'}
                      </p>
                      <p className="font-semibold">{formatNumber(allocation.points_allocated)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {t('points.balance.remaining') || 'Remaining'}
                      </p>
                      <p className="font-semibold text-green-600">
                        {formatNumber(allocation.points_remaining)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {t('points.balance.consumed') || 'Consumed'}
                      </p>
                      <p className="font-semibold text-red-600">
                        {formatNumber(allocation.points_consumed)}
                      </p>
                    </div>
                  </div>

                  {/* Consumption Progress Bar */}
                  {allocation.points_allocated > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>{t('points.balance.consumption') || 'Consumption'}</span>
                        <span>{allocation.consumption_percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${allocation.consumption_percentage}%` }}
                        />
                      </div>
                    </div>
                  )}

                </div>
              ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t('points.balance.noAllocations') || 'No active point allocations found'}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

