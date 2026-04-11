/**
 * Detail Sidebar Ads Card Component
 * 
 * Separate card component for displaying ads carousel in property detail page sidebar.
 */

import { Card } from '@/components/ui/card';
import { DetailSidebarAdsCarousel } from './DetailSidebarAdsCarousel';
import type { DetailSidebarAdsSlot } from '@/hooks/queries/home';

interface DetailSidebarAdsCardProps {
  sidebarSlot?: DetailSidebarAdsSlot;
}

export function DetailSidebarAdsCard({ sidebarSlot = 1 }: DetailSidebarAdsCardProps) {
  return (
    <Card className="overflow-hidden p-0 gap-0 shadow-sm">
      <DetailSidebarAdsCarousel sidebarSlot={sidebarSlot} />
    </Card>
  );
}

