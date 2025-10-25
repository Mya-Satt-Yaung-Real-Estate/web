import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PropertyCarousel } from '@/components/features/home/PropertyCarousel';
import { AdvancedSearchFilter, type SearchFilters } from '@/components/features/home/AdvancedSearchFilter';
// import { LazySection } from '@/components/LazySection';
import { LazyDataLoader } from '@/components/LazyDataLoader';
import { 
  FeaturedAdvertisementsSection,
  PremiumPostsSection,
  WantedListingsSection,
  PropertyListingsSection,
  AdvertisementsSection,
  EventsSection
} from '@/components/features/home/sections';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { dataLoaders } from '@/data/loaders';
import {
  Home as HomeIcon,
  Search,
  MapPin,
  Award,
  ArrowRight,
  Building2,
  Users,
  Star,
  PlusCircle,
  Banknote,
  Calculator,
  DollarSign,
  Clock,
  Scale
} from 'lucide-react';

export function Home() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSearch = (filters: SearchFilters) => {
    // Navigate to property listing page with filters
    navigate('/modules', { state: { filters } });
  };
  
  const stats = [
    {
      icon: <HomeIcon className="h-6 w-6" />,
      value: '12,500+',
      label: 'propertiesListed',
    },
    {
      icon: <Search className="h-6 w-6" />,
      value: '3,200+',
      label: 'wantedListing',
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      value: '45+',
      label: 'citiesCovered',
    },
    {
      icon: <Award className="h-6 w-6" />,
      value: '15+',
      label: 'yearsExperience',
    },
  ];

  const features = [
    {
      icon: <Building2 className="h-8 w-8" />,
      title: 'Premium Listings',
      description: 'Curated selection of high-quality properties',
      link: '/premium-listings',
    },
    {
      icon: <PlusCircle className="h-8 w-8" />,
      titleKey: 'services.createListing',
      descriptionKey: 'services.createListingDesc',
      link: '/post-property',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Expert Agents',
      description: 'Professional guidance from experienced realtors',
      link: '/companies',
    },
    {
      icon: <Banknote className="h-8 w-8" />,
      titleKey: 'services.loanRequest',
      descriptionKey: 'services.loanRequestDesc',
      link: '/loan-request',
    },
    {
      icon: <Calculator className="h-8 w-8" />,
      titleKey: 'services.loanCalculator',
      descriptionKey: 'services.loanCalculatorDesc',
      link: '/loan-calculator',
    },
  ];

  const companyHighlights = [
    {
      title: 'About Jade Property',
      description: 'Founded in 2010, Jade Property has grown to become one of the most trusted names in real estate. We specialize in residential, commercial, and investment properties across major metropolitan areas.',
    },
    {
      title: 'Our Track Record',
      description: 'With over $2.5 billion in property transactions and a 98% customer satisfaction rate, we have established ourselves as industry leaders committed to excellence and innovation.',
    },
    {
      title: 'Technology-Driven',
      description: 'We leverage cutting-edge technology including virtual tours, AI-powered property matching, and advanced market analytics to provide our clients with the best possible experience.',
    },
  ];

  const legalTeamPreview = [
    {
      id: 1,
      name: 'U Aung Myat',
      position: 'Senior Legal Advisor',
      specialization: 'Property Law & Contracts',
      experience: '15 years',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop',
      cases: 250,
    },
    {
      id: 2,
      name: 'Daw Thandar Win',
      position: 'Legal Consultant',
      specialization: 'Real Estate Compliance',
      experience: '12 years',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop',
      cases: 180,
    },
    {
      id: 3,
      name: 'U Kyaw Zin',
      position: 'Property Rights Attorney',
      specialization: 'Land Rights & Disputes',
      experience: '10 years',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
      cases: 150,
    },
  ];

  // premiumPosts data is now loaded lazily

  // featuredListings data is now loaded lazily

  // advertisements data is now loaded lazily

  // events data is now loaded lazily

  // wantedListings data is now loaded lazily

  // propertyLocations data is now loaded lazily

  return (
      <div className="min-h-screen">
      {/* Full Screen Property Carousel */}
        <PropertyCarousel />

      {/* Advanced Search Filter */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          <AdvancedSearchFilter onSearch={handleSearch} />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="shadow-lg border-border/50 backdrop-blur-sm h-full group hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50 transition-all duration-300 cursor-pointer hover:-translate-y-1">
                <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-[#4a9b82] text-white mb-3 shadow-lg shadow-primary/25 group-hover:shadow-primary/50 group-hover:scale-110 transition-all">
                    {stat.icon}
                  </div>
                  <h3 className="mb-1 group-hover:text-primary transition-colors">{stat.value}</h3>
                  <p className="text-muted-foreground group-hover:text-foreground transition-colors">{t(`home.${stat.label}`)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Advertisements - Lazy Loaded */}
      <LazyDataLoader
        dataLoader={dataLoaders.loadFeaturedAdvertisements}
        fallback={<div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background"><div className="max-w-7xl mx-auto"><div className="h-32 bg-muted/20 animate-pulse rounded-lg" /></div></div>}
        rootMargin="200px"
      >
        {(data, isLoading, error) => {
          if (error) return <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background"><div className="max-w-7xl mx-auto text-center text-red-500">Failed to load advertisements</div></div>;
          if (isLoading || !data) return <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background"><div className="max-w-7xl mx-auto"><div className="h-32 bg-muted/20 animate-pulse rounded-lg" /></div></div>;
          return <FeaturedAdvertisementsSection advertisements={data} />;
        }}
      </LazyDataLoader>

      {/* Premium Posts - Lazy Loaded */}
      <LazyDataLoader
        dataLoader={dataLoaders.loadPremiumPosts}
        fallback={<div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-amber-50/30 to-background dark:from-amber-950/10"><div className="max-w-7xl mx-auto"><div className="h-32 bg-muted/20 animate-pulse rounded-lg" /></div></div>}
        rootMargin="200px"
      >
        {(data, isLoading, error) => {
          if (error) return <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-amber-50/30 to-background dark:from-amber-950/10"><div className="max-w-7xl mx-auto text-center text-red-500">Failed to load premium posts</div></div>;
          if (isLoading || !data) return <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-amber-50/30 to-background dark:from-amber-950/10"><div className="max-w-7xl mx-auto"><div className="h-32 bg-muted/20 animate-pulse rounded-lg" /></div></div>;
          return <PremiumPostsSection premiumPosts={data} />;
        }}
      </LazyDataLoader>

      {/* Wanted Listings - Lazy Loaded */}
      <LazyDataLoader
        dataLoader={dataLoaders.loadWantedListings}
        fallback={<div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30"><div className="max-w-7xl mx-auto"><div className="h-32 bg-muted/20 animate-pulse rounded-lg" /></div></div>}
        rootMargin="200px"
      >
        {(data, isLoading, error) => {
          if (error) return <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30"><div className="max-w-7xl mx-auto text-center text-red-500">Failed to load wanted listings</div></div>;
          if (isLoading || !data) return <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30"><div className="max-w-7xl mx-auto"><div className="h-32 bg-muted/20 animate-pulse rounded-lg" /></div></div>;
          return <WantedListingsSection wantedListings={data} />;
        }}
      </LazyDataLoader>

      {/* Property Listings - Lazy Loaded */}
      <LazyDataLoader
        dataLoader={dataLoaders.loadPropertyListings}
        fallback={<div className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30"><div className="max-w-7xl mx-auto"><div className="h-32 bg-muted/20 animate-pulse rounded-lg" /></div></div>}
        rootMargin="200px"
      >
        {(data, isLoading, error) => {
          if (error) return <div className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30"><div className="max-w-7xl mx-auto text-center text-red-500">Failed to load property listings</div></div>;
          if (isLoading || !data) return <div className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30"><div className="max-w-7xl mx-auto"><div className="h-32 bg-muted/20 animate-pulse rounded-lg" /></div></div>;
          return <PropertyListingsSection featuredListings={data} />;
        }}
      </LazyDataLoader>

      {/* Advertisements - Lazy Loaded */}
      <LazyDataLoader
        dataLoader={dataLoaders.loadAdvertisements}
        fallback={<div className="py-16 px-4 sm:px-6 lg:px-8"><div className="max-w-7xl mx-auto"><div className="h-32 bg-muted/20 animate-pulse rounded-lg" /></div></div>}
        rootMargin="200px"
      >
        {(data, isLoading, error) => {
          if (error) return <div className="py-16 px-4 sm:px-6 lg:px-8"><div className="max-w-7xl mx-auto text-center text-red-500">Failed to load advertisements</div></div>;
          if (isLoading || !data) return <div className="py-16 px-4 sm:px-6 lg:px-8"><div className="max-w-7xl mx-auto"><div className="h-32 bg-muted/20 animate-pulse rounded-lg" /></div></div>;
          return <AdvertisementsSection advertisements={data} />;
        }}
      </LazyDataLoader>

      {/* Events - Lazy Loaded */}
      <LazyDataLoader
        dataLoader={dataLoaders.loadEventsAndMap}
        fallback={<div className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30"><div className="max-w-7xl mx-auto"><div className="h-32 bg-muted/20 animate-pulse rounded-lg" /></div></div>}
        rootMargin="200px"
      >
        {(data, isLoading, error) => {
          if (error) return <div className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30"><div className="max-w-7xl mx-auto text-center text-red-500">Failed to load events</div></div>;
          if (isLoading || !data) return <div className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30"><div className="max-w-7xl mx-auto"><div className="h-32 bg-muted/20 animate-pulse rounded-lg" /></div></div>;
          return <EventsSection events={data.events} propertyLocations={data.propertyLocations} />;
        }}
      </LazyDataLoader>

      {/* Job Posts Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="mt-16">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
              <div>
                <h2 className="mb-4">{t('jobs.title')}</h2>
                <p className="text-muted-foreground">
                  {t('jobs.subtitle')}
                </p>
              </div>
              <Link to="/search-all?type=job">
                <Button variant="outline">
                  {t('jobs.viewAll')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  id: '1',
                  title: 'Senior Real Estate Agent',
                  company: 'Jade Property Group',
                  location: 'Yangon, Myanmar',
                  type: 'full-time',
                  salary: '800K - 1.5M MMK/month',
                  postedDate: '2025-10-10',
                  featured: true,
                },
                {
                  id: '2',
                  title: 'Property Marketing Specialist',
                  company: 'Jade Property Group',
                  location: 'Yangon, Myanmar',
                  type: 'full-time',
                  salary: '600K - 1M MMK/month',
                  postedDate: '2025-10-12',
                  featured: true,
                },
                {
                  id: '3',
                  title: 'Legal Advisor (Property Law)',
                  company: 'Jade Property Legal Team',
                  location: 'Yangon, Myanmar',
                  type: 'full-time',
                  salary: '1M - 2M MMK/month',
                  postedDate: '2025-10-08',
                  featured: false,
                },
                {
                  id: '4',
                  title: 'Property Consultant',
                  company: 'Jade Property Group',
                  location: 'Mandalay, Myanmar',
                  type: 'full-time',
                  salary: '500K - 900K MMK/month',
                  postedDate: '2025-10-14',
                  featured: false,
                },
                {
                  id: '5',
                  title: 'Customer Success Manager',
                  company: 'Jade Property Group',
                  location: 'Yangon, Myanmar',
                  type: 'remote',
                  salary: '700K - 1.2M MMK/month',
                  postedDate: '2025-10-11',
                  featured: false,
                },
                {
                  id: '6',
                  title: 'Junior Property Appraiser',
                  company: 'Jade Property Valuation',
                  location: 'Yangon, Myanmar',
                  type: 'full-time',
                  salary: '400K - 700K MMK/month',
                  postedDate: '2025-10-13',
                  featured: false,
                },
              ].map((job) => (
                <Card 
                  key={job.id} 
                  className={`group hover:shadow-xl transition-all cursor-pointer ${
                    job.featured ? 'border-primary/50 bg-gradient-to-br from-primary/5 to-transparent' : ''
                  }`}
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {job.featured && (
                            <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white border-0">
                      <Star className="h-3 w-3 mr-1 fill-white" />
                      Featured
                    </Badge>
                  )}
                          <Badge variant={job.type === 'full-time' ? 'default' : 'secondary'}>
                            {job.type === 'full-time' ? t('jobs.fullTime') : job.type}
                          </Badge>
                        </div>
                        <CardTitle className="group-hover:text-primary transition-colors mb-1">
                          {job.title}
                        </CardTitle>
                        <p className="text-muted-foreground flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {job.company}
                        </p>
                      </div>
                </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-primary" />
                        <span>{job.salary}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{t('jobs.postedOn')} {new Date(job.postedDate).toLocaleDateString()}</span>
                    </div>
                    </div>
                    <Button 
                      className="w-full group-hover:bg-primary group-hover:text-white transition-all"
                      variant="outline"
                    >
                      {t('jobs.viewDetails')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Company Information - Why Choose Jade Property */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="mb-4">{t('home.whyChoose')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Industry-leading expertise combined with innovative technology
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {companyHighlights.map((highlight, index) => (
              <div key={index} className="group relative h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/3 rounded-2xl transform transition-transform group-hover:scale-105" />
                <Card className="relative shadow-lg hover:shadow-2xl transition-all border-border/50 backdrop-blur-sm h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="group-hover:text-primary transition-colors">{highlight.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-muted-foreground">{highlight.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Legal Team List Section */}
          <div className="max-w-7xl mx-auto mt-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="mb-2">{t('legalTeam.title')}</h3>
                <p className="text-muted-foreground">
                  {t('legalTeam.subtitle')}
                </p>
              </div>
              <Link to="/legal-team">
                <Button variant="outline" className="gap-2">
                  {t('legalTeam.viewAll')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {legalTeamPreview.map((lawyer) => (
                <Card 
                  key={lawyer.id}
                  className="group relative overflow-hidden border-border/50 hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/10 backdrop-blur-sm cursor-pointer"
                  onClick={() => navigate('/legal-team')}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="relative p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-primary/20 group-hover:border-primary/50 transition-all">
                        <img
                          src={lawyer.photo}
                          alt={lawyer.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="mb-1 group-hover:text-primary transition-colors">{lawyer.name}</h4>
                      <p className="text-muted-foreground mb-3">{lawyer.position}</p>
                      <Badge className="mb-4 gradient-primary text-white">
                        {lawyer.specialization}
                      </Badge>
                      
                      <div className="w-full space-y-2 pt-3 border-t border-border/50">
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <Award className="h-4 w-4 text-primary" />
                          <span>{lawyer.experience} experience</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <Scale className="h-4 w-4 text-primary" />
                          <span>{lawyer.cases}+ cases handled</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features - Our Services */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="mb-4">{t('home.ourServices')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive real estate solutions powered by cutting-edge technology
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group relative h-full cursor-pointer"
                onClick={() => feature.link && navigate(feature.link)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/3 rounded-2xl transform transition-transform group-hover:scale-105" />
                <div className="relative text-center p-8 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg hover:shadow-xl hover:border-primary/30 transition-all h-full flex flex-col items-center justify-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-[#4a9b82] text-white mb-4 shadow-lg shadow-primary/25 group-hover:shadow-primary/50 group-hover:scale-110 transition-all">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 group-hover:text-primary transition-colors">{feature.titleKey ? t(feature.titleKey) : feature.title}</h3>
                  <p className="text-muted-foreground group-hover:text-foreground transition-colors">{feature.descriptionKey ? t(feature.descriptionKey) : feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 gradient-primary animate-gradient" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptLTEyIDEyYzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02eiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] opacity-30" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="mb-4 text-white">{t('home.cta.title')}</h2>
          <p className="mb-8 text-white/90">
            {t('home.cta.description')}
          </p>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="shadow-2xl hover:scale-105 transition-transform">
              {t('home.getStarted')}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

