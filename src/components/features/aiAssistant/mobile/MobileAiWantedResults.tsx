import { memo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Bed, Bath, Square, DollarSign, Home, Calendar } from 'lucide-react';
import type { AiToolResult, AiWantedListing } from '@/types/aiAssistant';

interface MobileAiWantedResultsProps {
  tool: AiToolResult;
}

export const MobileAiWantedResults = memo(function MobileAiWantedResults({ tool }: MobileAiWantedResultsProps) {
  // Support both mapped type and raw tool name
  const isWantedListingTool = tool.type === 'wanted_listing_search' || 
                               tool.type === 'wantedlistingsearchtool' ||
                               tool.name?.toLowerCase().includes('wantedlisting');
  
  if (!isWantedListingTool || !tool.result) {
    return null;
  }

  const result = tool.result as { count: number; wanting_lists: AiWantedListing[] };
  const listings = result.wanting_lists || [];

  if (listings.length === 0) {
    return null;
  }

  const formatBudget = (min: string | null, max: string | null) => {
    if (!min && !max) return null;
    if (min && max) return `${min} - ${max} MMK`;
    if (min) return `From ${min} MMK`;
    if (max) return `Up to ${max} MMK`;
    return null;
  };

  const formatArea = (min: string | null, max: string | null) => {
    if (!min && !max) return null;
    if (min && max) return `${min} - ${max} sqft`;
    if (min) return `From ${min} sqft`;
    if (max) return `Up to ${max} sqft`;
    return null;
  };

  return (
    <div className="mt-4 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
        <h3 className="text-sm font-bold text-gray-900">
          Found {result.count} {result.count === 1 ? 'wanted listing' : 'wanted listings'}
        </h3>
      </div>
      
      <div className="flex flex-col gap-3">
        {listings.map((listing, index) => (
          <a
            key={listing.id}
            href={`/mobile/wanted/${listing.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <Card className="group hover:shadow-xl transition-all border-border/50 backdrop-blur-sm h-full flex flex-col overflow-hidden">
              <CardHeader className="p-3 sm:p-6 space-y-2 sm:space-y-3 pb-3 sm:pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="mb-1.5 sm:mb-2 text-sm sm:text-base group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
                      {listing.title}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {listing.property_type && (
                        <Badge variant="outline" className="bg-primary/5 border-primary/20 text-xs">
                          <Home className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                          {listing.property_type}
                        </Badge>
                      )}
                      {listing.wanted_type && (
                        <Badge 
                          variant="outline" 
                          className={listing.wanted_type === 'buyer' 
                            ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' 
                            : 'bg-purple-500/10 text-purple-600 border-purple-500/20'}
                        >
                          {listing.wanted_type === 'buyer' ? 'Buyer' : 'Renter'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="min-h-[2rem] sm:min-h-[2.5rem]">
                  {listing.description ? (
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                      {listing.description}
                    </p>
                  ) : (
                    <div className="text-xs sm:text-sm text-muted-foreground line-clamp-2 opacity-0">
                      &nbsp;
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-3 sm:p-6 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
                <div className="space-y-1.5 sm:space-y-2">
                  {(listing.prefer_region || listing.prefer_township) && (
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                      <span className="line-clamp-1">
                        {listing.prefer_township || ''}
                        {listing.prefer_township && listing.prefer_region ? ', ' : ''}
                        {listing.prefer_region || ''}
                      </span>
                    </div>
                  )}
                  
                  {formatBudget(listing.min_budget, listing.max_budget) && (
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                      <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                      <span>{formatBudget(listing.min_budget, listing.max_budget)}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 sm:gap-3 pt-1.5 sm:pt-2">
                    {listing.bedrooms && (
                      <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm">
                        <Bed className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                        <span className="text-muted-foreground">{listing.bedrooms} Beds</span>
                      </div>
                    )}
                    {listing.bathrooms && (
                      <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm">
                        <Bath className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                        <span className="text-muted-foreground">{listing.bathrooms} Baths</span>
                      </div>
                    )}
                    {formatArea(listing.min_area, listing.max_area) && (
                      <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm">
                        <Square className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                        <span className="text-muted-foreground">{formatArea(listing.min_area, listing.max_area)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 sm:pt-4 border-t border-border/50 space-y-2 sm:space-y-3">
                  {listing.created_at && (
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span>{new Date(listing.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  )}

                  {listing.contact_name && (
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      Contact: <span className="font-medium text-foreground">{listing.contact_name}</span>
                      {listing.contact_phone && (
                        <span className="ml-2">• {listing.contact_phone}</span>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
});
