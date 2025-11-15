/**
 * Legal Team Section
 * 
 * Displays legal team members from the API.
 */

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HomeLegalCard } from '../cards';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHomeLegalTeam } from '@/hooks/queries/home';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { memo, useMemo } from 'react';
import type { LegacyTeamMember } from '@/types/legacy';

export const LegalTeamSection = memo(function LegalTeamSection() {
  const { t } = useLanguage();
  const { data, isLoading, error } = useHomeLegalTeam();

  // Get legal team members from API response
  const legalTeam = useMemo(() => {
    // When per_page is set, API returns paginated response: { success, message, data: { data: [], pagination: {} } }
    // When per_page is not set, API returns: { success, message, data: [] }
    // Since we're using api.get, the response is wrapped: { data: { success, message, data: ... } }
    if (!data?.data?.data) return [];
    
    const responseData = data.data.data;
    
    // Check if it's a direct array
    if (Array.isArray(responseData)) {
      return responseData;
    }
    
    // If paginated, the structure is { data: [], pagination: {} }
    if (responseData && typeof responseData === 'object' && 'data' in responseData && Array.isArray((responseData as any).data)) {
      return (responseData as any).data;
    }
    
    return [];
  }, [data]);

  // Loading state
  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <Skeleton className="w-32 h-32 rounded-full mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-6 w-1/3 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-10 w-full mt-4" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-red-500">
            <p>{t('search.errorLoadingLegal') || 'Failed to load legal team. Please try again later.'}</p>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (legalTeam.length === 0) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="mb-2">{t('legalTeam.title')}</h3>
              <p className="text-muted-foreground">
                {t('legalTeam.subtitle')}
              </p>
            </div>
            <Link to="/legacy">
              <Button variant="outline" className="gap-2">
                {t('legalTeam.viewAll')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="text-center text-muted-foreground py-12">
            <p>{t('search.noLegalFound') || 'No legal team members found'}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="mb-2">{t('legalTeam.title')}</h3>
            <p className="text-muted-foreground">
              {t('legalTeam.subtitle')}
            </p>
          </div>
          <Link to="/legacy">
            <Button variant="outline" className="gap-2">
              {t('legalTeam.viewAll')}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {legalTeam.map((member: LegacyTeamMember) => (
            <HomeLegalCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
});

