import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';
import { 
  Home as HomeIcon, 
  Search, 
  MapPin, 
  Award, 
  ArrowRight,
  Building2,
  TrendingUp,
  Users,
  Star
} from 'lucide-react';

export function Home() {
  const seo = seoUtils.getPageSEO('home');
  
  const stats = [
    {
      icon: <HomeIcon className="h-6 w-6" />,
      value: '12,500+',
      label: 'Properties Listed',
    },
    {
      icon: <Search className="h-6 w-6" />,
      value: '3,200+',
      label: 'Wanted Listings',
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      value: '45+',
      label: 'Cities Covered',
    },
    {
      icon: <Award className="h-6 w-6" />,
      value: '15+',
      label: 'Years Experience',
    },
  ];

  const features = [
    {
      icon: <Building2 className="h-8 w-8" />,
      title: 'Premium Listings',
      description: 'Curated selection of high-quality properties',
      link: '/properties',
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: 'Market Insights',
      description: 'Expert analysis and market trends',
      link: '/insights',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Expert Agents',
      description: 'Professional guidance from experienced realtors',
      link: '/agents',
    },
  ];

  const featuredProperties = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop',
      title: 'Modern Luxury Villa with Pool',
      price: '2,625M MMK',
      location: 'Golden Valley, Yangon',
      bedrooms: 5,
      bathrooms: 4,
      area: '4,500 sqft',
      featured: true,
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
      featured: false,
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
      featured: true,
    },
  ];

  return (
    <>
      <SEOHead seo={seo} path="/" />
      <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 gradient-primary animate-gradient opacity-10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptLTEyIDEyYzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02eiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] opacity-30" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Find Your Perfect Property with{' '}
            <span className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
              Jade Property
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in">
            Discover premium residential and commercial properties tailored to your needs. 
            From luxury homes to investment opportunities, we help you make informed decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button size="lg" className="gradient-primary shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105">
              Browse Properties
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-primary/30 hover:bg-primary/5">
              Learn More
            </Button>
          </div>
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
                  <p className="text-muted-foreground group-hover:text-foreground transition-colors">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive real estate solutions powered by cutting-edge technology
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group relative h-full cursor-pointer hover:shadow-xl transition-all border-border/50 hover:border-primary/50"
              >
                <CardHeader className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-[#4a9b82] text-white mb-4 shadow-lg shadow-primary/25 group-hover:shadow-primary/50 group-hover:scale-110 transition-all">
                    {feature.icon}
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                  <CardDescription className="group-hover:text-foreground transition-colors">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button variant="outline" className="group-hover:bg-primary group-hover:text-white transition-all">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-4">Featured Properties</h2>
              <p className="text-muted-foreground">
                Discover premium properties handpicked for you
              </p>
            </div>
            <Link to="/properties">
              <Button variant="outline" className="border-primary/30 hover:bg-primary/5">
                View All Properties
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map(property => (
              <Card key={property.id} className="group hover:shadow-xl transition-all cursor-pointer border-border/50 hover:border-primary/50">
                <div className="relative overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {property.featured && (
                    <Badge className="absolute top-4 left-4 bg-gradient-to-r from-amber-400 to-amber-600 text-white border-0">
                      <Star className="h-3 w-3 mr-1 fill-white" />
                      Featured
                    </Badge>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="group-hover:text-primary transition-colors">{property.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-primary" />
                    {property.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">{property.price}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{property.bedrooms} beds</span>
                      <span>{property.bathrooms} baths</span>
                      <span>{property.area}</span>
                    </div>
                  </div>
                  <Button className="w-full group-hover:bg-primary group-hover:text-white transition-all">
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 gradient-primary animate-gradient" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptLTEyIDEyYzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02eiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] opacity-30" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="mb-4 text-white text-3xl font-bold">Ready to Find Your Dream Property?</h2>
          <p className="mb-8 text-white/90 text-lg">
            Join thousands of satisfied clients who found their perfect property with us
          </p>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="shadow-2xl hover:scale-105 transition-transform">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
    </>
  );
}

