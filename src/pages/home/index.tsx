import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PropertyCarousel } from './components/carousel';
import { AdvancedSearchFilter, type SearchFilters } from './components/search';
import { 
  FeaturedAdvertisementsSection,
  PremiumPostsSection,
  WantedListingsSection,
  PropertyListingsSection,
  EventsSection,
} from './components/sections';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { memo, useMemo, useCallback } from 'react';
import {
  Home as HomeIcon,
  Search,
  MapPin,
  Award,
  ArrowRight,
  Building2,
  Users,
  PlusCircle,
  Banknote,
  Calculator,
  Scale
} from 'lucide-react';

export const Home = memo(function Home() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSearch = useCallback((filters: SearchFilters) => {
    // Navigate to property listing page with filters
    navigate('/modules', { state: { filters } });
  }, [navigate]);
  
  const stats = useMemo(() => [
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
  ], []);

  const features = useMemo(() => [
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
  ], []);

  const companyHighlights = useMemo(() => [
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
  ], []);

  const legalTeamPreview = useMemo(() => [
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
  ], []);

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

      {/* Premium Posts */}
      <PremiumPostsSection />

      {/* Wanted Listings */}
      <WantedListingsSection />

      {/* Property Listings */}
      <PropertyListingsSection />

      {/* Featured Advertisements */}
      <FeaturedAdvertisementsSection />

      {/* Events */}
      <EventsSection />

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
});

