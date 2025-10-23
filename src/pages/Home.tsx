import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PropertyCarousel } from '@/components/home/PropertyCarousel';
import { AdvancedSearchFilter, type SearchFilters } from '@/components/home/AdvancedSearchFilter';
import { AdvertisementCard } from '@/components/home/AdvertisementCard';
import { AdvertisementCardSimple } from '@/components/home/AdvertisementCardSimple';
import { EventCard } from '@/components/home/EventCard';
import { PremiumPostCard } from '@/components/home/PremiumPostCard';
import { WantedListingCard } from '@/components/home/WantedListingCard';
import { PropertyListingCard } from '@/components/home/PropertyListingCard';
import { MapView } from '@/components/home/MapView';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
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

  const premiumPosts = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop',
      title: 'Spectacular Waterfront Penthouse',
      price: '7,350M MMK',
      location: 'Inya Lake, Yangon',
      bedrooms: 6,
      bathrooms: 5,
      area: '6,200 sqft',
      type: t('listings.forSale'),
      views: 12500,
      trending: true,
      likes: 342,
      comments: 89,
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&auto=format&fit=crop',
      title: 'Ultra-Modern Smart Mansion',
      price: '8,820M MMK',
      location: 'Golden Valley, Yangon',
      bedrooms: 7,
      bathrooms: 6,
      area: '8,500 sqft',
      type: t('listings.forSale'),
      views: 15300,
      trending: true,
      likes: 521,
      comments: 124,
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop',
      title: 'Luxury Hillside Estate',
      price: '5,985M MMK',
      location: 'Bahan Township, Yangon',
      bedrooms: 5,
      bathrooms: 5,
      area: '5,800 sqft',
      type: t('listings.forSale'),
      views: 9800,
      trending: false,
      likes: 287,
      comments: 63,
    },
    {
      id: '4',
      image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&auto=format&fit=crop',
      title: 'Contemporary Luxury Villa',
      price: '6,510M MMK',
      location: 'Star City, Yangon',
      bedrooms: 6,
      bathrooms: 5,
      area: '7,000 sqft',
      type: t('listings.forSale'),
      views: 11200,
      trending: true,
      likes: 398,
      comments: 91,
    },
    {
      id: '5',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop',
      title: 'Elegant Garden Mansion',
      price: '4,725M MMK',
      location: 'Mayangone, Yangon',
      bedrooms: 5,
      bathrooms: 4,
      area: '5,200 sqft',
      type: t('listings.forSale'),
      views: 8600,
      trending: false,
      likes: 231,
      comments: 47,
    },
    {
      id: '6',
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop',
      title: 'Riverside Luxury Residence',
      price: '9,975M MMK',
      location: 'Yangon River View',
      bedrooms: 8,
      bathrooms: 7,
      area: '9,800 sqft',
      type: t('listings.forSale'),
      views: 17800,
      trending: true,
      likes: 672,
      comments: 156,
    },
    {
      id: '7',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop',
      title: 'Modern Minimalist Villa',
      price: '3,675M MMK',
      location: 'Hlaing, Yangon',
      bedrooms: 4,
      bathrooms: 4,
      area: '4,500 sqft',
      type: t('listings.forSale'),
      views: 7200,
      trending: false,
      likes: 189,
      comments: 38,
    },
    {
      id: '8',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop',
      title: 'Skyline Penthouse Suite',
      price: '11,550M MMK',
      location: 'Downtown Yangon',
      bedrooms: 6,
      bathrooms: 6,
      area: '7,800 sqft',
      type: t('listings.forSale'),
      views: 19500,
      trending: true,
      likes: 823,
      comments: 201,
    },
  ];

  const featuredListings = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop',
      title: 'Modern Luxury Villa with Pool',
      price: '2,625M MMK',
      location: 'Golden Valley, Yangon',
      bedrooms: 5,
      bathrooms: 4,
      area: '4,500 sqft',
      type: t('listings.forSale'),
      featured: true,
      likes: 156,
      comments: 42,
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop',
      title: 'Downtown Luxury Apartment',
      price: '5.25M MMK/month',
      location: 'City Center, Mandalay',
      bedrooms: 3,
      bathrooms: 2,
      area: '1,800 sqft',
      type: t('listings.forRent'),
      featured: false,
      likes: 98,
      comments: 27,
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop',
      title: 'Contemporary Family Home',
      price: '1,785M MMK',
      location: 'Star City, Yangon',
      bedrooms: 4,
      bathrooms: 3,
      area: '3,200 sqft',
      type: t('listings.forSale'),
      featured: true,
      likes: 134,
      comments: 31,
    },
    {
      id: '4',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop',
      title: 'Luxury Penthouse Suite',
      price: '7.98M MMK/month',
      location: 'Inya Lake, Yangon',
      bedrooms: 4,
      bathrooms: 3,
      area: '2,600 sqft',
      type: t('listings.forRent'),
      featured: false,
      likes: 187,
      comments: 53,
    },
  ];

  const advertisements = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop',
      title: 'Grand Opening Sale - 20% Off on Select Properties',
      description: 'Limited time offer on premium residential properties in prime locations. Don\'t miss this exclusive opportunity!',
      company: 'Jade Property Group',
      category: 'Special Offer',
      validUntil: 'Dec 31, 2025',
      promoted: true,
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop',
      title: 'Investment Opportunity - Commercial Spaces',
      description: 'High-yield commercial properties available in major business districts. Perfect for investors seeking stable returns.',
      company: 'Elite Real Estate Partners',
      category: 'Investment',
      validUntil: 'Jan 15, 2026',
      promoted: false,
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&auto=format&fit=crop',
      title: 'Luxury Condo Pre-Launch - Early Bird Discount',
      description: 'Be among the first to own a unit in our newest luxury development. Special pricing for early registrations.',
      company: 'Premium Developers Ltd',
      category: 'New Launch',
      validUntil: 'Nov 30, 2025',
      promoted: true,
    },
    {
      id: '4',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop',
      title: 'Zero Down Payment Housing Scheme',
      description: 'Own your dream home with no initial payment. Flexible financing options with low monthly installments available.',
      company: 'Jade Property Finance',
      category: 'Financing',
      validUntil: 'Feb 28, 2026',
      promoted: true,
    },
    {
      id: '5',
      image: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&auto=format&fit=crop',
      title: 'Smart Home Upgrade Package - Free Installation',
      description: 'Get complimentary smart home system installation worth 10M MMK with selected property purchases.',
      company: 'Smart Living Solutions',
      category: 'Promotion',
      validUntil: 'Jan 20, 2026',
      promoted: false,
    },
    {
      id: '6',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop',
      title: 'Referral Rewards Program - Earn 5M MMK',
      description: 'Refer a friend and earn up to 5M MMK in rewards. Both you and your referral receive exclusive benefits!',
      company: 'Jade Property Group',
      category: 'Rewards',
      validUntil: 'Dec 31, 2025',
      promoted: false,
    },
    {
      id: '7',
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&auto=format&fit=crop',
      title: 'Waterfront Living - Premium Apartments Available',
      description: 'Experience luxurious waterfront living with stunning lake views and world-class amenities. Book your site visit today!',
      company: 'Waterfront Estates',
      category: 'New Launch',
      validUntil: 'Mar 15, 2026',
      promoted: true,
    },
    {
      id: '8',
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop',
      title: 'Year-End Property Expo - Exclusive Deals',
      description: 'Join our biggest property showcase of the year with special discounts and instant approval on home loans.',
      company: 'Jade Property Group',
      category: 'Event',
      validUntil: 'Dec 20, 2025',
      promoted: true,
    },
    {
      id: '9',
      image: 'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800&auto=format&fit=crop',
      title: 'Green Living Community - Eco-Friendly Homes',
      description: 'Sustainable living meets modern luxury. Solar-powered homes with rainwater harvesting and organic gardens.',
      company: 'EcoLife Developers',
      category: 'Eco-Friendly',
      validUntil: 'Feb 10, 2026',
      promoted: false,
    },
    {
      id: '10',
      image: 'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800&auto=format&fit=crop',
      title: 'Business District Office Spaces - Move-in Ready',
      description: 'Premium office spaces in the heart of downtown. Fully furnished with high-speed internet and parking.',
      company: 'Corporate Realty',
      category: 'Commercial',
      validUntil: 'Jan 31, 2026',
      promoted: false,
    },
    {
      id: '11',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop',
      title: 'Family Homes with Gardens - Limited Units',
      description: 'Spacious family homes with private gardens in a secure gated community. Perfect for growing families.',
      company: 'Family Living Estates',
      category: 'Residential',
      validUntil: 'Mar 30, 2026',
      promoted: true,
    },
    {
      id: '12',
      image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&auto=format&fit=crop',
      title: 'Student Housing - Budget-Friendly Options',
      description: 'Affordable studio apartments near universities with study rooms, Wi-Fi, and 24/7 security. Student discounts available!',
      company: 'Campus Living Solutions',
      category: 'Student Housing',
      validUntil: 'Apr 15, 2026',
      promoted: false,
    },
  ];

  const events = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
      title: 'Real Estate Investment Summit 2025',
      description: 'Join industry experts to discuss market trends, investment strategies, and networking opportunities.',
      date: '15 Nov',
      time: '9:00 AM - 5:00 PM',
      location: 'Yangon Convention Center',
      attendees: 350,
      category: 'Conference',
      status: 'upcoming' as const,
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop',
      title: 'First-Time Home Buyer Workshop',
      description: 'Learn everything you need to know about purchasing your first home, from financing to closing.',
      date: '22 Nov',
      time: '2:00 PM - 4:30 PM',
      location: 'Online Webinar',
      attendees: 180,
      category: 'Workshop',
      status: 'upcoming' as const,
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop',
      title: 'Luxury Property Showcase',
      description: 'Exclusive viewing of premium properties with complimentary consultation from our expert advisors.',
      date: '8 Nov',
      time: '10:00 AM - 6:00 PM',
      location: 'Jade Property Gallery, Mandalay',
      attendees: 125,
      category: 'Open House',
      status: 'ongoing' as const,
    },
  ];

  const wantedListings = [
    {
      id: '1',
      title: 'Looking for 3 Bedroom Condo in Yangon',
      propertyType: 'Condominium',
      location: 'Yangon, Myanmar',
      budget: '150M - 200M MMK',
      bedrooms: 3,
      bathrooms: 2,
      postedDate: '2025-10-14',
      status: 'Active' as const,
      description: 'Seeking a modern condominium with parking space, gym access, and good security.',
      poster: 'Ko Aung',
      responses: 12,
      listingType: 'buyer' as const,
    },
    {
      id: '2',
      title: 'Wanted: Commercial Space in Downtown',
      propertyType: 'Commercial Building',
      location: 'Downtown Yangon, Myanmar',
      budget: '300M - 500M MMK',
      area: '2,000 sqft',
      postedDate: '2025-10-12',
      status: 'Active' as const,
      description: 'Looking for ground floor commercial space suitable for retail business.',
      poster: 'Ma Thandar',
      responses: 8,
      listingType: 'renter' as const,
    },
    {
      id: '3',
      title: 'Need Villa with Garden in Golden Valley',
      propertyType: 'Villa',
      location: 'Golden Valley, Yangon',
      budget: '500M - 800M MMK',
      bedrooms: 5,
      bathrooms: 4,
      area: '4,500 sqft',
      postedDate: '2025-10-10',
      status: 'Active' as const,
      description: 'Seeking luxury villa with large garden, swimming pool, and modern amenities.',
      poster: 'U Kyaw Win',
      responses: 15,
      listingType: 'buyer' as const,
    },
    {
      id: '4',
      title: 'Looking for Office Space in Business District',
      propertyType: 'Office Space',
      location: 'Central Business District, Yangon',
      budget: '200M - 350M MMK',
      area: '1,500 sqft',
      postedDate: '2025-10-08',
      status: 'Active' as const,
      description: 'Need office space with good parking facilities and modern infrastructure.',
      poster: 'Daw Aye',
      responses: 6,
      listingType: 'renter' as const,
    },
    {
      id: '5',
      title: 'Seeking Beachfront Property in Ngwe Saung',
      propertyType: 'Beach House',
      location: 'Ngwe Saung Beach',
      budget: '400M - 600M MMK',
      bedrooms: 4,
      bathrooms: 3,
      area: '3,200 sqft',
      postedDate: '2025-10-06',
      status: 'Active' as const,
      description: 'Looking for beachfront villa for vacation rental business.',
      poster: 'Ko Min',
      responses: 9,
      listingType: 'buyer' as const,
    },
    {
      id: '6',
      title: 'Want Studio Apartment Near University',
      propertyType: 'Studio',
      location: 'Near Yangon University',
      budget: '50M - 80M MMK',
      area: '500 sqft',
      postedDate: '2025-10-04',
      status: 'Active' as const,
      description: 'Student accommodation with basic amenities and good transport links.',
      poster: 'Ma Ei',
      responses: 18,
      listingType: 'renter' as const,
    },
  ];

  // Map locations for property listings
  const propertyLocations = featuredListings.map((listing) => ({
    id: listing.id,
    title: listing.title,
    location: listing.location,
    lat: 16.8661 + (Math.random() - 0.5) * 0.1,
    lng: 96.1951 + (Math.random() - 0.5) * 0.1,
    type: listing.type,
  }));

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

      {/* Featured Advertisements */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="mb-4">{t('ads.title')}</h2>
              <p className="text-muted-foreground">
                {t('ads.subtitle')}
              </p>
            </div>
            <Link to="/search-all?type=advertisement">
              <Button variant="outline">
                {t('ads.viewAll')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {advertisements.map(ad => (
                <CarouselItem key={ad.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <AdvertisementCardSimple 
                    id={ad.id}
                    image={ad.image}
                    title={ad.title}
                    description={ad.description}
                    promoted={ad.promoted}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4 bg-background/90 backdrop-blur-sm border-border/50 hover:bg-primary hover:text-white hover:border-primary transition-all" />
            <CarouselNext className="hidden md:flex -right-4 bg-background/90 backdrop-blur-sm border-border/50 hover:bg-primary hover:text-white hover:border-primary transition-all" />
          </Carousel>
        </div>
      </section>

      {/* Premium Posts */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-amber-50/30 to-background dark:from-amber-950/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h2>{t('premium.title')}</h2>
                <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white border-0">
                  <Star className="h-3 w-3 mr-1 fill-white" />
                  Premium
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {t('premium.subtitle')}
              </p>
            </div>
            <Link to="/search-all?type=premium">
              <Button variant="outline" className="border-primary/30 hover:bg-primary/5">
                {t('premium.viewAll')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {premiumPosts.map(post => (
              <PremiumPostCard key={post.id} {...post} />
            ))}
          </div>
        </div>
      </section>

      {/* Wanted Listings */}
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

      {/* Property Listings */}
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

      {/* Advertisements */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="mb-4">{t('ads.title')}</h2>
              <p className="text-muted-foreground">
                {t('ads.subtitle')}
              </p>
            </div>
            <Link to="/search-all?type=advertisement">
              <Button variant="outline">
                {t('ads.viewAll')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advertisements.map(ad => (
              <AdvertisementCard key={ad.id} {...ad} />
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="mb-4">{t('events.title')}</h2>
              <p className="text-muted-foreground">
                {t('events.subtitle')}
              </p>
            </div>
            <Link to="/search-all?type=event">
              <Button variant="outline">
                {t('events.viewAll')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {events.map(event => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>

          {/* Property Listings Map */}
          <div className="mt-12">
            <div className="mb-6">
              <h3 className="mb-2">Featured Property Locations</h3>
              <p className="text-muted-foreground">
                Explore featured properties on the map
              </p>
            </div>
            <MapView locations={propertyLocations} height="400px" />
          </div>

          {/* Job Posts Section */}
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

