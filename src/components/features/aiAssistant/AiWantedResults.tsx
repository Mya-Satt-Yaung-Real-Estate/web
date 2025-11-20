import { memo } from 'react';
import type { AiToolResult, AiWantedListing } from '@/types/aiAssistant';

interface AiWantedResultsProps {
  tool: AiToolResult;
}

export const AiWantedResults = memo(function AiWantedResults({ tool }: AiWantedResultsProps) {
  if (tool.type !== 'wanted_listing_search' || !tool.result) {
    return null;
  }

  const result = tool.result as { count: number; wanting_lists: AiWantedListing[] };
  const listings = result.wanting_lists || [];

  if (listings.length === 0) {
    return null;
  }

  const formatBudget = (min: number | null, max: number | null) => {
    if (!min && !max) return null;
    if (min && max) return `${(min / 1000000).toFixed(1)}M - ${(max / 1000000).toFixed(1)}M MMK`;
    if (min) return `From ${(min / 1000000).toFixed(1)}M MMK`;
    if (max) return `Up to ${(max / 1000000).toFixed(1)}M MMK`;
    return null;
  };

  const formatArea = (min: number | null, max: number | null) => {
    if (!min && !max) return null;
    if (min && max) return `${min} - ${max} sqft`;
    if (min) return `From ${min} sqft`;
    if (max) return `Up to ${max} sqft`;
    return null;
  };

  return (
    <div className="mt-6 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
        <h3 className="text-base font-semibold text-gray-900">
          Found {result.count} {result.count === 1 ? 'wanted listing' : 'wanted listings'}
        </h3>
      </div>
      
      <div className="flex flex-col gap-4">
        {listings.map((listing, index) => (
          <div key={listing.id} style={{ animationDelay: `${index * 50}ms` }}>
            <h4 className="font-semibold text-sm mb-1.5 text-gray-900">
              {listing.title}
              {listing.wanted_type && (
                <span className="text-gray-600 font-normal ml-2">
                  ({listing.wanted_type === 'buyer' ? 'Buyer' : 'Renter'})
                </span>
              )}
            </h4>
            {listing.description && (
              <p className="text-sm text-gray-600 leading-relaxed mb-1.5">
                {listing.description}
              </p>
            )}
            <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-1.5">
              {listing.property_type && (
                <span><span className="font-medium">Type:</span> {listing.property_type}</span>
              )}
              {listing.prefer_region && (
                <span><span className="font-medium">Location:</span> {listing.prefer_region}{listing.prefer_township ? `, ${listing.prefer_township}` : ''}</span>
              )}
              {listing.bedrooms && (
                <span><span className="font-medium">Bedrooms:</span> {listing.bedrooms}</span>
              )}
              {listing.bathrooms && (
                <span><span className="font-medium">Bathrooms:</span> {listing.bathrooms}</span>
              )}
              {formatBudget(listing.min_budget, listing.max_budget) && (
                <span><span className="font-medium">Budget:</span> {formatBudget(listing.min_budget, listing.max_budget)}</span>
              )}
              {formatArea(listing.min_area, listing.max_area) && (
                <span><span className="font-medium">Area:</span> {formatArea(listing.min_area, listing.max_area)}</span>
              )}
            </div>
            {listing.additional_requirement && (
              <p className="text-sm text-gray-600 mb-1.5">
                <span className="font-medium">Additional Requirements:</span> {listing.additional_requirement}
              </p>
            )}
            {listing.contact_name && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Contact:</span> {listing.contact_name}
                {listing.contact_phone && ` - ${listing.contact_phone}`}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

