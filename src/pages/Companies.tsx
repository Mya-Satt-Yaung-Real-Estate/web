import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { SEOHead } from '../components/seo/SEOHead';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { seoUtils } from '../lib/seo';
import { Building2, MapPin, Phone, Mail, Globe, Star, Users, Home, Search } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  logo: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  rating: number;
  properties: number;
  employees: number;
  verified: boolean;
  specialties: string[];
}

export function Companies() {
  const { t } = useLanguage();
  const seo = seoUtils.getPageSEO('companies');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const companies: Company[] = [
    {
      id: '1',
      name: 'Jade Property Group',
      logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&auto=format&fit=crop',
      description: 'Leading real estate company specializing in luxury residential and commercial properties across Myanmar.',
      address: 'Golden Valley, Bahan Township, Yangon',
      phone: '+95 9 123 456 789',
      email: 'info@jadeproperty.com',
      website: 'www.jadeproperty.com',
      rating: 4.8,
      properties: 250,
      employees: 45,
      verified: true,
      specialties: ['Luxury Homes', 'Commercial', 'Investment'],
    },
    {
      id: '2',
      name: 'Myanmar Premier Estates',
      logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format&fit=crop',
      description: 'Trusted property developer and consultant with over 15 years of experience in the Myanmar real estate market.',
      address: 'Downtown, Yangon',
      phone: '+95 9 987 654 321',
      email: 'contact@myanmarpremier.com',
      website: 'www.myanmarpremier.com',
      rating: 4.6,
      properties: 180,
      employees: 32,
      verified: true,
      specialties: ['Residential', 'Land Development', 'Property Management'],
    },
    {
      id: '3',
      name: 'Golden City Developers',
      logo: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&auto=format&fit=crop',
      description: 'Innovative real estate development company focused on sustainable and modern living solutions.',
      address: 'Star City, Yangon',
      phone: '+95 9 555 123 456',
      email: 'info@goldencity.com',
      website: 'www.goldencity.com',
      rating: 4.7,
      properties: 120,
      employees: 28,
      verified: true,
      specialties: ['Modern Living', 'Sustainable Development', 'Smart Homes'],
    },
    {
      id: '4',
      name: 'Yangon Elite Properties',
      logo: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&auto=format&fit=crop',
      description: 'Premium property consultancy specializing in high-end residential and commercial real estate.',
      address: 'Inya Lake, Yangon',
      phone: '+95 9 777 888 999',
      email: 'contact@yangonelite.com',
      website: 'www.yangonelite.com',
      rating: 4.9,
      properties: 95,
      employees: 22,
      verified: true,
      specialties: ['Luxury Properties', 'Prime Locations', 'Exclusive Listings'],
    },
    {
      id: '5',
      name: 'Mandalay Real Estate Co.',
      logo: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format&fit=crop',
      description: 'Established real estate company serving the Mandalay region with comprehensive property services.',
      address: 'Mandalay, Myanmar',
      phone: '+95 9 333 444 555',
      email: 'info@mandalayrealestate.com',
      website: 'www.mandalayrealestate.com',
      rating: 4.5,
      properties: 160,
      employees: 35,
      verified: true,
      specialties: ['Regional Expertise', 'Property Management', 'Investment Advisory'],
    },
    {
      id: '6',
      name: 'Naypyidaw Properties Ltd',
      logo: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&auto=format&fit=crop',
      description: 'Government and commercial property specialists serving the capital region.',
      address: 'Naypyidaw, Myanmar',
      phone: '+95 9 111 222 333',
      email: 'contact@naypyidawproperties.com',
      website: 'www.naypyidawproperties.com',
      rating: 4.4,
      properties: 85,
      employees: 18,
      verified: true,
      specialties: ['Government Properties', 'Commercial Spaces', 'Capital Region'],
    },
    {
      id: '7',
      name: 'Coastal Properties Myanmar',
      logo: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&auto=format&fit=crop',
      description: 'Specializing in beachfront and coastal properties for vacation and investment purposes.',
      address: 'Ngwe Saung, Myanmar',
      phone: '+95 9 666 777 888',
      email: 'info@coastalproperties.com',
      website: 'www.coastalproperties.com',
      rating: 4.6,
      properties: 75,
      employees: 15,
      verified: true,
      specialties: ['Beachfront Properties', 'Vacation Rentals', 'Coastal Development'],
    },
    {
      id: '8',
      name: 'Urban Living Solutions',
      logo: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&auto=format&fit=crop',
      description: 'Modern urban development company focused on smart city solutions and contemporary living.',
      address: 'Hlaing, Yangon',
      phone: '+95 9 444 555 666',
      email: 'contact@urbanliving.com',
      website: 'www.urbanliving.com',
      rating: 4.3,
      properties: 110,
      employees: 25,
      verified: true,
      specialties: ['Smart Cities', 'Urban Planning', 'Modern Living'],
    },
  ];

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.specialties.some(specialty => 
                           specialty.toLowerCase().includes(searchQuery.toLowerCase())
                         );
    
    const matchesCategory = selectedCategory === 'all' || 
                            company.specialties.some(specialty => 
                              specialty.toLowerCase().includes(selectedCategory.toLowerCase())
                            );
    
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <SEOHead seo={seo} path="/companies" />
      <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="mb-12">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {t('companies.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('companies.subtitle')}
            </p>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="mb-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder={t('companies.search')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="md:w-64">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="luxury">Luxury Homes</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Companies Grid */}
        <section>
          <div className="max-w-7xl mx-auto">
            {filteredCompanies.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {t('companies.noResults')}
                </h3>
                <p className="text-muted-foreground">
                  {t('companies.noResultsDesc')}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCompanies.map((company) => (
                  <Card key={company.id} className="backdrop-blur-sm bg-background/95 hover:shadow-xl transition-all">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 border-primary/20">
                          <ImageWithFallback
                            src={company.logo}
                            alt={company.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-xl">{company.name}</CardTitle>
                            {company.verified && (
                              <Badge className="bg-primary/10 text-primary border-primary/20">
                                {t('companies.verified')}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                              <span>{company.rating}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Home className="h-4 w-4" />
                              <span>{company.properties} {t('companies.properties')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{company.employees}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">{company.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>{company.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-primary" />
                          <span>{company.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-primary" />
                          <span>{company.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Globe className="h-4 w-4 text-primary" />
                          <span>{company.website}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {company.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button className="flex-1">
                          {t('companies.viewProperties')}
                        </Button>
                        <Button variant="outline">
                          {t('companies.contact')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
