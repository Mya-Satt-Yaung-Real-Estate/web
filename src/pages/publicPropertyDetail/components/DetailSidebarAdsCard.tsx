/**
 * Detail Sidebar Ads Card Component
 * 
 * Separate card component for displaying ads carousel in property detail page sidebar.
 */

import { Card, CardContent } from '@/components/ui/card';
import { DetailSidebarAdsCarousel } from './DetailSidebarAdsCarousel';

export function DetailSidebarAdsCard() {
  return (
    <Card>
      <CardContent className="p-6 pt-7">
        <DetailSidebarAdsCarousel />
      </CardContent>
    </Card>
  );
}

