import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, DollarSign, Home, Bed, Bath, Square, Calendar, MessageSquare, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';

// Mock data for UI demonstration
const mockPublicWantingLists = [
  {
    id: 1,
    title: 'Looking for 3 Bedroom House in Yangon',
    wanted_type: 'buyer',
    property_type: 'House',
    location: 'Yangon, Bahan',
    budget: '50M - 80M MMK',
    bedrooms: 3,
    bathrooms: 2,
    area: '1,200 - 2,000 sqft',
    contact_name: 'John Doe',
    created_at: '2025-01-28',
    responses: 5
  },
  {
    id: 2,
    title: 'Need Commercial Space for Office',
    wanted_type: 'renter',
    property_type: 'Commercial',
    location: 'Mandalay, Chan Aye Thar Zan',
    budget: '2M - 5M MMK/month',
    area: '2,000 - 3,000 sqft',
    contact_name: 'Jane Smith',
    created_at: '2025-01-25',
    responses: 2
  },
  {
    id: 3,
    title: 'Wanted: Apartment with Garden View',
    wanted_type: 'buyer',
    property_type: 'Apartment',
    location: 'Yangon, Dagon',
    budget: '30M - 50M MMK',
    bedrooms: 2,
    bathrooms: 2,
    area: '800 - 1,200 sqft',
    contact_name: 'Mike Johnson',
    created_at: '2025-01-20',
    responses: 8
  },
  {
    id: 4,
    title: 'Looking for Land in Naypyidaw',
    wanted_type: 'buyer',
    property_type: 'Land',
    location: 'Naypyidaw',
    budget: '100M - 200M MMK',
    area: '5,000 - 10,000 sqft',
    contact_name: 'Sarah Wilson',
    created_at: '2025-01-18',
    responses: 3
  }
];

export default function PublicWantedList() {
  const seo = seoUtils.getPageSEO('publicWantedList');
  const [filters, setFilters] = useState({
    search: '',
    wanted_type: '',
    property_type: '',
    region: '',
    township: '',
    min_budget: '',
    max_budget: '',
    bedrooms: '',
    bathrooms: '',
    sort_by: 'created_at',
    sort_direction: 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Mock data for dropdowns
  const propertyTypes = [
    { id: 1, name_en: 'House', name_mm: 'အိမ်' },
    { id: 2, name_en: 'Apartment', name_mm: 'ကွန်ဒို' },
    { id: 3, name_en: 'Commercial', name_mm: 'ကုန်သွယ်ရေး' },
    { id: 4, name_en: 'Land', name_mm: 'မြေ' },
  ];

  const regions = [
    { id: 1, name_en: 'Yangon', name_mm: 'ရန်ကုန်' },
    { id: 2, name_en: 'Mandalay', name_mm: 'မန္တလေး' },
    { id: 3, name_en: 'Naypyidaw', name_mm: 'နေပြည်တော်' },
  ];

  const townships = [
    { id: 1, name_en: 'Bahan', name_mm: 'ဗဟန်း', region_id: 1 },
    { id: 2, name_en: 'Dagon', name_mm: 'ဒဂုံ', region_id: 1 },
    { id: 3, name_en: 'Chan Aye Thar Zan', name_mm: 'ချမ်းအေးသာဇံ', region_id: 2 },
    { id: 4, name_en: 'Mahar Aung Myay', name_mm: 'မဟာအောင်မြေ', region_id: 2 },
  ];

  const availableTownships = townships.filter(township => township.region_id === parseInt(filters.region));

  return (
    <>
      <SEOHead seo={seo} path="/public-wanted-list" />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
                Wanted Listings
              </h1>
              <p className="text-muted-foreground mt-2">
                Browse property requirements from buyers and renters
              </p>
            </div>
            <Link to="/my-wanted-listings/create">
              <Button className="gradient-primary shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105">
                <Plus className="h-4 w-4 mr-2" />
                Post Your Requirements
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <Card className="glass border-border/50 mb-6">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search wanted listings..."
                    value={filters.search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filters Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Select value={filters.wanted_type || "all"} onValueChange={(value) => handleFilterChange('wanted_type', value === "all" ? "" : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="buyer">Buyers</SelectItem>
                      <SelectItem value="renter">Renters</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filters.property_type || "all"} onValueChange={(value) => handleFilterChange('property_type', value === "all" ? "" : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Property Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filters.region || "all"} onValueChange={(value) => {
                    handleFilterChange('region', value === "all" ? "" : value);
                    handleFilterChange('township', '');
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Regions</SelectItem>
                      {regions.map((region) => (
                        <SelectItem key={region.id} value={region.id.toString()}>
                          {region.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select 
                    value={filters.township || "all"} 
                    onValueChange={(value) => handleFilterChange('township', value === "all" ? "" : value)}
                    disabled={!filters.region}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Township" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Townships</SelectItem>
                      {availableTownships.map((township) => (
                        <SelectItem key={township.id} value={township.id.toString()}>
                          {township.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Filters Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Input
                    type="number"
                    placeholder="Min Budget (MMK)"
                    value={filters.min_budget}
                    onChange={(e) => handleFilterChange('min_budget', e.target.value)}
                  />

                  <Input
                    type="number"
                    placeholder="Max Budget (MMK)"
                    value={filters.max_budget}
                    onChange={(e) => handleFilterChange('max_budget', e.target.value)}
                  />

                  <Select value={filters.bedrooms || "any"} onValueChange={(value) => handleFilterChange('bedrooms', value === "any" ? "" : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Bedrooms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filters.bathrooms || "any"} onValueChange={(value) => handleFilterChange('bathrooms', value === "any" ? "" : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Bathrooms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort */}
                <div className="flex gap-2">
                  <Select value={filters.sort_by} onValueChange={(value) => handleFilterChange('sort_by', value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created_at">Date Posted</SelectItem>
                      <SelectItem value="updated_at">Last Updated</SelectItem>
                      <SelectItem value="title">Title</SelectItem>
                      <SelectItem value="min_budget">Budget</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filters.sort_direction} onValueChange={(value) => handleFilterChange('sort_direction', value)}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">↓</SelectItem>
                      <SelectItem value="asc">↑</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          {false ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="glass border-border/50">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : mockPublicWantingLists.length === 0 ? (
            <Card className="glass border-border/50">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Home className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Wanted Listings Found</h3>
                <p className="text-muted-foreground mb-4">
                  {filters.search || filters.wanted_type || filters.property_type
                    ? 'No listings match your current filters.'
                    : 'No wanted listings are currently available.'}
                </p>
                <Link to="/my-wanted-listings/create">
                  <Button className="gradient-primary shadow-lg shadow-primary/30 hover:shadow-primary/50">
                    <Plus className="h-4 w-4 mr-2" />
                    Post Your Requirements
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Results Count */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  Showing 1 to {mockPublicWantingLists.length} of {mockPublicWantingLists.length} listings
                </p>
              </div>

              {/* Listings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {mockPublicWantingLists.map((listing) => (
                  <Card key={listing.id} className="group hover:shadow-xl transition-all border-border/50 backdrop-blur-sm h-full flex flex-col overflow-hidden">
                    <CardHeader className="space-y-3 pb-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {listing.title}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="bg-primary/5 border-primary/20">
                              <Home className="h-3 w-3 mr-1" />
                              {listing.property_type}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={listing.wanted_type === 'buyer' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' : 'bg-purple-500/10 text-purple-600 border-purple-500/20'}
                            >
                              {listing.wanted_type === 'buyer' ? 'Buyer' : 'Renter'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                      {/* Details */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="line-clamp-1">{listing.location}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <DollarSign className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>{listing.budget}</span>
                        </div>

                        {/* Property specs */}
                        <div className="flex flex-wrap gap-3 pt-2">
                          {listing.bedrooms && (
                            <div className="flex items-center gap-1.5 text-sm">
                              <Bed className="h-4 w-4 text-primary" />
                              <span className="text-muted-foreground">{listing.bedrooms} Beds</span>
                            </div>
                          )}
                          {listing.bathrooms && (
                            <div className="flex items-center gap-1.5 text-sm">
                              <Bath className="h-4 w-4 text-primary" />
                              <span className="text-muted-foreground">{listing.bathrooms} Baths</span>
                            </div>
                          )}
                          {listing.area && (
                            <div className="flex items-center gap-1.5 text-sm">
                              <Square className="h-4 w-4 text-primary" />
                              <span className="text-muted-foreground">{listing.area}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="pt-4 border-t border-border/50 space-y-3">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>Posted {new Date(listing.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>{listing.responses} responses</span>
                          </div>
                        </div>

                        <Button 
                          asChild
                          className="w-full gradient-primary shadow-lg shadow-primary/25 hover:shadow-primary/40"
                          size="sm"
                        >
                          <Link to={`/public-wanted-list/${listing.id}`}>
                            Contact {listing.contact_name}
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={2}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
