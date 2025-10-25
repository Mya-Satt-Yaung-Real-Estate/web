/**
 * Wanted Listings Section
 * 
 * Lazy-loaded section for wanted property listings.
 */

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { WantedListingCard } from '@/components/features/home/WantedListingCard';
import { ArrowRight } from 'lucide-react';
import { memo } from 'react';

interface WantedListing {
  id: string;
  title: string;
  propertyType: string;
  location: string;
  budget: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  postedDate: string;
  status: 'Active' | 'Fulfilled' | 'Expired';
  description?: string;
  poster?: string;
  responses?: number;
  listingType?: 'buyer' | 'renter';
}

interface WantedListingsSectionProps {
  wantedListings: WantedListing[];
}

export const WantedListingsSection = memo(function WantedListingsSection({ wantedListings }: WantedListingsSectionProps) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="mb-4">Wanted Listings</h2>
            <p className="text-muted-foreground">
              Browse active property requests from buyers and renters
            </p>
          </div>
          <Link to="/search-all?type=wanted">
            <Button variant="outline">
              View All Requests
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wantedListings.slice(0, 6).map(listing => (
            <WantedListingCard key={listing.id} {...listing} />
          ))}
        </div>
      </div>
    </section>
  );
});

