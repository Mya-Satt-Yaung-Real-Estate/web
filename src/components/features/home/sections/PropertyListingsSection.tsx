/**
 * Property Listings Section
 * 
 * Lazy-loaded section for featured property listings.
 */

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PropertyListingCard } from '@/components/features/home/PropertyListingCard';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { memo } from 'react';

interface PropertyListing {
  id: string;
  image: string;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  type: string;
  featured: boolean;
  likes: number;
  comments: number;
}

interface PropertyListingsSectionProps {
  featuredListings: PropertyListing[];
}

export const PropertyListingsSection = memo(function PropertyListingsSection({ featuredListings }: PropertyListingsSectionProps) {
  const { t } = useLanguage();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="mb-4">{t('listings.title')}</h2>
            <p className="text-muted-foreground">
              {t('listings.subtitle')}
            </p>
          </div>
          <Link to="/search-all?type=property">
            <Button variant="outline">
              {t('listings.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredListings.map(listing => (
            <PropertyListingCard key={listing.id} {...listing} />
          ))}
        </div>
      </div>
    </section>
  );
});

